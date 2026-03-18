import { NextRequest, NextResponse } from "next/server";
import { storageManager } from "@/utils/server/storageManager";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { ApplicationBase } from "@/type/pages/dashboard/application";

const ANVIL_WEBHOOK_TOKEN = process.env.ANVIL_WEBHOOK_TOKEN!;

export async function POST(request: NextRequest) {
  let body: any;

  try {
    body = await request.json();
  } catch (error) {
    console.error('Anvil webhook: Failed to parse request body', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (body.token !== ANVIL_WEBHOOK_TOKEN) {
    console.error('Anvil webhook: Invalid token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Anvil webhook raw body:', JSON.stringify(body, null, 2));

  const { action, data } = body;
  console.log('Anvil webhook received:', action);

  try {
    if (action === 'etchPacketComplete') {
      await handleEtchPacketComplete(data);
    } else if (action === 'signerComplete') {
      await handleSignerComplete(data);
    } else {
      console.log('Anvil webhook: Unhandled action', action);
    }
  } catch (error) {
    console.error(`Anvil webhook: Error handling action "${action}"`, error);
  }

  return NextResponse.json({ ok: true });
}

async function handleEtchPacketComplete(data: any) {
  const { eid: etchPacketEid, documentGroup, downloadZipURL } = data;

  if (!etchPacketEid) {
    throw new Error('Missing eid in webhook payload');
  }

  if (!documentGroup?.eid) {
    throw new Error('Missing documentGroup.eid in webhook payload');
  }

  const transactionDocumentQB = new SupabaseQueryBuilder<TransactionDocumentBase>(
    'document_transactions'
  );

  const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');

  const transactionDoc = await transactionDocumentQB.findOneByCondition({
    esign_document_id: etchPacketEid,
  });

  if (!transactionDoc) {
    console.warn('Anvil webhook: No transaction document found for etchPacketEid:', etchPacketEid);
    return;
  }

  if (transactionDoc.status === 'completed') {
    console.log('Anvil webhook: Transaction already completed, skipping:', transactionDoc.id);
    return;
  }

  // Fetch the zip directly from Anvil's URL
  const response = await fetch(downloadZipURL, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.ANVIL_API_KEY}:`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download zip from Anvil: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log('Anvil webhook: Downloaded zip, size:', buffer.byteLength, 'bytes');

  const file = new File(
    [buffer],
    `signed-${transactionDoc.id}-${Date.now()}.zip`,
    { type: 'application/zip' }
  );

  const { publicUrl } = await storageManager.uploadFile(file, {
    bucket: 'documents',
    folder: 'transactions',
  });

  if (!publicUrl) throw new Error('Supabase upload returned no public URL');

  console.log('Anvil webhook: Uploaded to storage:', publicUrl);

  await transactionDocumentQB.update(transactionDoc.id, {
    generated_document_url: publicUrl,
    status: 'completed',
    completed_at: new Date().toISOString(),
  });

  await updateApplicationStageOnCompletion(
    applicationQB,
    transactionDoc.application_id,
    transactionDoc.document_type
  );

  console.log('Anvil webhook: Transaction completed successfully:', transactionDoc.id);
}

async function handleSignerComplete(data: any) {
  const { etchPacket, aliasId, eid, name, email, status, completedAt, routingOrder, signers } = data;

  if (!etchPacket?.eid) {
    throw new Error('Missing etchPacket.eid in signerComplete payload');
  }

  const transactionDocumentQB = new SupabaseQueryBuilder<TransactionDocumentBase>(
    'document_transactions'
  );
  const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');


  const transactionDoc = await transactionDocumentQB.findOneByCondition({
    esign_document_id: etchPacket.eid,
  });

  if (!transactionDoc) {
    console.warn('Anvil webhook: No transaction document found for etchPacketEid:', etchPacket.eid);
    return;
  }

  const existingSignatures = (transactionDoc.signatures as Record<string, any>) || {};

  const updatedSignatures = {
    ...existingSignatures,
    [aliasId]: {                
      eid,
      name,
      email,
      status,
      routingOrder,
      completedAt,
    },
  };

  const allSigners = signers ?? [];
  const completedCount = allSigners.filter((s: any) => s.status === 'completed').length;
  const totalCount = allSigners.length;
  const transactionStatus = completedCount === totalCount ? 'completed' : 'partially_signed';

  await transactionDocumentQB.update(transactionDoc.id, {
    signatures: updatedSignatures,
    status: transactionStatus,
  });

  await updateApplicationStageOnSignature(
    applicationQB,
    transactionDoc.application_id,
    transactionDoc.document_type,
    aliasId,
    completedCount,
    totalCount
  );

  console.log(`Anvil webhook: Signer "${aliasId}" (${name}) completed. ${completedCount}/${totalCount} signed.`);
}


async function updateApplicationStageOnCompletion(
  applicationQB: SupabaseQueryBuilder<ApplicationBase>,
  applicationId: string,
  documentType: string
): Promise<void> {
  try {
    const application = await applicationQB.findById(applicationId);
    if (!application) {
      console.warn('Application not found:', applicationId);
      return;
    }

    const currentStage = application.stages_completed.terms_agreement;

    await applicationQB.update(applicationId, {
      stages_completed: {
        ...application.stages_completed,
        terms_agreement: {
          ...currentStage,
          status: currentStage?.status || 'current',
          completed: currentStage?.completed || false,
          data: {
            ...currentStage?.data,
            [`${documentType}_status`]: 'completed',
            [`${documentType}_completed_at`]: new Date().toISOString(),
          }
        }
      }
    });

    console.log(`Updated terms and agreement: ${documentType} completed`);
  } catch (error) {
    console.error('Failed to update application stage on completion:', error);
  }
}

async function updateApplicationStageOnSignature(
  applicationQB: SupabaseQueryBuilder<ApplicationBase>,
  applicationId: string,
  documentType: string,
  signerRole: string,
  completedCount: number,
  totalCount: number
): Promise<void> {
  try {
    const application = await applicationQB.findById(applicationId);
    if (!application) {
      console.warn('Application not found:', applicationId);
      return;
    }

    const currentStage = application.stages_completed.terms_agreement;
    const signatureStatus = completedCount === totalCount ? 'fully_signed' : 'partially_signed';

    await applicationQB.update(applicationId, {
      stages_completed: {
        ...application.stages_completed,
        terms_agreement: {
          ...currentStage,
          status: currentStage?.status || 'current',
          completed: currentStage?.completed || false,
          data: {
            ...currentStage?.data,
            [`${documentType}_signature_status`]: signatureStatus,
            [`${documentType}_${signerRole}_signed_at`]: new Date().toISOString(),
            [`${documentType}_signatures_completed`]: completedCount,
            [`${documentType}_signatures_total`]: totalCount,
          }
        }
      }
    });

    console.log(`Updated terms and agreement: ${documentType} - ${signerRole} signed (${completedCount}/${totalCount})`);
  } catch (error) {
    console.error('Failed to update application stage on signature:', error);
  }
}
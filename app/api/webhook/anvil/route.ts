import { NextRequest, NextResponse } from "next/server";
import Anvil from '@anvilco/anvil';
import { storageManager } from "@/utils/server/storageManager";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";

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

  const transactionDocumentQueryBuilder = new SupabaseQueryBuilder<TransactionDocumentBase>(
    'document_transactions'
  );

  const transactionDoc = await transactionDocumentQueryBuilder.findOneByCondition({
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

  // ✅ Option A — use downloadZipURL directly (simpler, no extra API call)
  const anvilClient = new Anvil({ apiKey: process.env.ANVIL_API_KEY! });
  const { statusCode, data: pdfBuffer } = await anvilClient.downloadDocuments(
    documentGroup.eid
  );

  if (statusCode !== 200 || !pdfBuffer) {
    throw new Error(`Anvil download returned unexpected status: ${statusCode}`);
  }

  const file = new File(
    [pdfBuffer],
    `signed-${transactionDoc.id}-${Date.now()}.zip`,
    { type: 'application/zip' }
  );

  const { publicUrl } = await storageManager.uploadFile(file, {
    bucket: 'documents',
    folder: 'transactions',
  });

  if (!publicUrl) {
    throw new Error('Supabase upload returned no public URL');
  }

  await transactionDocumentQueryBuilder.update(transactionDoc.id, {
    generated_document_url: publicUrl,
    status: 'completed',
    completed_at: new Date().toISOString(),
  });

  console.log('Anvil webhook: Transaction completed successfully:', transactionDoc.id);
}

async function handleSignerComplete(data: any) {
  const { etchPacket, aliasId, eid, name, email, status, completedAt, routingOrder, signers } = data;

  if (!etchPacket?.eid) {
    throw new Error('Missing etchPacket.eid in signerComplete payload');
  }

  const transactionDocumentQueryBuilder = new SupabaseQueryBuilder<TransactionDocumentBase>(
    'document_transactions'
  );

  const transactionDoc = await transactionDocumentQueryBuilder.findOneByCondition({
    esign_document_id: etchPacket.eid,
  });

  if (!transactionDoc) {
    console.warn('Anvil webhook: No transaction document found for etchPacketEid:', etchPacket.eid);
    return;
  }

  // Build the updated signatures object by merging into existing
  const existingSignatures = (transactionDoc.signatures as Record<string, any>) || {};

  const updatedSignatures = {
    ...existingSignatures,
    [aliasId]: {                        // keyed by "buyer" or "seller"
      eid,
      name,
      email,
      status,
      routingOrder,
      completedAt,
    },
  };

  // Derive overall transaction status from all signers
  const allSigners = signers ?? [];
  const completedCount = allSigners.filter((s: any) => s.status === 'completed').length;
  const totalCount = allSigners.length;
  const transactionStatus = completedCount === totalCount ? 'completed' : 'partially_signed';

  await transactionDocumentQueryBuilder.update(transactionDoc.id, {
    signatures: updatedSignatures,
    status: transactionStatus,
  });

  console.log(`Anvil webhook: Signer "${aliasId}" (${name}) completed. ${completedCount}/${totalCount} signed.`);
}
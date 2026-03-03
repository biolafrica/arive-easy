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
  
  const { action, data } = body;
  console.log('Anvil webhook received:', action);

  try {
    if (action === 'etchPacketComplete') {
      await handleEtchPacketComplete(data);
    } else {
      console.log('Anvil webhook: Unhandled action', action);
    }
  } catch (error) {
    console.error(`Anvil webhook: Error handling action "${action}"`, error);
    // Optional: save failed webhook to DB for manual retry later
  }

  return NextResponse.json({ ok: true });
}

async function handleEtchPacketComplete(data: any) {
  const { etchPacketEid, documentGroup } = data;

  if (!etchPacketEid) {
    throw new Error('Missing etchPacketEid in webhook payload');
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

  const anvilClient = new Anvil({ apiKey: process.env.ANVIL_API_KEY! });
  const { statusCode, data: pdfBuffer, errors } = await anvilClient.downloadDocuments(
    documentGroup.eid
  );

  if (errors && errors.length > 0) {
    throw new Error(`Anvil download failed: ${errors.map((e: any) => e.message).join(', ')}`);
  }

  if (statusCode !== 200 || !pdfBuffer) {
    throw new Error(`Anvil download returned unexpected status: ${statusCode}`);
  }

  console.log('Anvil webhook: Downloaded signed document, size:', pdfBuffer.byteLength ?? 'unknown');

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

  console.log('Anvil webhook: Uploaded signed document to storage:', publicUrl);

  await transactionDocumentQueryBuilder.update(transactionDoc.id, {
    generated_document_url: publicUrl,
    status: 'completed',
    completed_at: new Date().toISOString(),
  });

  console.log('Anvil webhook: Transaction completed successfully:', transactionDoc.id);
}
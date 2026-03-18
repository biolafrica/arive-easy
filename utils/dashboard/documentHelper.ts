import { ApplicationBase } from '@/type/pages/dashboard/application';

export interface DocumentInfo {
  type: string;
  status: 'sent' | 'partially_signed' | 'completed';
  sentAt?: string;
  completedAt?: string;
  signaturesCompleted?: number;
  signaturesTotal?: number;
  buyerSignedAt?: string;
  sellerSignedAt?: string;
}


export function getDynamicDocuments(
  stageData: ApplicationBase['stages_completed']['terms_agreement']
): DocumentInfo[] {
  if (!stageData?.data) return [];

  const documents: DocumentInfo[] = [];
  const data = stageData.data;

  const dynamicDocTypes = ['contract_of_sales', 'mortgage_agreement', 'under_writtten'];

  for (const docType of dynamicDocTypes) {
    const status = data[`${docType}_status`];
    
    if (status) {
      documents.push({
        type: docType,
        status: data[`${docType}_signature_status`] || status,
        sentAt: data[`${docType}_sent_at`],
        completedAt: data[`${docType}_completed_at`],
        signaturesCompleted: data[`${docType}_signatures_completed`],
        signaturesTotal: data[`${docType}_signatures_total`],
        buyerSignedAt: data[`${docType}_buyer_signed_at`],
        sellerSignedAt: data[`${docType}_seller_signed_at`],
      });
    }
  }

  return documents;
}


export function getStaticDocuments(
  stageData: ApplicationBase['stages_completed']['mortgage_activation']
): DocumentInfo[] {
  if (!stageData?.data) return [];

  const documents: DocumentInfo[] = [];
  const data = stageData.data;

  const staticDocTypes = [
    'certificate_of_occupancy',
    'valuation_report',
    'governor-consent',
    'deed_of_conveyance',
    'survery_plan',
    'building_plan',
  ];

  for (const docType of staticDocTypes) {
    if (data[docType] === true || data[`${docType}_status`]) {
      documents.push({
        type: docType,
        status: data[`${docType}_status`] || 'completed',
        sentAt: data[`${docType}_uploaded_at`],
        completedAt: data[`${docType}_completed_at`],
      });
    }
  }

  return documents;
}
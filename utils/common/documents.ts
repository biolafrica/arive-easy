import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { humanizeSnakeCase } from "./humanizeSnakeCase";


export interface DocumentFile {
  name: string;
  url: any;
  type?: string; 
  status?: string; 
}

export type ApprovalDocumentFile = Omit<DocumentFile, 'url'> &{
  url:string
}


export function formatDocumentFiles(
  documents: TransactionDocumentBase[],
  options: {
    humanize?: boolean;
    includeStatus?: boolean;
    filterByUrl?: boolean;
  } = {}
): DocumentFile[] {
  const {
    humanize = true,
    includeStatus = false,
    filterByUrl = true
  } = options;

  if (!documents || !Array.isArray(documents)) {
    return [];
  }

  return documents
    .filter((doc) => {
      if (!doc.document_type) return false;
      
      if (filterByUrl && !doc.generated_document_url) return false;
      
      return true;
    })
    .map((doc) => {
      const file: DocumentFile = {
        name: humanize 
          ? humanizeSnakeCase(doc.document_type) 
          : doc.document_type,
        url: doc.generated_document_url || '',
        type: doc.document_type,
      };

      if (includeStatus && doc.status) {
        file.status = doc.status;
      }

      return file;
    });
}


export function formatPreApprovalDocuments(data: {
  pay_stubs?: File | string | null ;
  tax_returns?: File | string | null;
  bank_statements?: File | string | null;
  employment_verification?: File | string | null;
  [key: string]: any;
}): ApprovalDocumentFile[] {
  if (!data) return [];

  const documentMappings: Array<{
    key: keyof typeof data;
    name: string;
  }> = [
    { key: 'pay_stubs', name: 'Pay Stubs' },
    { key: 'tax_returns', name: 'Tax Returns' },
    { key: 'bank_statements', name: 'Bank Statements' },
    { key: 'employment_verification', name: 'Employment Verification' },
  ];

  return documentMappings
    .filter(({ key }) => data[key])
    .map(({ key, name }) => ({
      name,
      url: data[key] as string,
      type: key as string,
    }));
}


export function getEmptyDocumentsMessage(documentCount: number): {
  show: boolean;
  files: DocumentFile[];
} {
  if (documentCount > 0) {
    return { show: false, files: [] };
  }

  return {
    show: true,
    files: [{ name: 'No documents available', url: '', type: 'empty' }],
  };
}

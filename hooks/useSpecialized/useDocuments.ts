import { FinalPartnerDocument, PartnerDocumentBase, StaticTransactionData, StaticTransactionDocumentForm, TemplateBase, TemplateData, TemplateForm, TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { useCrud } from "../useCrud";
import { getEntityCacheConfig } from "@/lib/cache-config";
import { useAuthContext } from "@/providers/auth-provider";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";
import { toSlug } from "@/utils/common/toSlug";
import { TransactionBase } from "@/type/pages/dashboard/transactions";

export interface TransactionalDocumentResponse {
  success: boolean;
  transaction_document: {
    id: string;
    status: string;
    generated_document_url: string;
    signing_urls: Record<string, string>;
  };
  message: string;
}

export function useTemplateDocuments(params?: any) {
  const crud = useCrud<TemplateBase>({
    resource: 'documents/template',
    interfaceType: 'admin',
    cacheConfig: getEntityCacheConfig('documents', 'templates'),
  });
  console.log('params received', params)

  const { data, isLoading, error } = crud.useGetAll(params);

  console.log('data sent', data)

  return {
    templates: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function usePartnerDocuments(params?: any) {
  const crud = useCrud<PartnerDocumentBase>({
    resource: 'documents/partner',
    interfaceType: 'admin',
    cacheConfig: getEntityCacheConfig('documents', 'partners'),
  });

  const { data, isLoading, error } = crud.useGetAll(params);

  return {
    partners: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function useSellerPartnerDocuments(params?: any) {
  const { user, loading: isUserLoading } = useAuthContext();

  const crud = useCrud<PartnerDocumentBase>({
    resource: 'documents/partner',
    interfaceType: 'buyer',
    cacheConfig: getEntityCacheConfig('documents', 'partners'),
  });

  const queryParams = useMemo(() => {
    if (!user?.id) return null; 
    
    return {
      ...params,
      filters: {
        ...params?.filters,
        partner_id: user.id,
      }
    };
  }, [params, user?.id]);


  const { data, isLoading, error } = crud.useGetAll(
    queryParams || undefined, 
    !isUserLoading && !!user?.id 
  );

  return {
    sellers: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading || isUserLoading,
    error,
    ...crud,
  };
}

export function useUploadTemplateDocuments() {
  const { user } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);
  
  const { create, isCreating } = useCrud<TemplateBase>({
    resource: 'documents/template',
    interfaceType: 'admin',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      create: (data) => {
        toast.success(`${data.type} created successfully`);
      },
    },
    onError: {
      create: (error) => {
        toast.error(error?.error?.message || 'Failed to create template document');
      },
    },
  });

  const uploadDocument = async ( formData:TemplateForm) => {

    if (!user?.id) {
      toast.error('Please login to upload documents');
      return;
    }

    setIsUploading(true);

    try {
      let template_file_url:string|null = '';

      if (formData.template_file_url) {
        template_file_url = await apiClient.uploadToSupabase(
          formData.template_file_url, 
          'documents', 
          'templates'
        );
      }

      const template_number = generateApplicationRefNo('TEMP');
      const slug = toSlug(formData.name);

      const requires_signature = formData.requires_signature.reduce((acc, sig) => {
        acc[sig] = true;
        return acc;
      }, {} as Record<string, boolean>);

      const templateData: TemplateData = {
        name: formData.name,
        slug,
        description: formData.description || '',
        type: formData.type,
        category: formData.category,
        version: formData.version,
        requires_signature,
        template_file_url,
        template_fields: formData.template_fields,
        template_number,
        status: 'active',
        created_by: user.id,
        anvil_template_id: formData.anvil_template_id
      };

      const result = await create(templateData);
      return result;

    } catch (error) {
      console.error('Template upload error:', error);
      toast.error('Failed to upload template document');
      throw error;

    } finally {
      setIsUploading(false);
    }
  };


  return {
    uploadDocument,
    isUploading: isUploading || isCreating,
  };
}

export function useUploadStaticDocuments() {
  const { user } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);

  const { create, isCreating } = useCrud<TransactionDocumentBase>({
    resource: 'documents/transaction',
    interfaceType: 'admin',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      create: (data) => {
        toast.success(`${data.document_type} created successfully`);
      },
    },
    onError: {
      create: (error) => {
        toast.error(error?.error?.message || `Failed to create document`);
      },
    },
  });

  const uploadDocument = async ( formData:StaticTransactionDocumentForm) => {
    if (!user?.id) {
      toast.error('Please login to upload documents');
      return;
    }

    setIsUploading(true);

    try {

      let generated_document_url:string|null = '';

      if (formData.generated_document_url) {
        generated_document_url = await apiClient.uploadToSupabase(
          formData.generated_document_url, 
          'documents', 
          'transactions'
        );
      }

      const transaction_document_number = generateApplicationRefNo('TRD')

      const transactionDocumentData:StaticTransactionData ={
        transaction_document_number,
        generated_document_url,
        application_id: formData.application_id,
        document_type:formData.document_type
      }

      const result = await create(transactionDocumentData)
      return result
      
    } catch (error) {
      console.error('Template upload error:', error);
      toast.error('Failed to upload template document');
      throw error;
      
    }finally{
      setIsUploading(false);

    }

  }

  return {
    uploadDocument,
    isUploading: isUploading || isCreating,
  };

}

export function useUploadPartnerDocuments() {
  const { user } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);
  
  const { create, isCreating } = useCrud<PartnerDocumentBase>({
    resource: 'documents/partner',
    interfaceType: 'admin',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      create: (data) => {
        toast.success('Partner document created successfully');
      },
    },
    onError: {
      create: (error) => {
        toast.error(error?.error?.message || 'Failed to create partner document');
      },
    },
  });

  const uploadDocument = async ( formData:FinalPartnerDocument) => {

    if (!user?.id) {
      toast.error('Please login to upload documents');
      return;
    }

    setIsUploading(true);

    if(formData.document_type !== "contract_of_sales"){
      return toast.error('Only seller can create this document type');
    }

    try {
      const result = await create({
        ...formData,
        partner_id: user.id,
        partner_type: 'bank'
      });
      return result;

    } catch (error) {
      console.error('Partner Document upload error:', error);
      toast.error('Failed to upload partner document');
      throw error;

    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading: isUploading || isCreating,
  };
}

export function useTemplateDocument(documentType?: string) {
  const crud = useCrud<TemplateBase>({
    resource: 'documents/template',
    interfaceType: 'admin',
    cacheConfig: getEntityCacheConfig('documents', 'templates'),
  });

  const queryParams = useMemo(() => ({
    filters: {
      ...(documentType && { type: documentType }),
      status: 'active',
    },
    limit: 1, 
  }), [documentType]);

  const { data, isLoading, error } = crud.useGetAll(queryParams);


  console.log('data sent', data)

  return {
    template: data?.data[0] || null,
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function useTransactionalDocuments() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContractDocument = async (params: {
    applicationId: string;
    documentType: string;
  }): Promise<TransactionalDocumentResponse | null> => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate document');
      }

      const result: TransactionalDocumentResponse = await response.json();
      
      toast.success('Document generated and sent for signature successfully!');
      
      return result;

    } catch (error) {
      console.error('Error generating document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate document');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContractDocument,
    isGenerating,
  };
}



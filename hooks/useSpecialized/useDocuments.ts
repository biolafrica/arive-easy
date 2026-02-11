import { PartnerDocumentBase, TemplateBase } from "@/type/pages/dashboard/documents";
import { useCrud } from "../useCrud";
import { getEntityCacheConfig } from "@/lib/cache-config";
import { useAuthContext } from "@/providers/auth-provider";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export function useTemplateDocuments(params?: any) {
  const crud = useCrud<TemplateBase>({
    resource: 'documents/template',
    interfaceType: 'admin',
    cacheConfig: getEntityCacheConfig('documents', 'templates'),
  });

  const { data, isLoading, error } = crud.useGetAll(params);

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

export function useUploadTemplateDocument() {
  const { user } = useAuthContext();
  const { create, isCreating } = useCrud<TemplateBase>({
    resource: 'documents/template',
    interfaceType: 'admin',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      create: (data) => {
        toast.success('template document uploaded successfully');
      },
    },
    onError: {
      create: (error) => {
        toast.error(error?.error?.message || 'Failed to upload document');
      },
    },
  });

  const uploadDocument = async (file: File, metadata?: Partial<TemplateBase>) => {
    if (!user?.id) {
      toast.error('Please login to upload documents');
      return;
    }

    const  template_file_url = await apiClient.uploadToSupabase(file)
    return create({
      ...metadata,
      created_by: user.id,
      template_file_url : template_file_url || '',
    })
  };

  return {
    uploadDocument,
    isUploading: isCreating,
  };
}

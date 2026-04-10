import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAuthContext } from '@/providers/auth-provider';
import { queryKeys } from '@/lib/query-keys';
import { UserAvatarForm, UserBase } from '@/type/user';
import { useRouter } from 'next/navigation';
import { useCrud } from '../useCrud';
import { toast } from 'sonner';
import { getEntityCacheConfig } from "@/lib/cache-config";
import { createEntityHooks } from './useFactory';
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@/utils/supabase/client';
import { clearUserSession } from '@/utils/auth/clearUserSession';
import { captureError } from '@/utils/auth/captureError';

interface SendWelcomeEmailParams {
  userId: string;
  email: string;
  userName: string;
  role: 'user' | 'seller' | 'admin' | 'agent';
}

interface WelcomeEmailResponse {
  success: boolean;
  message: string;
}

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
}

const userHooks = createEntityHooks<
  UserBase,
  'users',
  'list',
  'detail'
>({
  resource: 'user',
  cacheKey: 'users',
  listSubKey: 'list',
  detailSubKey: 'detail',
  buyerInterface: 'client',
  createInterface: 'client',
});

export const useAdminUsers = userHooks.useAdminList;

export function useWelcomeEmail() {
  const mutation = useMutation<WelcomeEmailResponse, ApiError, SendWelcomeEmailParams>({
    mutationFn: async (params) => {
      return apiClient.post<WelcomeEmailResponse>('/api/user/welcome', params);
    },
    onSuccess: (_data, variables) => {
      console.log(`Welcome email sent to ${variables.email}`);
    },
    onError: (error, variables) => {
      // Welcome emails are invisible to the user — log only, no toast
      console.error('Failed to send welcome email:', error);
    },
    retry: 2,
    retryDelay: 1000,
  });

  const sendWelcomeEmail = async (params: SendWelcomeEmailParams) => {
    try {
      await mutation.mutateAsync(params);
    } catch (error) {
      // Swallow — failure is logged in onError above, no user-facing impact
    }
  };

  return {
    sendWelcomeEmail,
    isSending: mutation.isPending,
  };
}

export function useCurrentUsers() {
  const { user, loading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      if (!user?.id) throw new Error('No user logged in');
      return apiClient.get<UserBase>(`/api/user/me?id=${user.id}`);
    },
    enabled: !!user?.id && !authLoading,
    ...getEntityCacheConfig('profile', 'own'),
  });
}

export function useUserRegistration(team: boolean) {
  const router = useRouter();
  const { create } = useCrud({
    resource: 'user',
    interfaceType: 'client',
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (_data: UserBase) => {
        if (team) {
          toast.success('Team member created successfully');
        } else {
          router.push('/auth/verify-email-sent');
        }
      },
    },
    onError: {
      // showNotifications is false so the factory will NOT toast.
      // This callback is the single source of the error toast for registration.
      create: (error) => {
        captureError(error, { component: 'useUserRegistration', action: 'create-user' });
        const raw = error?.error?.message ?? '';
        if (raw.includes('duplicate key value violates unique constraint')) {
          toast.error('An account with this email already exists. Please sign in.');
        } else {
          // Do NOT forward `raw` — it may contain schema/constraint details
          toast.error('Registration failed. Please check your details and try again.');
        }
      },
    },
  });

  return create;
}

export function useUpdateProfile() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserAvatarForm) => {
      let updateData: Partial<UserBase> = { ...data };
      
      if (data.avatarFile) {
        try {
          const avatarUrl = await apiClient.uploadToSupabase(
            data.avatarFile,
            'media',
            `users/${user?.id}`
          );
          if (avatarUrl) {
            updateData.avatar = avatarUrl;
          }
        } catch (error) {
          // Upload error is internal — surface a friendly message
          throw new Error('avatar-upload-failed');
        }
        delete (updateData as any).avatarFile;
      }
      
      return apiClient.put(`/api/user/me?id=${user?.id}`, updateData);
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      queryClient.setQueryData(queryKeys.users.current(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
    },
    onError: (error: any) => {
      // Map internal sentinel to a friendly message; never forward raw API text
      if (error?.message === 'avatar-upload-failed') {
        toast.error('Failed to upload your profile photo. Please try again.');
      } else {
        toast.error('Failed to update your profile. Please try again.');
      }
    },
  });
}

export function useSubscriber() {
  const { create, isCreating } = useCrud({
    resource: 'subscribers',
    interfaceType: 'client',
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (_data: Subscriber) => {
        toast.success('Subscribed successfully');
      },
    },
    onError: {
      // showNotifications is false — this is the single toast source for subscribe errors
      create: (error) => {
        const raw = error?.error?.message ?? '';
        if (raw.includes('duplicate key value violates unique constraint')) {
          toast.error('This email is already subscribed.');
        } else {
          toast.error('Subscription failed. Please try again.');
        }
      },
    },
  });

  return { create, isCreating };
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
 
  const logout = async () => {
    const supabase = createClient();
 
    try {
      const { error } = await supabase.auth.signOut();
 
      if (error) {
        Sentry.captureException(error, { tags: { component: 'logout' } });
        toast.error('Failed to log out. Please try again.');
        return;
      }
 
      await clearUserSession(queryClient);
      toast.success('You have been logged out successfully.');
      router.push('/signin');
      
    } catch (err) {
      if ((err as Error)?.name === 'CancelledError') return;
      Sentry.captureException(err, { tags: { component: 'logout' } });
      toast.error('An unexpected error occurred. Please try again.');
    }
  };
 
  return { logout };
}
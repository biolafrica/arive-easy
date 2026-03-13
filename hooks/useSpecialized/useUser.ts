
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAuthContext } from '@/providers/auth-provider';
import { queryKeys } from '@/lib/query-keys';
import { UserAvatarForm, UserBase } from '@/type/user';
import { useRouter } from 'next/navigation';
import { useCrud } from '../useCrud';
import { toast } from 'sonner';
import { getEntityCacheConfig, } from "@/lib/cache-config";
import { createEntityHooks } from './useFactory';
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@/utils/supabase/client';
import { clearUserSession } from '@/utils/auth/clearUserSession';

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
      const response = await apiClient.post<WelcomeEmailResponse>(
        '/api/user/welcome',
        params
      );
      return response;
    },
    onSuccess: (data, variables) => {
      console.log(`Welcome email sent to ${variables.email}`);
    },
    onError: (error, variables) => {
      console.error('Failed to send welcome email:', error);
    },
    retry: 2,
    retryDelay: 1000,
  });

  const sendWelcomeEmail = async (params: SendWelcomeEmailParams) => {
    try {
      await mutation.mutateAsync(params);
    } catch (error) {
      console.error('Welcome email error:', error);
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
      if (!user?.id) {
        throw new Error('No user logged in');
      }
      const response = await apiClient.get<UserBase>(`/api/user/me?id=${user.id}`);
      return response;
    },
    enabled: !!user?.id && !authLoading,
    ...getEntityCacheConfig('profile', 'own'),
  });
}

export function useUserRegistration() {
  const router = useRouter();
  const {
    create,
  } = useCrud({
    resource: 'user',
    interfaceType: 'client', 
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (data:UserBase) => {
        router.push('/auth/verify-email-sent')
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || "Registration failed";
        
        if (message.includes("already registered")) {
          toast.error("This email is already registered. Please login instead.");
        } else {
          toast.error(message);
        }
      },
    },
  });


  return create
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
          console.error('Avatar upload failed:', error);
          throw new Error('Failed to upload avatar');
        }
        
        delete (updateData as any).avatarFile;
      }
      
      const response = await apiClient.put(`/api/user/me?id=${user?.id}`, updateData);
      return response;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      queryClient.setQueryData(queryKeys.users.current(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Failed to update profile');
    },
  });
}


export function useSubscriber() {
  const {
    create,
  } = useCrud({
    resource: 'subscribers',
    interfaceType: 'client', 
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (data:Subscriber) => {
        toast.success("successfully subscribed")
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || "Subscription failed, try again";
        
        if (message.includes("duplicate key value violates unique constraint")) {
          toast.error("This email is already subscribed.");
        } else {
          toast.error(message);
        }
      },
    },
  });


  return create
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
        toast.error('Failed to logout. Please try again.', {
          description: error.message,
        });
        return;
      }
 
      await clearUserSession(queryClient);
 
      toast.success('Successfully logged out.', {
        description: 'You have been logged out of your account.',
      });
 
      router.push('/signin');
    } catch (err) {
      Sentry.captureException(err, { tags: { component: 'logout' } });
      toast.error('An unexpected error occurred during logout.', {
        description: String(err),
      });
    }
  };
 
  return { logout };
}
 

import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';

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
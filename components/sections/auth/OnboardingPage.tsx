'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/primitives/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role?: string;
}

const ROLE_OPTIONS = [
  { value: 'user', title: 'Homebuyer', description: 'Looking to buy property', icon: '🏠', activeClassName: 'border-border bg-background text-heading'},
  { value: 'seller', title: 'Seller', description: 'Listing properties', icon: '🏢', activeClassName: 'border-accent bg-accent/5 text-accent'},
] as const;


export default function OnboardingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isWelcome = searchParams.get('welcome') === 'true';

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push('/signin');
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

      if (existingProfile?.role) {
        const dashboardRoute = existingProfile.role === 'seller' ? '/seller-dashboard' : '/user-dashboard';
        router.push(dashboardRoute);
        return;
      }

      setProfile({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        role: existingProfile?.role,
      });

      if (existingProfile?.role) {
        setSelectedRole(existingProfile.role);
      }

    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile', {description: error instanceof Error ? error.message : ''});
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error: updateError } = await supabase
      .from('users')
      .update({role: selectedRole, updated_at: new Date().toISOString()})
      .eq('id', profile.id);

      if (updateError) throw updateError;

      const response = await fetch('/api/update-user-metadata', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: profile.id, role: selectedRole}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user metadata');
      }

      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Failed to refresh session:', refreshError);
      }

      toast.success('Profile completed successfully!', {description: 'Redirecting to your dashboard...'});
      
      
      await new Promise(resolve => setTimeout(resolve, 500));

      if (selectedRole === 'seller') {
        router.push('/seller-dashboard/');
      } else {
        router.push('/user-dashboard/');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to complete profile', {description: error instanceof Error ? error.message : ''});
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {isWelcome && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Ariveasy!</h2>
            <p className="mt-2 text-gray-600">
              Your account has been created successfully.
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Your Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">Name:</span>{' '}
              <span className="font-medium text-gray-900">{profile?.name || 'Not provided'}</span>
            </p>
            <p>
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium text-gray-900">{profile?.email}</span>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Please provide a few more details to personalize your experience.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>

            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((role) => (
                <RoleOptionCard
                  key={role.value}
                  value={role.value}
                  selected={selectedRole === role.value}
                  onSelect={setSelectedRole}
                  icon={role.icon}
                  title={role.title}
                  description={role.description}
                  activeClassName={role.activeClassName}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleCompleteProfile}
              disabled={isSaving}
              fullWidth
            >
              {isSaving ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


interface RoleOptionCardProps {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  activeClassName?: string;
}

export function RoleOptionCard({
  value,
  selected,
  onSelect,
  icon,
  title,
  description,
  activeClassName = 'border-orange-900 bg-orange-100 text-heading',
}: RoleOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`
        p-4 border-2 rounded-lg text-center transition-all
        ${selected
          ? activeClassName
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500 mt-1">
        {description}
      </div>
    </button>
  );
}

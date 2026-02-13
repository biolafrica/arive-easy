"use client"

import { PreApprovalCard } from "@/components/cards/dashboard/preApprovalCard";
import ErrorState from "@/components/feedbacks/ErrorState";
import { getStepPath, useCreatePreApproval, usePreApprovals } from "@/hooks/useSpecialized/usePreApproval";
import { useAuthContext } from "@/providers/auth-provider";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function PreApprovalDashboardDisplayLogic() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const { preApprovals, isLoading, error ,refresh} = usePreApprovals({
    filters: {
      user_id: user?.id,
    }
  });

  if (error) {
    return (
      <ErrorState
        message="Error loading your dashboard data."
        retryLabel="Reload dashboard data"
        onRetry={refresh}
      />
    );
  }

  const { submitPreApproval } = useCreatePreApproval();

  const handleGetPreApproved = useCallback(async() => {
    if (isCreating) return;
    
    try {
      setIsCreating(true);
      
      const existingDraft = preApprovals?.find(p => p.status === 'draft');
      
      if (existingDraft) {
        const path = getStepPath(existingDraft.current_step, existingDraft.id);
        router.push(path);
        return;
      }
      
      const referenceNumber = generateApplicationRefNo();
      
      const newPreApproval = await submitPreApproval({
        reference_number: referenceNumber,
        user_id: user?.id,
        user_name: user?.user_metadata.name,
        current_step: 0,
        completed_steps: 0,
        is_complete: false,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (newPreApproval) {
        router.push(`/user-dashboard/applications/${newPreApproval.id}/pre-approval`);
      }

    } catch (error) {
      console.error('Failed to create pre-approval:', error);
      toast.error('Failed to start pre-approval. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, preApprovals, router, submitPreApproval, user?.id]);


  const handleGoToApplication = useCallback(async()=>{
    return router.push('/user-dashboard/applications')
  },[router])


  const handleReapply = useCallback(() => {
    handleGetPreApproved();
  }, [handleGetPreApproved]);

  const checkIfExpired = useCallback((createdAt: string): boolean => {
    const createdDate = new Date(createdAt);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return createdDate < threeMonthsAgo;
  }, []);

  const preApprovalDisplay = useMemo(() => {
    if (!preApprovals || preApprovals.length === 0) {
      return {
        status: 'not_started' as const,
        data: null,
        onPrimaryAction:handleGetPreApproved
      };
    }


    const sortedPreApprovals = [...preApprovals].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const latestPreApproval = sortedPreApprovals[0];
    const isExpired = checkIfExpired(latestPreApproval.created_at);

    
    if (latestPreApproval.status === 'approved' && isExpired) {
      return {
        status: 'expired' as const,
        data: latestPreApproval,
        onPrimaryAction:handleGetPreApproved
      };
    }

    switch (latestPreApproval.status) {
      case 'pending':
        return {
          status: 'under_review' as const,
          data: latestPreApproval,
          onPrimaryAction:handleGoToApplication

        };

      case 'draft':
        return {
          status: 'incomplete' as const,
          data: latestPreApproval,
          onPrimaryAction:() => {
            const url = getStepPath(latestPreApproval.current_step, latestPreApproval.id);
            router.push(url);
          }
        };

      case 'approved':
        if (latestPreApproval.conditions && latestPreApproval.conditions.length > 0) {
          return {
            status: 'approved_with_conditions' as const,
            data: latestPreApproval,
            conditions: latestPreApproval.conditions,
            amount:latestPreApproval.max_loan_amount,
            onPrimaryAction:handleGoToApplication
          };
        } else {
          return {
            status: 'approved' as const,
            data: latestPreApproval,
            onPrimaryAction:handleGoToApplication
          };
        }

      case 'rejected':
        return {
          status: 'rejected_with_guidance' as const,
          data: latestPreApproval,
          guidance: [
            ...(latestPreApproval.rejection_reasons || []),
            ...(latestPreApproval.guidance_notes ? [latestPreApproval.guidance_notes] : [])
          ],
          onPrimaryAction: () => {
            router.push(`/user-dashboard/applications/${latestPreApproval.id}/pre-approval/personal-info`);
          }
        };

      default:
        return {
          status: 'incomplete' as const,
          data: latestPreApproval,
          onPrimaryAction:() => {
            const url = getStepPath(latestPreApproval.current_step, latestPreApproval.id);
            router.push(url);
          }
        };
    }
  }, [preApprovals, checkIfExpired, handleGetPreApproved, handleGoToApplication, handleReapply, isCreating]);


  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div>
      <PreApprovalCard 
        status={preApprovalDisplay.status}
        amount={preApprovalDisplay.amount}
        conditions={preApprovalDisplay.conditions}
        guidance={preApprovalDisplay.guidance}
        onPrimaryAction={preApprovalDisplay.onPrimaryAction}
      />
    </div>
  );
}
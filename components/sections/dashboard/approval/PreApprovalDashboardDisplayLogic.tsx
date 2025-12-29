"use client"

import { PreApprovalCard } from "@/components/cards/dashboard/preApprovalCard";
import { usePreApprovals } from "@/hooks/useSpecialized/usePreApproval";
import { useAuthContext } from "@/providers/auth-provider";
import { useMemo } from "react";

export default function PreApprovalDashboardDisplayLogic() {
  const { user } = useAuthContext();
  const { preApprovals, isLoading } = usePreApprovals({
    filters: {
      user_id: user?.id,
    }
  });

  const preApprovalDisplay = useMemo(() => {
    // No pre-approvals - show not started
    if (!preApprovals || preApprovals.length === 0) {
      return {
        status: 'not_started' as const,
        data: null
      };
    }

    // Sort by created_at to get the most recent
    const sortedPreApprovals = [...preApprovals].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Get the most recent pre-approval
    const latestPreApproval = sortedPreApprovals[0];

    // Check if pre-approval is expired (3 months old)
    const isExpired = checkIfExpired(latestPreApproval.created_at);
    
    // If approved but expired, show expired status
    if (latestPreApproval.status === 'approved' && isExpired) {
      return {
        status: 'expired' as const,
        data: latestPreApproval
      };
    }

    // Check status and determine what to display
    switch (latestPreApproval.status) {
      case 'pending':
        return {
          status: 'under_review' as const,
          data: latestPreApproval
        };

      case 'draft':
        // Draft means incomplete
        return {
          status: 'incomplete' as const,
          data: latestPreApproval
        };

      case 'approved':
        // Check if there are conditions
        if (latestPreApproval.conditions && latestPreApproval.conditions.length > 0) {
          return {
            status: 'approved_with_conditions' as const,
            data: latestPreApproval,
            conditions: latestPreApproval.conditions,
            amount:latestPreApproval.max_loan_amount
          };
        } else {
          return {
            status: 'approved' as const,
            data: latestPreApproval
          };
        }

      case 'rejected':
        return {
          status: 'rejected_with_guidance' as const,
          data: latestPreApproval,
          guidance: [
            ...(latestPreApproval.rejection_reasons || []),
            ...(latestPreApproval.guidance_notes ? [latestPreApproval.guidance_notes] : [])
          ]
        };

      default:
        // Default to incomplete if status is unclear
        return {
          status: 'incomplete' as const,
          data: latestPreApproval
        };
    }
  }, [preApprovals]);

  // Helper function to check if pre-approval is expired
  function checkIfExpired(createdAt: string): boolean {
    const createdDate = new Date(createdAt);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return createdDate < threeMonthsAgo;
  }

  // Show loading state if needed
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
      />
    </div>
  );
}
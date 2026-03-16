import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { toast } from "sonner";
import {
  getStepPath,
  useCreatePreApproval,
  usePreApprovals,
} from "@/hooks/useSpecialized/usePreApproval";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";


export function useGetPreApproved() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const { items: preApprovals } = usePreApprovals({
    filters: { user_id: user?.id },
  });

  const { submitPreApproval } = useCreatePreApproval();

  const handleGetPreApproved = useCallback(async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);

      const existingDraft = preApprovals?.find((p) => p.status === "draft");

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
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (newPreApproval) {
        router.push(
          `/user-dashboard/applications/${newPreApproval.id}/pre-approval`
        );
      }
    } catch (error) {
      console.error("Failed to create pre-approval:", error);
      toast.error("Failed to start pre-approval. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, preApprovals, router, submitPreApproval, user?.id]);

  return { handleGetPreApproved, isCreating };
}

export function useGetPreApprovedPublic() {
  const { user } = useAuthContext();
  const router = useRouter();

  const authenticated = user?.id ? useGetPreApproved() : null;

  const handleGetMortgage = useCallback(async () => {
    if (!user?.id) {
      toast.info("Kindly Register", {
        description: "You need to register to access our properties",
      });
      setTimeout(() => router.push("/signin"), 1000);
      return;
    }

    await authenticated?.handleGetPreApproved();
  }, [user?.id, router, authenticated?.handleGetPreApproved]);

  return {
    handleGetMortgage,
    isCreating: authenticated?.isCreating ?? false,
  };
}

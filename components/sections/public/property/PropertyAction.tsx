import { Button } from '@/components/primitives/Button';
import {  useGetPreApprovedPublic } from '@/hooks/useGetPreApproved';


export function PropertyActions() {
  const { handleGetMortgage, isCreating } = useGetPreApprovedPublic();

  return (
    <div className="space-y-3">
      <Button 
        variant="filled" 
        fullWidth
        onClick={handleGetMortgage}

      >
        Buy Outright
      </Button>

      <Button 
        variant="secondary" 
        fullWidth
        onClick={handleGetMortgage}
        disabled={isCreating}
        loading ={isCreating}
      >
        Get Mortgage
      </Button>
    </div>
  );
}

import { Button } from '@/components/primitives/Button';

export function PropertyActions() {
  return (
    <div className="space-y-3">
      <Button variant="filled" fullWidth>
        Buy Outright
      </Button>

      <Button variant="secondary" fullWidth>
        Get Mortgage
      </Button>
    </div>
  );
}

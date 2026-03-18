import { useState } from 'react';
import { StageType } from './useSpecialized/useApplications';
import { ApplicationBase } from '@/type/pages/dashboard/application';

export interface ConfirmConfig {
  title: string;
  message: string;
  variant: 'warning' | 'danger' | 'default';
}

interface Banner {
  title: string;
  message: string;
  variant: 'warning' | 'danger' | 'default';
  confirm: () => void;
}

export function useConfirmAction<T extends string>(
  config: Record<StageType, ConfirmConfig>,
  handler: (type: StageType) => Promise<ApplicationBase> | void
) {
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);

  const openConfirm = (type: StageType) => {
    setBanner({
      ...config[type],
      confirm: async () => {
        await handler(type);
        setOpen(false);
      },
    });

    setOpen(true);
  };

  const closeConfirm = () => setOpen(false);

  return {
    open,
    banner,
    openConfirm,
    closeConfirm,
  };
}

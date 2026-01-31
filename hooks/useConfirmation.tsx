import { useState } from 'react';

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
  config: Record<T, ConfirmConfig>,
  handler: (type: T) => Promise<void> | void
) {
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);

  const openConfirm = (type: T) => {
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

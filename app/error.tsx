'use client'

import GlobalError from "@/components/feedbacks/GlobalError";

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {

  return (
    <GlobalError 
      error={error} 
      reset={reset}
    />
  );
}
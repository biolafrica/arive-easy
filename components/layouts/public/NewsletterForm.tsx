import { Button } from "@/components/primitives/Button";
import { useSubscriber } from "@/hooks/useSpecialized/useUser";
import { NewsletterValues } from "@/type/newsletter";
import Link from "next/link";
import { useState } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { create, isCreating } = useSubscriber();
 
  const handleSubmit = async () => {
    if (!email) return;
    await create({ email } as NewsletterValues);
    setSubmitted(true);
    setEmail('');
  };
 
  if (submitted) {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 ring-1 ring-emerald-400/40">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-white/80">
          You're in! We'll keep you posted on the best listings and mortgage options.
        </p>
      </div>
    );
  }
 
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter Email"
            required
            className="
              w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5
              text-sm text-white placeholder:text-white/30
              outline-none ring-0
              transition-all duration-200
              focus:border-white/25 focus:bg-white/8
              hover:border-white/15
            "
          />
        </div>
 
        <Button
          onClick={handleSubmit}
          loading={isCreating}
          disabled={isCreating || !email}
          variant="filled"
          className="shrink-0"
        >
          Subscribe
        </Button>
      </div>
 
      <p className="text-xs text-white/40">
        No spam, ever. Read our{' '}
        <Link href="/privacy" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
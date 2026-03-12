import { useEffect, useCallback } from "react";
import { ArrowPathIcon, HomeIcon } from "@heroicons/react/24/outline";
import { ErrorProps } from "@/app/error";
import { Button } from "../primitives/Button";
import { useRouter } from "next/navigation";


export default function GlobalError({ error, reset }: ErrorProps) {
  const router = useRouter();

  // Log to Sentry after setup
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <main
      className="relative grid min-h-screen place-items-center bg-background overflow-hidden px-6 lg:px-8"
      role="alert"
      aria-live="assertive"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-border, #e5e7eb) 0px, var(--color-border, #e5e7eb) 1px, transparent 1px, transparent 40px)",
          opacity: 0.25,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, color-mix(in srgb, var(--color-accent, #f97316) 10%, transparent) 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-8 left-1/2"
          style={{
            transform: "translateX(-50%)",
            fontSize: "clamp(110px, 20vw, 260px)",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1.5px var(--color-border, #d1d5db)",
            whiteSpace: "nowrap",
            zIndex: -1,
            opacity: 0.55,
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          ERR
        </div>

        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-secondary shadow-sm"
          style={{ animation: "fadeUp 0.5s 0.05s ease both", opacity: 0 }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-accent, #f97316)",
              animation: "blink 1.2s step-end infinite",
            }}
          />
          Unexpected error
        </div>

        <h1
          className="text-balance text-5xl sm:text-6xl font-bold tracking-tight text-heading"
          style={{
            animation: "fadeUp 0.5s 0.12s ease both",
            opacity: 0,
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          Something went wrong
        </h1>

        <div
          className="mt-6 mb-6 flex items-center gap-3"
          aria-hidden="true"
          style={{ animation: "fadeUp 0.5s 0.2s ease both", opacity: 0 }}
        >
          <div className="h-px w-16 bg-border" />
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-accent, #f97316)" }}
          />
          <div className="h-px w-16 bg-border" />
        </div>

        <p
          className="text-base sm:text-lg font-medium text-secondary leading-relaxed"
          style={{ animation: "fadeUp 0.5s 0.28s ease both", opacity: 0 }}
        >
          An unexpected error occurred. You can try again — if the problem
          persists, our team has been notified.
        </p>

        {error?.message && (
          <div
            className="mt-6 w-full rounded-lg border border-border bg-card overflow-hidden text-left"
            style={{ animation: "fadeUp 0.5s 0.34s ease both", opacity: 0 }}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-hover">
              <span className="w-2 h-2 rounded-full bg-red-400" aria-hidden="true" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" aria-hidden="true" />
              <span className="w-2 h-2 rounded-full bg-green-400" aria-hidden="true" />
              <span className="ml-2 text-xs text-muted-foreground font-mono tracking-wide">
                error.log
              </span>
            </div>
            <div className="px-4 py-3">
              <p
                className="text-xs text-secondary font-mono leading-relaxed break-all"
                aria-label={`Error details: ${error.message}`}
              >
                <span className="text-red-400 select-none">✕ </span>
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-1.5 text-xs text-muted-foreground font-mono">
                  <span className="select-none text-muted-foreground/50">digest: </span>
                  {error.digest}
                </p>
              )}
            </div>
          </div>
        )}

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          style={{ animation: "fadeUp 0.5s 0.42s ease both", opacity: 0 }}
        >
          <Button 
            onClick={handleReset} 
            leftIcon ={<ArrowPathIcon 
              className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
            />}
          >
            Try again
          </Button>

          <Button 
            variant='secondary' 
            onClick={()=>router.push('/')}
            leftIcon={<HomeIcon 
              className="w-4 h-4 text-secondary transition-colors duration-200 group-hover:text-accent"
            />}
          >
            Back to home
          </Button>

        </div>

        <p
          className="mt-8 text-xs text-muted-foreground tracking-wide"
          style={{ animation: "fadeUp 0.5s 0.5s ease both", opacity: 0 }}
        >
          Still having trouble?{" "}
          <Button onClick={()=>router.push('/support')} variant="text" size='xs'>
            Contact support
          </Button>
          .
        </p>
      </div>

    </main>
  );
}
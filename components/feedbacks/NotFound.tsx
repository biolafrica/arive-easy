'use client'

import { Button } from "../primitives/Button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  
  return (
    <main className="relative grid min-h-screen place-items-center bg-background overflow-hidden px-6 lg:px-8">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border, #e5e7eb) 1px, transparent 1px), linear-gradient(90deg, var(--color-border, #e5e7eb) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.35,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-accent, #6366f1)18, transparent 80%)",
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{ animation: "fadeUp 0.6s ease both" }}
      >

        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-10 left-1/2"
          style={{
            transform: "translateX(-50%)",
            fontSize: "clamp(120px, 22vw, 280px)",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1.5px var(--color-border, #d1d5db)",
            whiteSpace: "nowrap",
            zIndex: -1,
            opacity: 0.6,
          }}
        >
          404
        </div>

        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-secondary shadow-sm"
          style={{ animation: "fadeUp 0.55s 0.05s ease both", opacity: 0 }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
            style={{ animation: "pulse 2s infinite" }}
          />
          Error 404
        </div>

        <h1
          className="text-balance text-5xl sm:text-6xl font-bold tracking-tight text-heading"
          style={{
            animation: "fadeUp 0.55s 0.12s ease both",
            opacity: 0,
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          Page not found
        </h1>

        <div
          className="mt-6 mb-6 flex items-center gap-3"
          style={{ animation: "fadeUp 0.55s 0.2s ease both", opacity: 0 }}
          aria-hidden="true"
        >
          <div className="h-px w-16 bg-border" />
          <div className="w-1 h-1 rounded-full bg-accent" />
          <div className="h-px w-16 bg-border" />
        </div>

        <p
          className="max-w-md text-pretty text-base sm:text-lg font-medium text-secondary leading-relaxed"
          style={{ animation: "fadeUp 0.55s 0.28s ease both", opacity: 0 }}
        >
          The page you're looking for may have been moved, renamed, or removed.
          Let's get you back on track.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ animation: "fadeUp 0.55s 0.38s ease both", opacity: 0 }}
        >
          <Button onClick={()=>router.push("/")} >
            Back to home
          </Button>

          <Button variant='secondary' onClick={()=>router.push('/support')}>
            Contact Support
          </Button>

        </div>

        <p
          className="mt-10 text-xs text-muted-foreground tracking-wide"
          style={{ animation: "fadeUp 0.55s 0.48s ease both", opacity: 0 }}
        >
          If you believe this is a mistake,{" "}
          <Button onClick={()=>router.push('/support')} variant="text" size='xs'>
            let us know
          </Button>
          .
        </p>
      </div>

    </main>
  );
}
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "var(--color-background, #fff)" }}>
         <main
          style={{
            display: "grid",
            placeItems: "center",
            minHeight: "100vh",
            padding: "24px",
            textAlign: "center",
            fontFamily: "Georgia, serif",
          }}
        >
          <div>
            <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5, marginBottom: 16 }}>
              Critical Error
            </p>
            <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 700, margin: "0 0 16px" }}>
              Something went seriously wrong
            </h1>
            <p style={{ fontSize: 16, opacity: 0.6, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.6 }}>
              The application encountered a critical error. Our team has been notified.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 14, textDecoration: "none" }}
              >
                Back to home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

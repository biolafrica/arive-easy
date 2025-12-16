interface LegalPageLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export function LegalPageLayout({
  header,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="py-20 px-4 sm:px-6">
      {header}

      <div className="mt-16 flex justify-center">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </div>
    </main>
  );
}

interface HeroSectionProps {
  backgroundImage: string;
  children: React.ReactNode;
}

export default function HeroSection({
  backgroundImage,
  children,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center pt-24">
        
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-5xl space-y-6 text-white  ">

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-center">
              Your Gateway to International Property Ownership
            </h1>

            <p className="text-base text-white/90 sm:text-lg lg:text-xl text-center">
              Making international property ownership accessible for diasporans worldwide
            </p>

            {/* Search Wrapper */}
            <div className="pt-5">
              {children}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

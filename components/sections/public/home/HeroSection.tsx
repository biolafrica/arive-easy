import { HeroRotatingHeadline } from "./HeroRotatingHeadline";

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

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <div className="relative z-10 flex min-h-[85vh] items-center pt-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto flex max-w-5xl flex-col items-center space-y-6 text-center text-white">

            <HeroRotatingHeadline />

            <p className="text-base text-white/90 sm:text-lg lg:text-xl">
              Making international property ownership accessible for diasporans worldwide
            </p>

            <div className="w-full pt-6">
              {children}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

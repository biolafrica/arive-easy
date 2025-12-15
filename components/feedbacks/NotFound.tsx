import Link from "next/link";
import { HomeIcon, EnvelopeIcon,} from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="grid place-items-center bg-background px-6 lg:px-8">
      <div className="text-center max-w-2xl">

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-8 animate-pulse">
          <p className="text-3xl font-bold text-accent">404</p>
        </div>
        
        <h1 className="text-balance text-5xl font-semibold tracking-tight text-heading sm:text-7xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-pretty text-lg font-medium text-secondary sm:text-xl leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-all hover:scale-105"
          >
            <HomeIcon className="w-5 h-5" />
            Go back home
          </Link>
          
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text hover:bg-hover transition-colors"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Contact support
          </Link>
        </div>
        
      </div>
    </main>
  );
}
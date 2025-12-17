import Link from 'next/link';

interface AuthTabsProps {
  active: 'signup' | 'signin';
}

export function AuthTabs({ active }: AuthTabsProps) {
  return (
    <div className="mb-6 grid grid-cols-2 border-b">
      <Link
        href="/signup"
        className={`pb-3 text-center font-medium ${
          active === 'signup'
            ? 'border-b-2 border-accent text-heading'
            : 'text-secondary'
        }`}
      >
        Sign Up
      </Link>

      <Link
        href="/signin"
        className={`pb-3 text-center font-medium ${
          active === 'signin'
            ? 'border-b-2 border-accent text-heading'
            : 'text-secondary'
        }`}
      >
        Signin
      </Link>
    </div>
  );
}

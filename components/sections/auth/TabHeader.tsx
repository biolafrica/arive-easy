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

export function Divider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>
  );
}

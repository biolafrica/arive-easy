import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type Role =  "seller" | "user" | "admin";

const PROTECTED: Record<string, Role[]> = {
  "/seller-dashboard": ["seller", "admin"],
  "/user-dashboard": ["user", "admin"],
  "/admin": ["admin"],
};

function findProtectedMatch(pathname: string) {
  return Object.entries(PROTECTED).find(([prefix]) => pathname.startsWith(prefix));
}

function dashboardForRole(role?: string | null) {
  switch ((role || "").toLowerCase()) {
    case "seller":
      return "/seller-dashboard";
    case "user":
      return "/user-dashboard";
    case "admin":
      return "/admin";
    default:
      return null;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value}) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  if (pathname === "/signin" || pathname === "/signup") {
    if (user) {
      const role =
        (user.user_metadata?.role as string | undefined) ??
        (user.app_metadata?.role as string | undefined) ??
        "";
      const dest = dashboardForRole(role) || "/";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return supabaseResponse;
  }

  const match = findProtectedMatch(pathname);
  if (!match) {
    return supabaseResponse;
  }

  if (!user) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirectTo", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  const role =
    (user.user_metadata?.role as string | undefined) ??
    (user.app_metadata?.role as string | undefined) ??
    "";
  const allowedRoles = match[1];

  if (!allowedRoles.map(r => r.toLowerCase()).includes(role.toLowerCase())) {
    const url = new URL("/unauthorized", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse
}


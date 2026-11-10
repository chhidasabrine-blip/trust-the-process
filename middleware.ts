import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items, headers) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value)
        );
      },
    },
  });

  // getClaims validates the JWT signature before using its subject.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  const destination = new URL("/login", request.url);
  if (!userId) {
    destination.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(destination);
  }

  const { data: grant, error } = await supabase
    .from("user_roles")
    .select("roles!inner(code)")
    .eq("user_id", userId)
    .eq("roles.code", "owner")
    .maybeSingle();

  if (error || !grant) {
    destination.searchParams.set("error", "not-authorized");
    return NextResponse.redirect(destination);
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };

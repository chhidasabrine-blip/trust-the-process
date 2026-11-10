import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./sign-out";

export default async function AdminHome() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login?error=not-configured");
  }

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");

  const { data: grant, error } = await supabase
    .from("user_roles")
    .select("roles!inner(code)")
    .eq("user_id", userId)
    .eq("roles.code", "owner")
    .maybeSingle();

  if (error || !grant) redirect("/login?error=not-authorized");

  return (
    <div className="admin-frame">
      <aside className="admin-side">
        <div className="wordmark">TRUST THE PROCESS</div>
        <div className="rule" />
        <div className="eyebrow">Workspace</div>
        <p>Foundation phase</p>
      </aside>
      <main className="admin-main">
        <div className="eyebrow">Private management</div>
        <h1>Welcome back.</h1>
        <p style={{ color: "var(--color-muted)" }}>
          Owner workspace · {String(data.claims.email ?? "Authenticated account")}
        </p>
        <section className="admin-panel">
          <h2>Foundation setup</h2>
          <p>
            Your private area is protected by a verified Supabase session and an
            explicit owner-role grant checked on the server and at the database.
          </p>
          <p>
            <strong>Next setup step:</strong> create your owner login in Supabase
            Auth and assign it the seeded owner role. Then we can activate the
            business modules.
          </p>
          <form action={signOut}>
            <button className="button" type="submit">Sign out</button>
          </form>
        </section>
      </main>
    </div>
  );
}

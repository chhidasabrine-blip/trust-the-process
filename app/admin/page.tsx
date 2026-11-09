import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {signOut} from "./sign-out";
export default async function AdminHome(){
  let supabase;try{supabase=await createClient();}catch{redirect("/login?error=not-configured");}
  const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
  const {data:grant,error}=await supabase.from("user_roles").select("roles!inner(code)").eq("user_id",user.id).eq("roles.code","owner").maybeSingle();
  if(error||!grant)redirect("/login?error=not-authorized");
  return <div className="admin-frame"><aside className="admin-side"><div className="wordmark">TRUST THE PROCESS</div><div className="rule"/><div className="eyebrow">Workspace</div><p>Foundation phase</p></aside><main className="admin-main"><div className="eyebrow">Private management</div><h1>Welcome back.</h1><p style={{color:"var(--color-muted)"}}>Signed in as {user.email}</p><section className="admin-panel"><h2>Foundation setup</h2><p>The private route requires both a valid Supabase session and an explicit owner role grant.</p><p><strong>Current status:</strong> authentication and owner-gate code scaffolded; live connection pending project credentials and owner account setup.</p><form action={signOut}><button className="button" type="submit">Sign out</button></form></section></main></div>;
}

import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {updatePassword} from "./actions";
const messages:Record<string,string>={"too-short":"Use at least 10 characters.","mismatch":"The passwords do not match.","update-failed":"The password could not be updated. Request a new reset link."};
export default async function ResetPasswordPage({searchParams}:{searchParams:Promise<{error?:string}>}){
  let supabase;try{supabase=await createClient();}catch{redirect("/login?error=not-configured");}
  const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login?error=reset-unavailable");
  const params=await searchParams;
  return <main className="auth-wrap"><section className="auth-card"><div className="wordmark">TRUST THE PROCESS</div><div className="rule"/><div className="eyebrow">Account security</div><h1>Set a new password</h1><p>Choose a strong password for your private workspace.</p>{params.error&&<div className="notice" role="alert">{messages[params.error]??"Unable to update password."}</div>}<form action={updatePassword}><div className="field"><label htmlFor="password">New password</label><input id="password" name="password" type="password" minLength={10} autoComplete="new-password" required/></div><div className="field"><label htmlFor="confirmation">Confirm password</label><input id="confirmation" name="confirmation" type="password" minLength={10} autoComplete="new-password" required/></div><button className="button" type="submit">Update password</button></form></section></main>;
}

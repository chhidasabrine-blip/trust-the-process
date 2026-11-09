"use server";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
export async function updatePassword(data:FormData){
  const password=String(data.get("password")??"");
  const confirmation=String(data.get("confirmation")??"");
  if(password.length<10)redirect("/reset-password?error=too-short");
  if(password!==confirmation)redirect("/reset-password?error=mismatch");
  let supabase;try{supabase=await createClient();}catch{redirect("/login?error=not-configured");}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/login?error=reset-unavailable");
  const {error}=await supabase.auth.updateUser({password});
  if(error)redirect("/reset-password?error=update-failed");
  await supabase.auth.signOut();
  redirect("/login?message=password-updated");
}

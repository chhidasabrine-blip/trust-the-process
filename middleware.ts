import {createServerClient} from "@supabase/ssr";
import {NextResponse,type NextRequest} from "next/server";

export async function middleware(request:NextRequest){
  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return response;
  const supabase=createServerClient(url,key,{cookies:{
    getAll:()=>request.cookies.getAll(),
    setAll(items){items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});items.forEach(({name,value,options})=>response.cookies.set(name,value,options));}
  }});
  const {data:{user}}=await supabase.auth.getUser();
  const destination=new URL("/login",request.url);
  if(!user){destination.searchParams.set("next",request.nextUrl.pathname);return NextResponse.redirect(destination);}
  const {data:grant,error}=await supabase.from("user_roles").select("roles!inner(code)").eq("user_id",user.id).eq("roles.code","owner").maybeSingle();
  if(error||!grant){destination.searchParams.set("error","not-authorized");return NextResponse.redirect(destination);}
  return response;
}
export const config={matcher:["/admin/:path*"]};

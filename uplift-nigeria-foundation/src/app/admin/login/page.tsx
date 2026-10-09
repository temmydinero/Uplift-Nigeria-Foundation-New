import { signIn } from "@/lib/auth";import { AuthError } from "next-auth";import { redirect } from "next/navigation";import { limited } from "@/lib/ratelimit";
async function login(fd:FormData){"use server";
 if(await limited("login",8))redirect("/admin/login?error=rate");
 try{await signIn("credentials",{email:String(fd.get("email")),password:String(fd.get("password")),redirectTo:"/admin"})}
 catch(e){if(e instanceof AuthError)redirect("/admin/login?error=1");throw e}}
export const metadata={title:"Admin login",robots:{index:false}};
export default function Login({searchParams}:{searchParams:{error?:string}}){return <main className="grid min-h-screen place-items-center p-5"><form action={login} className="card w-full max-w-sm grid gap-4"><h1 className="!text-2xl">Admin sign in</h1>
 <label className="lbl">Email<input name="email" type="email" required autoComplete="username" className="input"/></label>
 <label className="lbl">Password<input name="password" type="password" required autoComplete="current-password" className="input"/></label>
 {searchParams.error&&<p role="alert" className="rounded-xl bg-red-100 p-3 text-sm text-red-900">{searchParams.error==="rate"?"Too many attempts. Try later.":"Invalid email or password."}</p>}
 <button className="btn">Sign in</button></form></main>}

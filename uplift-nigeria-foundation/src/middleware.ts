import { NextResponse,type NextRequest } from "next/server";
// Edge-safe first gate: only checks that a session cookie exists. Real verification (user active, role)
// happens server-side in the admin layout, every page and every action via src/lib/authz.ts.
export function middleware(req:NextRequest){
  const p=req.nextUrl.pathname;
  if(p==="/admin/login")return NextResponse.next();
  const has=req.cookies.has("authjs.session-token")||req.cookies.has("__Secure-authjs.session-token");
  if(!has)return NextResponse.redirect(new URL("/admin/login",req.url));
  return NextResponse.next();
}
export const config={matcher:["/admin/:path*"]};

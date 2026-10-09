import NextAuth from "next-auth";import Credentials from "next-auth/providers/credentials";import bcrypt from "bcryptjs";import { z } from "zod";import { db } from "./db";
const schema=z.object({email:z.string().email().max(200),password:z.string().min(1).max(200)});
const DUMMY="$2a$12$C6UzMDM.H6dfI/f/IKcEeO5xKqkYVQbVxAhNnuZ5K2w0nQm0w1n4e";
export const{handlers,auth,signIn,signOut}=NextAuth({session:{strategy:"jwt",maxAge:60*60*8},pages:{signIn:"/admin/login"},
 providers:[Credentials({async authorize(raw){const p=schema.safeParse(raw);if(!p.success)return null;
  const u=await db.adminUser.findUnique({where:{email:p.data.email.toLowerCase()}});
  const ok=await bcrypt.compare(p.data.password,u?.passwordHash??DUMMY);
  return u&&u.active&&ok?{id:u.id,email:u.email,name:u.name}:null}})],
 callbacks:{session({session,token}){if(session.user&&token.sub)session.user.id=token.sub;return session}}});

import { PrismaClient } from "@prisma/client";
const g=globalThis as unknown as {db?:PrismaClient};
export const db=g.db??new PrismaClient();
if(process.env.NODE_ENV!=="production")g.db=db;
export async function safe<T>(fn:()=>Promise<T>,fallback:T):Promise<T>{try{return await fn()}catch{return fallback}}

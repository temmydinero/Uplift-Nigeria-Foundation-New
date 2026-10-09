import { redirect } from "next/navigation";import { auth } from "./auth";import { db } from "./db";
export type AdminUser={id:string;email:string;name:string;role:"ADMIN"|"EDITOR"};
// Always re-checks the database so disabled users or role changes apply immediately.
export async function getUser():Promise<AdminUser|null>{const s=await auth();const id=s?.user?.id;if(!id)return null;
 const u=await db.adminUser.findUnique({where:{id},select:{id:true,email:true,name:true,role:true,active:true}});return u&&u.active?{id:u.id,email:u.email,name:u.name,role:u.role}:null}
export async function requireAuth(){const u=await getUser();if(!u)redirect("/admin/login");return u}
export const requireEditor=requireAuth; // ADMIN and EDITOR
export async function requireAdmin(){const u=await requireAuth();if(u.role!=="ADMIN")redirect("/admin?denied=1");return u}

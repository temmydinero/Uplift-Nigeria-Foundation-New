import { PrismaClient } from "@prisma/client";import bcrypt from "bcryptjs";
const db=new PrismaClient();
// Idempotent: never overwrites existing settings, never duplicates stats, only creates the first admin if missing.
async function main(){
 const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(),pw=process.env.ADMIN_PASSWORD;
 if(!email||!pw)throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
 if(!await db.adminUser.findUnique({where:{email}})){
  if(pw.length<12||!/[a-z]/.test(pw)||!/[A-Z]/.test(pw)||!/\d/.test(pw))throw new Error("ADMIN_PASSWORD needs 12+ chars with upper-case, lower-case and a number");
  await db.adminUser.create({data:{email,name:"Administrator",role:"ADMIN",passwordHash:await bcrypt.hash(pw,12)}});console.log("Created first admin:",email)}
 const settings:Record<string,string>={foundation_name:"Uplift Nigeria Foundation",tagline:"Uplifting Lives. Strengthening Communities.",email:"uplift9jafoundation1@gmail.com",phone:"07074032915",address:"09 Folu Adegun, Iyana Ipaja, Lagos",instagram:"https://instagram.com/uplift9ja",tiktok:"https://tiktok.com/@uplift9ja"};
 for(const[key,value]of Object.entries(settings))await db.siteSetting.upsert({where:{key},update:{},create:{key,value}});
 if(await db.impactStat.count()===0)for(const[i,label]of["Lives Reached","Communities Supported","Programs Delivered","Volunteers & Partners"].entries())await db.impactStat.create({data:{label,value:0,verified:false,published:false,sortOrder:i}});
}
main().catch(e=>{console.error(e.message);process.exit(1)}).finally(()=>db.$disconnect());

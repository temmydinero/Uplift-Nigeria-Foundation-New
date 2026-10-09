import { meta } from "@/lib/meta";import Form from "@/components/Form";import { submitContact } from "@/lib/actions";import { getSettings } from "@/lib/settings";
export const metadata=meta("Contact","Contact Uplift Nigeria Foundation.","/contact");
export default async function Contact(){const s=await getSettings();return <section className="sec"><div className="wrap"><p className="tag">Contact</p><h1 className="mb-8 mt-2">Get in Touch</h1><div className="grid items-start gap-8 md:grid-cols-2">
<div><p><b>{s.foundation_name}</b><br/>{s.address}<br/>{s.phone}<br/>{s.email}</p>
{s.map_embed_url?<iframe title="Foundation location" src={s.map_embed_url} loading="lazy" className="mt-6 aspect-[4/3] w-full rounded-3xl border-0"/>:null}</div>
<div className="card"><Form action={submitContact} submit="Send message" success="Thank you! Your message has been sent." fields={[{name:"name",label:"Name",required:true},{name:"email",label:"Email",type:"email",required:true},{name:"phone",label:"Phone",type:"tel"},{name:"subject",label:"Subject",required:true},{name:"message",label:"Message",area:true,required:true}]}/></div></div></div></section>}

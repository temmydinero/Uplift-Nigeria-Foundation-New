import { meta } from "@/lib/meta";import { getSettings } from "@/lib/settings";export const metadata=meta("Privacy Policy","How Uplift Nigeria Foundation collects, uses and protects personal information.","/privacy");
export default async function P(){const s=await getSettings();const H=({t}:{t:string})=><h2 className="mb-2 mt-8 !text-2xl">{t}</h2>;
 return <section className="sec"><div className="wrap max-w-3xl leading-8"><h1>Privacy Policy</h1>
 <H t="Information we collect"/><p>When you use our contact, volunteer or partnership forms we collect the details you enter: name, email, phone number, location, organization, area of interest, availability and your message. We do not collect payment information on this website.</p>
 <H t="Why we collect it"/><p>We use this information only to respond to enquiries, assess volunteer and partnership interest, and run the foundation's programs. We do not sell your information or use it for advertising.</p>
 <H t="Retention and security"/><p>Submissions are stored in a protected database accessible only to authorized foundation administrators. We keep them for as long as needed to handle your enquiry and may delete them afterwards. We use access controls, encrypted connections and other reasonable safeguards, but no system is completely secure.</p>
 <H t="Your rights"/><p>You may ask to see, correct or delete the information you submitted by contacting us below.</p>
 <H t="Contact"/><p>{s.foundation_name}<br/>{s.email}<br/>{s.phone}<br/>{s.address}</p>
 <p className="mt-8 text-sm muted">Last updated: October 2026.</p></div></section>}

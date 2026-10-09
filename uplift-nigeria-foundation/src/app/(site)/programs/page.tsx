import { meta } from "@/lib/meta";import Programs from "@/components/Programs";
export const metadata=meta("Our Programs","Education, healthcare, youth empowerment, women and children, community development and family support programs in Nigeria.","/programs");
export const revalidate=60;
export default function P(){return <section className="sec"><div className="wrap"><p className="tag">Our programs</p><h1 className="mb-8 mt-2">What We Do</h1><Programs/></div></section>}

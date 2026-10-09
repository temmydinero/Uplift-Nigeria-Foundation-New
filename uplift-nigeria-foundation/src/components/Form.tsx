"use client";
import { useFormState, useFormStatus } from "react-dom";
export type Field={name:string;label:string;type?:string;required?:boolean;options?:string[];area?:boolean};
function Btn({label}:{label:string}){const{pending}=useFormStatus();return <button className="btn" disabled={pending}>{pending?"Sending…":label}</button>}
export default function Form({action,fields,submit,success}:{action:(s:any,f:FormData)=>Promise<{ok?:boolean;error?:string}>;fields:Field[];submit:string;success:string}){
  const [st,fa]=useFormState(action,{} as {ok?:boolean;error?:string});
  if(st.ok)return <p role="status" className="rounded-xl bg-brand/10 p-4">{success}</p>;
  return <form action={fa} className="grid gap-4">
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    {fields.map(f=><label key={f.name} className="lbl">{f.label}{f.required&&<span className="sr-only"> (required)</span>}
      {f.options?<select name={f.name} required={f.required} className="input">{f.options.map(o=><option key={o}>{o}</option>)}</select>
      :f.area?<textarea name={f.name} rows={4} required={f.required} maxLength={3000} className="input"/>
      :<input name={f.name} type={f.type||"text"} required={f.required} className="input" autoComplete={f.type==="email"?"email":f.type==="tel"?"tel":"off"}/>}</label>)}
    {st.error&&<p role="alert" className="rounded-xl bg-red-100 p-3 text-sm text-red-900">{st.error}</p>}
    <Btn label={submit}/></form>;
}

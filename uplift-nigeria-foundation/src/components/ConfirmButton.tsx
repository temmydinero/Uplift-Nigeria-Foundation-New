"use client";
export default function ConfirmButton({label,message}:{label:string;message:string}){return <button className="text-red-700 underline" onClick={e=>{if(!confirm(message))e.preventDefault()}}>{label}</button>}

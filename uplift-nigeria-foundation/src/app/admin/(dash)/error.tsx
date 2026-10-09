"use client";
export default function AdminError({reset}:{error:Error;reset:()=>void}){return <div role="alert" className="card max-w-lg"><h1 className="!text-2xl">Something went wrong</h1><p className="muted my-3">The action could not be completed. Please try again.</p><button onClick={reset} className="btn">Try again</button></div>}

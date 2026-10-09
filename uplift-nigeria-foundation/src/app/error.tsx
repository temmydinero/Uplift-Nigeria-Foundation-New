"use client";
export default function Err({reset}:{error:Error;reset:()=>void}){return <main className="grid min-h-screen place-items-center p-6 text-center"><div role="alert"><h1 className="mb-3">Something went wrong</h1><p className="muted mb-6">Please try again. If the problem continues, contact the foundation.</p><button onClick={reset} className="btn">Try again</button></div></main>}

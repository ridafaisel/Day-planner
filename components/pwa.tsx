'use client';
import {useEffect,useState} from 'react';
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
export default function Pwa(){
 const [prompt,setPrompt]=useState<InstallEvent|null>(null);const [help,setHelp]=useState(false);const [installed,setInstalled]=useState(false);
 useEffect(()=>{
  setInstalled(window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator&{standalone?:boolean}).standalone));
  if(import.meta.env.PROD && 'serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).catch(()=>{});
  const before=(e:Event)=>{e.preventDefault();setPrompt(e as InstallEvent)};const done=()=>{setInstalled(true);setPrompt(null)};
  window.addEventListener('beforeinstallprompt',before);window.addEventListener('appinstalled',done);
  return()=>{window.removeEventListener('beforeinstallprompt',before);window.removeEventListener('appinstalled',done)};
 },[]);
 if(installed)return null;
 return <div className="mb-6 text-center"><button className="rounded-lg border border-neutral-300 bg-white/70 px-4 py-2 text-sm font-medium" onClick={async()=>{if(prompt){await prompt.prompt();await prompt.userChoice;setPrompt(null)}else setHelp(!help)}}>Install day planner</button>{help&&<p className="mt-3 text-sm leading-6 text-neutral-600">On iPhone, open in Safari and choose Share → Add to Home Screen. On Android or desktop, look for “Install app” or “Add to Home Screen” in your browser menu.</p>}</div>
}

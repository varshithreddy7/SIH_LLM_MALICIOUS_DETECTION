// Use plain anchors to avoid router context errors at runtime
import { motion } from 'framer-motion';
import React, { Suspense, useEffect, useState } from 'react';
const Globe = React.lazy(() => import('@/components/effects/Globe').then(m => ({ default: m.Globe })));
import { Shield, ScanEye, Network, ArrowRight } from 'lucide-react';

export default function Index(){
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => { if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; setDeferredPrompt(null);} };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,255,255,0.12),transparent_60%)]" />
      <div className="grid-noise" />
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
      <section className="container relative flex min-h-[80vh] items-center">
        <div className="max-w-3xl space-y-6">
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:.6}}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-300">
              <Shield className="size-3"/> Cyber AI Defense
            </div>
          </motion.div>
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:.05,duration:.7}} className="font-heading neon-text text-4xl md:text-6xl leading-tight text-white">
            Safeguarding Truth in the Age of AI-Driven Misinformation.
          </motion.h1>
          <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:.1,duration:.7}} className="text-lg text-foreground/75 max-w-2xl">
            Detect fake or AI-generated news with Hugging Face models. Visualize threats, trace provenance, and preserve integrity with blockchain-style audit trails.
          </motion.p>
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:.15,duration:.7}} className="flex flex-wrap gap-3">
            <Link to="/verify" className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-colors">
              <ScanEye className="size-4"/> Verify Content <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5"/>
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border border-white/10 bg-white/5 text-cyan-300 hover:bg-white/10 transition-colors">
              <Network className="size-4"/> Explore Dashboard
            </Link>
            <button onClick={install} disabled={!deferredPrompt} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border border-white/10 bg-white/5 text-purple-300 hover:bg-white/10 transition-colors disabled:opacity-50">Install App</button>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="container grid gap-6 md:grid-cols-3">
          {[{label:'Articles Scanned',value:'20K+'},{label:'Detection Accuracy',value:'92%'},{label:'Real-time Models',value:'2+'}].map((m,i)=> (
            <motion.div key={m.label} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="glass neon-border rounded-2xl p-6">
              <div className="text-3xl font-heading text-cyan-300">{m.value}</div>
              <div className="text-foreground/70">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

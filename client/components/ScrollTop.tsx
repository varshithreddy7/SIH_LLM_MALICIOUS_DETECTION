import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollTop(){
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if(!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-40 rounded-full p-3 border border-white/10 bg-white/5 hover:bg-white/10 text-cyan-200 transition-colors"
      aria-label="Scroll to top"
    >
      <ArrowUp/>
    </button>
  );
}

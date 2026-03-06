import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(100);

  useEffect(() => {
    // Initial snap to right edge on mount
    if (typeof window !== 'undefined') {
      x.set(window.innerWidth - 80); // 80 is button width (64) + margin (16)
    }
  }, [x]);

  const handleToggle = () => {
    setIsMuted(!isMuted);
    // Haptic feedback (works on supported mobile devices)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragEnd = () => {
    // Snap to closest edge
    const screenWidth = window.innerWidth;
    const buttonWidth = 64; // w-16 = 64px
    const margin = 16; // 16px from edge
    
    const currentX = x.get();
    const centerPoint = currentX + buttonWidth / 2;
    
    const targetX = centerPoint < screenWidth / 2 ? margin : screenWidth - buttonWidth - margin;
    
    animate(x, targetX, {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950 overflow-hidden flex items-center justify-center font-sans selection:bg-emerald-500/30"
      ref={constraintsRef}
    >
      {/* Background Content to show the overlay effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="text-center text-zinc-400 max-w-md p-6 relative z-10">
        <h1 className="text-3xl font-light text-white mb-4 tracking-tight">microkzi</h1>
        <p className="mb-6 leading-relaxed">
          Un botón flotante premium con diseño glassmorfismo y físicas de resorte.
        </p>
        <ul className="text-sm space-y-3 text-left bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Arrastra para moverlo por la pantalla
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Se ajusta al borde más cercano al soltarlo
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Baja al 50% de opacidad cuando está inactivo
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Toca para activar/desactivar (con vibración)
          </li>
        </ul>
      </div>

      <motion.div
        style={{ x, y }}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onTap={handleToggle}
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: 0.5, scale: 1 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileDrag={{ opacity: 1, scale: 1.05 }}
        className={`
          absolute top-0 left-0
          w-16 h-16 rounded-full 
          flex items-center justify-center
          cursor-grab active:cursor-grabbing
          transition-colors duration-300 ease-out
          ${isMuted 
            ? 'bg-red-500/20 border-red-500/30 shadow-[0_8px_32px_rgba(239,68,68,0.25)]' 
            : 'bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)]'
          }
          backdrop-blur-xl border
          z-50
        `}
      >
        {isMuted ? (
          <MicOff className="w-6 h-6 text-red-400" strokeWidth={1.5} />
        ) : (
          <Mic className="w-6 h-6 text-white" strokeWidth={1.5} />
        )}
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Building {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
}

const buildings: Building[] = [
  { id: 'A', name: 'Edificio administrativo', x: 20, y: 30, type: 'Admin' },
  { id: 'B', name: 'Laboratorios de Ingeniería', x: 60, y: 20, type: 'Lab' },
  { id: 'C', name: 'Comedor UNET', x: 80, y: 60, type: 'Service' },
  { id: 'D', name: 'Biblioteca Central', x: 30, y: 70, type: 'Study' },
  { id: 'E', name: 'Canchas Deportivas', x: 70, y: 85, type: 'Sport' },
];

export const CampusSimulator = () => {
  const [selected, setSelected] = useState<Building | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'REQUESTING' | 'PROCESSING' | 'DB_QUERY' | 'RESULT'>('IDLE');
  const [dataFlow, setDataFlow] = useState<string[]>([]);

  const handleSimulate = (b: Building) => {
    setSelected(b);
    setStatus('REQUESTING');
    setDataFlow(['Enviando coordenadas GPS...']);
    
    setTimeout(() => {
      setStatus('PROCESSING');
      setDataFlow(prev => [...prev, 'Validando ruta en Servidor Node.js...']);
      
      setTimeout(() => {
        setStatus('DB_QUERY');
        setDataFlow(prev => [...prev, `Consultando PostGIS para Edificio ${b.id}...`]);
        
        setTimeout(() => {
          setStatus('RESULT');
          setDataFlow(prev => [...prev, '¡Ruta generada con éxito!']);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#dadce0] overflow-hidden shadow-2xl">
      <div className="grid lg:grid-cols-2">
        
        {/* Visual Map Area */}
        <div className="p-8 md:p-12 bg-[#f8f9fa] border-r border-[#dadce0] relative min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4285f4 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative w-full aspect-square max-w-[300px] border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border border-blue-100 animate-ping opacity-20"></div>
             
             {buildings.map((b) => (
               <motion.button
                 key={b.id}
                 whileHover={{ scale: 1.2 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => handleSimulate(b)}
                 className={`absolute w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-lg transition-colors z-10 ${
                   selected?.id === b.id ? 'bg-[#1a73e8] text-white' : 'bg-white text-[#5f6368] border border-[#dadce0]'
                 }`}
                 style={{ left: `${b.x}%`, top: `${b.y}%` }}
               >
                 {b.id}
               </motion.button>
             ))}

             {/* Connecting Lines (Simplified) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
               {selected && (
                 <motion.circle
                   initial={{ r: 0, opacity: 0 }}
                   animate={{ r: 100, opacity: 0.1 }}
                   transition={{ duration: 1, repeat: Infinity }}
                   cx={`${selected.x}%`}
                   cy={`${selected.y}%`}
                   fill="#1a73e8"
                 />
               )}
             </svg>
             
             <div className="text-[10px] font-black uppercase tracking-widest text-[#dadce0] absolute bottom-0 left-1/2 -translate-x-1/2 -mb-8">
               Simulador de Campus UNET
             </div>
          </div>
        </div>

        {/* Data & Logic Area */}
        <div className="p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className={`w-2 h-2 rounded-full ${status === 'IDLE' ? 'bg-slate-300' : 'bg-green-500 animate-pulse'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5f6368]">Motor U-Locate en ejecución</span>
            </div>

            <h3 className="text-2xl font-black text-[#202124] mb-6">¿Como funciona por dentro?</h3>
            <p className="text-[#5f6368] text-sm leading-relaxed mb-8">
              Selecciona un edificio en el mapa para ver el flujo de datos en tiempo real entre las capas de nuestro sistema.
            </p>

            <div className="space-y-4">
              <AnimatePresence>
                {dataFlow.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-[#1a73e8] font-mono text-xs">{(i+1).toString().padStart(2, '0')}</span>
                    <p className={`text-xs font-medium ${i === dataFlow.length - 1 ? 'text-[#202124]' : 'text-[#9aa0a6]'}`}>
                      {log}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#dadce0]">
            {selected ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e8f0fe] rounded-2xl flex items-center justify-center text-xl">
                  {selected.id === 'A' ? '🏛️' : selected.id === 'B' ? '🧪' : selected.id === 'C' ? '🍽️' : selected.id === 'D' ? '📚' : '⚽'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#202124]">{selected.name}</h4>
                  <p className="text-[10px] text-[#5f6368] uppercase font-black tracking-widest">{selected.type}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-[#9aa0a6]">Haz clic en un edificio del mapa...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

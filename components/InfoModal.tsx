import React from 'react';
import { Territory } from '../types';
import { X, Map, DollarSign, Calendar, Globe } from 'lucide-react';

interface InfoModalProps {
  territory: Territory;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ territory, onClose }) => {
  return (
    // Wrapper: Fixed position on the right, no backdrop, allows click-through to map (pointer-events-none)
    <div className="fixed top-24 bottom-32 right-6 z-40 w-[420px] pointer-events-none flex flex-col justify-end md:justify-start perspective-1000">
      
      {/* Card Content: Enable pointer events for interaction */}
      <div 
        className="pointer-events-auto w-full bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden ring-1 ring-white/5 animate-slide-in-right transform transition-all duration-500 ease-out"
      >
        {/* Header - Glassy Gradient Overlay */}
        <div className="relative p-6 overflow-hidden">
            <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay" 
                style={{ backgroundColor: territory.color }}
            />
            {/* Dark gradient fade for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/95"></div>
            
             {/* Noise texture for premium feel */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            <div className="relative z-10 text-white">
                <div className="flex justify-between items-start mb-4">
                     <div className="inline-block px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm text-white/90 tracking-widest uppercase">
                        {territory.method}
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-md text-white/60 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <h2 className="text-3xl font-black tracking-tight drop-shadow-lg shadow-black leading-tight mb-2">{territory.name}</h2>
                
                <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest shadow-black/50 drop-shadow-md">
                    <Calendar size={12} className="text-blue-400" />
                    <span>Acquired {territory.year}</span>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          <div className="text-sm leading-relaxed text-slate-300 font-medium border-l-2 border-slate-700 pl-4">
            {territory.description}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Dark Neumorphic Cards */}
            <div className="bg-slate-800/40 p-3 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                <Map size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Size</span>
              </div>
              <div className="font-bold text-slate-100 text-lg">
                {(territory.areaSqMiles / 1000).toFixed(0)}k <span className="text-xs text-slate-500 font-normal">sq mi</span>
              </div>
              <div className="text-[10px] text-blue-400 mt-1 font-semibold leading-tight">{territory.comparison}</div>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                <Globe size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">From</span>
              </div>
              <div className="font-bold text-slate-100 text-lg">
                {territory.fromEntity}
              </div>
            </div>
            
            {territory.cost && (
              <div className="bg-slate-800/40 p-3 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5 col-span-2 hover:bg-slate-800/60 transition-colors">
                 <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                    <DollarSign size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cost Analysis</span>
                 </div>
                 <div className="flex justify-between items-end">
                     <div>
                        <div className="font-bold text-slate-100 text-lg">
                            ${(territory.cost / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">In {territory.year}</div>
                     </div>
                     <div className="text-right">
                        <div className="font-bold text-emerald-400 text-lg">
                            ${(territory.costInflationAdjusted! / 1000000000).toFixed(1)}B
                        </div>
                        <div className="text-[10px] text-emerald-500/60 uppercase font-bold">2024 Value</div>
                     </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoModal;
import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineControlsProps {
  currentYear: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onYearChange: (year: number) => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentYear,
  minYear,
  maxYear,
  isPlaying,
  speed,
  onPlayPause,
  onReset,
  onSpeedChange,
  onYearChange,
}) => {
  return (
    <div className="mx-6 mb-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl p-6 flex flex-col gap-4 transition-all hover:bg-slate-900/70">
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Playback Controls - Dark Neumorphic Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 bg-slate-800 shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.05)] hover:text-white transition-all active:scale-95 active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-4px_-4px_10px_rgba(255,255,255,0.05)]"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
          
          <button
            onClick={onPlayPause}
            className={`w-14 h-14 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-[5px_5px_15px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(255,255,255,0.05)] ${
              isPlaying 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                : 'bg-slate-800 text-blue-500 hover:text-blue-400'
            }`}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

           <div className="flex p-1 rounded-xl bg-slate-950 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.1)] border border-white/5">
            {[0.5, 1, 2].map((s) => (
                <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    speed === s
                    ? 'bg-slate-800 text-blue-400 shadow-[2px_2px_5px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.1)]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                >
                {s}x
                </button>
            ))}
            </div>
        </div>

        {/* Timeline Slider - Dark Track */}
        <div className="flex-1 w-full flex items-center gap-6">
          <span className="text-slate-500 font-bold text-sm font-mono">{minYear}</span>
          
          <div className="relative flex-1 h-3 rounded-full bg-slate-950 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(255,255,255,0.1)] flex items-center border border-white/5">
            <div 
                className="absolute left-0 h-full rounded-full bg-blue-600/50 pointer-events-none shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%` }}
            />
             <input
              type="range"
              min={minYear}
              max={maxYear}
              value={currentYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Custom Thumb Element */}
            <div 
                className="absolute w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] border-2 border-white pointer-events-none transition-all"
                style={{ left: `calc(${((currentYear - minYear) / (maxYear - minYear)) * 100}% - 12px)` }}
            />
          </div>

          <span className="text-slate-500 font-bold text-sm font-mono">{maxYear}</span>
        </div>

        {/* Year Display - Glowing Text */}
        <div className="hidden md:block">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tabular-nums">
                {currentYear}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;
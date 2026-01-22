import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TERRITORIES, MIN_YEAR, MAX_YEAR } from './constants';
import { Territory } from './types';
import MapVisualization from './components/MapVisualization';
import TimelineControls from './components/TimelineControls';
import StatsPanel from './components/StatsPanel';
import InfoModal from './components/InfoModal';

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [autoPause, setAutoPause] = useState<boolean>(true);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const handleSelectTerritory = (t: Territory) => {
    setSelectedTerritory(t);
    setIsPlaying(false);
  };

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Spacebar listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay]);

  const checkAutoPause = useCallback((newYear: number) => {
    if (!autoPause) return false;
    const event = TERRITORIES.find(t => t.year === newYear);
    if (event) {
      setCurrentYear(event.year);
      setIsPlaying(false);
      setSelectedTerritory(event);
      return true;
    }
    return false;
  }, [autoPause]);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      if (deltaTime >= (500 / speed)) {
        setCurrentYear(prev => {
          if (prev >= MAX_YEAR) {
            setIsPlaying(false);
            return MAX_YEAR;
          }
          const nextYear = prev + 1;
          const event = TERRITORIES.find(t => t.year === nextYear);
          if (event && autoPause) {
             setIsPlaying(false);
             setSelectedTerritory(event);
             return nextYear;
          }
          return nextYear;
        });
        lastTimeRef.current = time;
      }
    } else {
      lastTimeRef.current = time;
    }
    if (isPlaying) requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed, autoPause]);

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(animate);
    else {
      lastTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, animate]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* Glass Header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/40 backdrop-blur-md p-2 pr-6 rounded-full border border-white/10 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                US
            </div>
            <div>
                <h1 className="text-lg font-bold text-slate-100 leading-none tracking-tight">Territorial Expansion</h1>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">1776 - Present</p>
            </div>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-4 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none hover:text-white transition-colors">
                <input 
                    type="checkbox" 
                    checked={autoPause} 
                    onChange={e => setAutoPause(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-600 bg-slate-800"
                />
                AUTO-PAUSE
            </label>
        </div>
      </header>

      {/* Main Map Area - Full Screen */}
      <main className="flex-1 relative w-full h-full p-4 pt-20 pb-0 flex flex-col">
        
        <div className="flex-1 relative w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
             <MapVisualization 
                territories={TERRITORIES} 
                currentYear={currentYear}
                onSelectTerritory={handleSelectTerritory}
                selectedId={selectedTerritory?.id}
            />

            {/* Floating Stats Panel - Moved to Left to avoid conflict with Info Panel */}
            <div className="absolute top-6 left-6 z-20">
                <StatsPanel territories={TERRITORIES} currentYear={currentYear} />
            </div>
        </div>

        {/* Timeline Overlay at Bottom */}
        <div className="mt-4 z-30">
             <TimelineControls 
                currentYear={currentYear}
                minYear={MIN_YEAR}
                maxYear={MAX_YEAR}
                isPlaying={isPlaying}
                speed={speed}
                onPlayPause={togglePlay}
                onReset={() => { setIsPlaying(false); setCurrentYear(MIN_YEAR); setSelectedTerritory(null); }}
                onSpeedChange={setSpeed}
                onYearChange={(y) => { setIsPlaying(false); setCurrentYear(y); }}
            />
        </div>
      </main>

      {/* Info Modal / Side Panel */}
      {selectedTerritory && (
        <InfoModal 
          territory={selectedTerritory} 
          onClose={() => setSelectedTerritory(null)} 
        />
      )}
    </div>
  );
};

export default App;
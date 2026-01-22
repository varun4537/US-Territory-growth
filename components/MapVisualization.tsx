import React, { useState } from 'react';
import { Territory } from '../types';
import { US_OUTLINE_PATH } from '../constants';

interface MapVisualizationProps {
  territories: Territory[];
  currentYear: number;
  onSelectTerritory: (t: Territory) => void;
  selectedId: string | undefined;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ 
  territories, 
  currentYear, 
  onSelectTerritory,
  selectedId 
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const width = 960;
  const height = 600;

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      
      {/* Container for Map - Dark Neumorphic Inset */}
      <div className="w-full h-full bg-slate-900 rounded-3xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] p-4 relative overflow-hidden border border-white/5">
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />

        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full block drop-shadow-2xl"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
              <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
              </filter>
              <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
          </defs>

          {/* 1. Base Ghost Layer - The "Empty" US waiting to be filled - Darker slate */}
          <path 
            d={US_OUTLINE_PATH}
            fill="#1e293b" 
            stroke="#334155"
            strokeWidth="1"
            className="transition-all duration-1000"
            style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))' }}
          />

          {/* 2. Active Territories */}
          <g>
            {territories.map((t) => {
              const isVisible = t.year <= currentYear;
              const isHovered = hoveredId === t.id;
              const isSelected = selectedId === t.id;

              return (
                <g 
                  key={t.id} 
                  className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  onClick={() => isVisible && onSelectTerritory(t)}
                  onMouseEnter={() => setHoveredId(t.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: isVisible ? 'pointer' : 'default' }}
                >
                  <path
                    d={t.path}
                    fill={t.color}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={isSelected ? 3 : 1}
                    className="transition-all duration-300"
                    style={{
                      // Glowing effect for active territories
                      filter: isSelected || isHovered 
                        ? 'drop-shadow(0px 0px 15px rgba(255,255,255,0.4)) brightness(1.2)' 
                        : 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))',
                      transformOrigin: 'center',
                      transform: isHovered && isVisible ? 'scale(1.002)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Gloss overlay */}
                  <path 
                    d={t.path} 
                    fill="url(#shine)" 
                    className="pointer-events-none opacity-40 mix-blend-overlay" 
                  />
                </g>
              );
            })}
          </g>

          {/* 3. Labels */}
          {territories.map((t) => {
              if (t.year > currentYear) return null;
              const isSelected = selectedId === t.id;
              
              return (
                  <g key={`lbl-${t.id}`} className="pointer-events-none animate-fade-in">
                      <text
                          x={t.labelX}
                          y={t.labelY}
                          textAnchor="middle"
                          fill="white"
                          fontSize={isSelected ? 18 : 12}
                          fontWeight="700"
                          className="drop-shadow-md tracking-wide"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                      >
                          {t.year}
                      </text>
                  </g>
              )
          })}
        </svg>

        {/* Floating Tooltip - Dark Glassmorphism - Moved to Bottom Left */}
        {hoveredId && territories.find(t => t.id === hoveredId)?.year <= currentYear && (
          <div 
            className="absolute bottom-6 left-6 px-4 py-2 rounded-xl text-white font-semibold shadow-2xl backdrop-blur-md bg-slate-800/80 border border-white/20 z-20 pointer-events-none transform transition-all duration-200"
          >
            {territories.find(t => t.id === hoveredId)?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapVisualization;
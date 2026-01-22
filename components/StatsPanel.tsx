import React, { useMemo, useState } from 'react';
import { Territory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatsPanelProps {
  territories: Territory[];
  currentYear: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ territories, currentYear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = useMemo(() => {
    let totalArea = 0;
    let totalCostAdj = 0;
    const active = territories.filter(t => t.year <= currentYear);

    active.forEach(t => {
      totalArea += t.areaSqMiles;
      if (t.costInflationAdjusted) totalCostAdj += t.costInflationAdjusted;
    });

    const percentComplete = Math.min(100, (totalArea / 3800000) * 100);
    return { totalArea, totalCostAdj, percentComplete, count: active.length };
  }, [territories, currentYear]);

  const chartData = territories
    .filter(t => t.year <= currentYear)
    .map(t => ({ name: t.name, value: t.areaSqMiles, color: t.color }));

  return (
    <div 
      className={`
        backdrop-blur-xl bg-slate-900/60 border border-white/10 shadow-2xl rounded-2xl
        transition-all duration-500 ease-in-out overflow-hidden ring-1 ring-black/20
        ${isExpanded ? 'w-72 p-5' : 'w-48 p-3'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          US Stats
        </h3>
        <div className="text-slate-400">
             {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      <div className="space-y-3">
        {/* Compact View */}
        <div>
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold text-slate-100">
               {(stats.totalArea / 1000000).toFixed(2)}M
            </span>
            <span className="text-[10px] text-slate-400 mb-1">sq mi</span>
          </div>
          <div className="h-1.5 w-full bg-slate-700/50 rounded-full mt-1 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
              style={{ width: `${stats.percentComplete}%`, transition: 'width 0.5s ease' }}
            />
          </div>
        </div>

        {/* Expanded Details */}
        <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 hidden'}`}>
            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Cost (2024)</span>
                <span className="font-bold text-emerald-400 text-sm">
                    ${(stats.totalCostAdj / 1000000000).toFixed(1)}B
                </span>
            </div>
            
            <div className="mt-4 h-24 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            innerRadius={25}
                            outerRadius={40}
                            paddingAngle={3}
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-500">MAP</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
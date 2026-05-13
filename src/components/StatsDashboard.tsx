import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useOrbitalStore } from '../store/store';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

export const StatsDashboard = () => {
  const { stats } = useOrbitalStore();

  // Mock historical data for the chart
  const data = useMemo(() => {
    const arr = [];
    let baseProbability = 12;
    for (let i = 0; i < 20; i++) {
      baseProbability += (Math.random() * 4 - 2);
      arr.push({
        time: `T-${20 - i}m`,
        probability: Math.max(0, Math.min(100, baseProbability))
      });
    }
    return arr;
  }, []);

  return (
    <div className="glass-panel h-full flex flex-col gap-4 overflow-y-auto scrollbar-thin">
      <h2 className="text-neonCyan flex items-center gap-2 border-b border-white/10 pb-2 shrink-0">
        <Activity size={20} />
        System Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 p-3 rounded border border-white/5">
          <div className="text-xs text-slate-400 font-orbitron">Tracked Debris</div>
          <div className="text-xl text-neonAmber font-bold">{stats.debrisCount.toLocaleString()}</div>
        </div>
        <div className="bg-black/30 p-3 rounded border border-white/5">
          <div className="text-xs text-slate-400 font-orbitron">Active Sats</div>
          <div className="text-xl text-neonCyan font-bold">{stats.activeSatellites.toLocaleString()}</div>
        </div>
        <div className="col-span-2 bg-black/30 p-3 rounded border border-white/5 flex justify-between items-center">
          <div className="text-xs text-slate-400 font-orbitron">Network Health</div>
          <div className="text-lg text-green-400 font-bold">{stats.overallHealth}%</div>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full mt-2 min-h-[200px]">
        <h3 className="text-xs font-orbitron text-slate-400 mb-2 shrink-0">Collision Probability Index</h3>
        <div className="flex-1 w-full min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff003c" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} tickMargin={5} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ff003c', borderRadius: '4px', boxShadow: '0 0 10px rgba(255,0,60,0.3)' }}
                itemStyle={{ color: '#ff003c', fontFamily: 'Orbitron' }}
                labelStyle={{ color: '#fff', fontFamily: 'Inter', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="probability" 
                stroke="#ff003c" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorProb)" 
                filter="url(#glow)"
                isAnimationActive={true}
                animationDuration={1500}
                activeDot={{ r: 5, fill: '#ff003c', stroke: '#fff', strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

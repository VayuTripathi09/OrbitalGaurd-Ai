import { useEffect } from 'react';
import { useOrbitalStore } from '../store/store';
import { Satellite, Activity } from 'lucide-react';

export const TelemetryPanel = () => {
  const { satellites, updateSatellites } = useOrbitalStore();

  useEffect(() => {
    const interval = setInterval(updateSatellites, 1500);
    return () => clearInterval(interval);
  }, [updateSatellites]);

  return (
    <div className="glass-panel h-full flex flex-col">
      <h2 className="text-neonCyan flex items-center gap-2 border-b border-white/10 pb-2">
        <Activity size={20} />
        Live Telemetry
      </h2>
      
      <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-2 scrollbar-thin">
        {satellites.map(sat => (
          <div key={sat.id} className="bg-black/20 border border-white/5 p-3 rounded flex justify-between items-center transition-all hover:bg-neonCyan/5 hover:border-neonCyan/30 hover:translate-x-1">
            <div className="flex flex-col gap-1">
              <span className="font-orbitron font-semibold text-sm flex items-center gap-2">
                <Satellite size={14} className="text-slate-400" />
                {sat.name}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ALT: {sat.altitude.toFixed(1)} km | VEL: {sat.velocity.toFixed(3)} km/s
              </span>
            </div>
            <div 
              className={`w-2.5 h-2.5 rounded-full ${
                sat.status === 'ok' ? 'bg-neonCyan shadow-glow-cyan' :
                sat.status === 'warn' ? 'bg-neonAmber shadow-glow-amber' :
                'bg-neonRed shadow-glow-red'
              }`} 
              title={`Status: ${sat.status}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

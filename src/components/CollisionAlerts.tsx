import { useEffect } from 'react';
import { useOrbitalStore } from '../store/store';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CollisionAlerts = () => {
  const { alerts, updateAlerts, resolveAlert } = useOrbitalStore();

  useEffect(() => {
    const interval = setInterval(updateAlerts, 1000);
    return () => clearInterval(interval);
  }, [updateAlerts]);

  return (
    <div className="glass-panel h-full flex flex-col">
      <h2 className="text-neonRed flex items-center gap-2 border-b border-white/10 pb-2">
        <ShieldAlert size={20} className="animate-pulse" />
        Threat Assessment
      </h2>
      
      <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-3">
        <AnimatePresence>
          {alerts.map(alert => (
            <motion.div 
              key={alert.id}
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`border-l-4 p-3 rounded-r bg-gradient-to-r ${
                alert.level === 'critical' ? 'border-neonRed from-neonRed/20' : 'border-neonAmber from-neonAmber/20'
              } to-transparent`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-orbitron text-sm font-bold flex items-center gap-1 ${
                  alert.level === 'critical' ? 'text-neonRed' : 'text-neonAmber'
                }`}>
                  {alert.level === 'critical' && <AlertTriangle size={14} className="animate-pulse" />}
                  {alert.target}
                </span>
                <span className="font-orbitron font-bold text-slate-200">
                  T-{alert.timeToImpact}s
                </span>
              </div>
              <div className="text-xs text-slate-400 mb-3 space-y-1">
                <div><strong className="text-slate-300">Debris:</strong> {alert.debrisId}</div>
                <div><strong className="text-slate-300">Prob:</strong> {alert.probability.toFixed(1)}%</div>
              </div>
              
              {!alert.actionTaken ? (
                <button 
                  className={`w-full py-1.5 btn-action ${alert.level === 'critical' ? 'btn-critical animate-pulse' : ''}`}
                  onClick={() => resolveAlert(alert.id)}
                >
                  Execute Maneuver
                </button>
              ) : (
                <button className="w-full py-1.5 border border-slate-600 text-slate-500 rounded font-orbitron text-xs uppercase" disabled>
                  Evading...
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

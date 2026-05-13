import { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, AreaChart, Area, Cell } from 'recharts';
import { Radar, AlertTriangle, Crosshair, Cpu, ShieldAlert } from 'lucide-react';

const DEBRIS_TYPES = [
  { type: 'Fragmentation', percentage: 64, color: '#ff003c' },
  { type: 'Payloads', percentage: 22, color: '#fcee0a' },
  { type: 'Rocket Bodies', percentage: 11, color: '#00f0ff' },
  { type: 'Unknown Anomaly', percentage: 3, color: '#ffffff' }
];

const INITIAL_FRAGMENTS = [
  { id: 'DEB-8422A', origin: 'Cosmos 2251', alt: 780, risk: 98, status: 'CRITICAL' },
  { id: 'DEB-112B', origin: 'Iridium 33', alt: 778, risk: 92, status: 'HIGH' },
  { id: 'FRAG-X99', origin: 'Unknown', alt: 405, risk: 85, status: 'WARNING' },
  { id: 'DEB-998C', origin: 'Fengyun-1C', alt: 850, risk: 64, status: 'ELEVATED' },
  { id: 'DEB-441A', origin: 'Pegasus HAPS', alt: 600, risk: 42, status: 'MONITORING' },
];

export const DebrisDetection = () => {
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [fragments, setFragments] = useState(INITIAL_FRAGMENTS);

  useEffect(() => {
    // Initial Data
    const sData = Array.from({ length: 50 }, () => ({
      x: Math.random() * 1000 + 300, 
      y: Math.random() * 90 - 45, 
      z: Math.random() * 100, 
      fill: Math.random() > 0.8 ? '#ff003c' : Math.random() > 0.5 ? '#fcee0a' : '#00f0ff'
    }));
    setScatterData(sData);

    const aData = Array.from({ length: 12 }, (_, i) => ({
      time: `T-${12-i}m`,
      risk: Math.random() * 50 + (i * 2), 
    }));
    setAreaData(aData);

    // Real-Time Update Loop
    const interval = setInterval(() => {
      setScatterData(prev => prev.map(p => ({
        ...p,
        x: Math.max(200, Math.min(1500, p.x + (Math.random() * 20 - 10))), // fluctuate altitude
        y: Math.max(-45, Math.min(45, p.y + (Math.random() * 2 - 1))), // inclination drift
        z: Math.max(10, Math.min(200, p.z + (Math.random() * 10 - 5))) // hazard score change
      })));

      setAreaData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        newData.shift();
        
        let newTimeNum = parseInt(last.time.replace(/[^0-9]/g, '')) - 1;
        if (isNaN(newTimeNum)) newTimeNum = 0;
        
        newData.push({
          time: `T-${newTimeNum}m`,
          risk: Math.max(0, Math.min(100, last.risk + (Math.random() * 10 - 4)))
        });
        return newData;
      });

      setFragments(prev => prev.map(f => {
        const newRisk = Math.max(0, Math.min(100, f.risk + Math.floor(Math.random() * 7 - 3)));
        let newStatus = 'MONITORING';
        if (newRisk > 95) newStatus = 'CRITICAL';
        else if (newRisk > 85) newStatus = 'HIGH';
        else if (newRisk > 60) newStatus = 'WARNING';
        else if (newRisk > 40) newStatus = 'ELEVATED';

        return {
          ...f,
          alt: f.alt + Math.floor(Math.random() * 5 - 2),
          risk: newRisk,
          status: newStatus
        };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-6 p-2">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-neonCyan/30 pb-4 shrink-0">
        <Radar size={32} className="text-neonCyan animate-pulse" />
        <div>
          <h1 className="text-2xl font-orbitron text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            SPACE DEBRIS DETECTION
          </h1>
          <p className="text-neonCyan/70 font-mono text-xs">AI-DRIVEN CLUSTERING & HAZARD SCORING</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Col: Heatmap & Charts */}
        <div className="xl:col-span-8 flex flex-col gap-6 min-h-0">
          
          {/* Scatter Risk Heatmap */}
          <div className="glass-panel flex-1 min-h-[300px] relative">
            <h2 className="text-sm font-orbitron text-slate-300 mb-4 flex items-center gap-2">
              <Crosshair size={16} className="text-neonRed" />
              Orbital Sector Risk Heatmap
            </h2>
            <div className="absolute top-14 left-4 right-4 bottom-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="x" name="Altitude" unit="km" stroke="rgba(255,255,255,0.5)" fontSize={10} tickMargin={10} domain={[200, 1500]} />
                  <YAxis type="number" dataKey="y" name="Inclination" unit="°" stroke="rgba(255,255,255,0.5)" fontSize={10} tickMargin={5} />
                  <ZAxis type="number" dataKey="z" range={[10, 200]} name="Hazard Score" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ff003c', borderRadius: '4px' }}
                    itemStyle={{ color: '#fff', fontFamily: 'Inter', fontSize: '12px' }}
                  />
                  <Scatter name="Debris Fragments" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hazard Scoring Trend */}
          <div className="glass-panel h-[250px] relative shrink-0">
            <h2 className="text-sm font-orbitron text-slate-300 mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-neonAmber" />
              Global Kessler Hazard Trend
            </h2>
            <div className="absolute top-12 left-4 right-4 bottom-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fcee0a" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#fcee0a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} tickMargin={5} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #fcee0a', borderRadius: '4px' }}
                    itemStyle={{ color: '#fcee0a' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="#fcee0a" fillOpacity={1} fill="url(#colorRisk)" isAnimationActive={true} animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Classification & Tracking Feed */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-h-0">
          
          {/* Classification Breakdown */}
          <div className="glass-panel shrink-0">
            <h2 className="text-sm font-orbitron text-slate-300 mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-neonCyan" />
              Debris Classification AI
            </h2>
            <div className="flex flex-col gap-4">
              {DEBRIS_TYPES.map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span style={{ color: item.color }}>{item.type}</span>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full shadow-[0_0_10px_currentColor]" 
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color, color: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fragment Tracking Feed */}
          <div className="glass-panel flex-1 overflow-y-auto scrollbar-thin min-h-0">
            <h2 className="text-sm font-orbitron text-slate-300 mb-4 flex items-center gap-2 sticky top-0 bg-bgPanelSolid/90 backdrop-blur pb-2 z-10">
              <AlertTriangle size={16} className="text-neonRed" />
              Live Fragment Tracking
            </h2>
            <div className="flex flex-col gap-3">
              {fragments.map((frag) => (
                <div key={frag.id} className="border border-white/10 p-3 rounded bg-black/40 hover:border-neonCyan/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-orbitron text-neonCyan text-sm group-hover:text-white transition-colors">{frag.id}</div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      frag.status === 'CRITICAL' ? 'bg-neonRed text-black animate-pulse' :
                      frag.status === 'HIGH' ? 'bg-neonRed/30 text-neonRed border border-neonRed' :
                      frag.status === 'WARNING' ? 'bg-neonAmber/30 text-neonAmber border border-neonAmber' :
                      'bg-white/10 text-slate-300'
                    }`}>
                      {frag.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                    <div>ORG: <span className="text-white">{frag.origin}</span></div>
                    <div>ALT: <span className="text-white">{frag.alt} km</span></div>
                    <div className="col-span-2 mt-1">
                      HAZARD SCORE: <span className={frag.risk > 90 ? 'text-neonRed' : 'text-neonAmber'}>{frag.risk}/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Trail } from '@react-three/drei';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Focus, Sliders, Activity, Zap, Moon } from 'lucide-react';

const EarthSandbox = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#001133" wireframe={true} transparent opacity={0.3} />
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </mesh>
  );
};

const SatelliteSandbox = ({ drag, radiation, j2, multibody, onAltitudeUpdate }: any) => {
  const meshRef = useRef<any>(null);
  
  // Physics State
  const state = useRef({
    radius: 4.0,
    angle: 0,
    inclination: 0.5,
    speed: 0.02
  });

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Apply Physics
    // Drag decays the orbit (radius)
    if (drag > 0) {
      state.current.radius -= (drag / 100) * 0.005;
      if (state.current.radius < 2.1) state.current.radius = 2.1; // Atmospheric reentry limit
    }

    // Radiation & J2 perturbs inclination and speed
    if (radiation > 0) {
      state.current.inclination += (Math.sin(state.current.angle) * (radiation / 100)) * 0.01;
    }
    
    if (j2 > 0) {
      state.current.speed = 0.02 + (j2 / 10) * 0.01;
    }

    if (multibody) {
      state.current.radius += Math.sin(state.current.angle * 2) * 0.05; // Elliptical perturbation
    }

    // Propagate Orbit
    state.current.angle += state.current.speed;
    
    const x = Math.cos(state.current.angle) * state.current.radius;
    const z = Math.sin(state.current.angle) * state.current.radius;
    const y = Math.sin(state.current.angle) * state.current.radius * Math.sin(state.current.inclination);

    meshRef.current.position.set(x, y, z);
    
    // Send telemetry up
    onAltitudeUpdate(state.current.radius);
  });

  return (
    <Trail width={2} color="#fcee0a" length={100} decay={1} target={meshRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#fcee0a" />
      </mesh>
    </Trail>
  );
};

export const OrbitalSimulation = () => {
  const [drag, setDrag] = useState(0);
  const [radiation, setRadiation] = useState(0);
  const [j2, setJ2] = useState(1);
  const [multibody, setMultibody] = useState(false);
  
  const [altitudeData, setAltitudeData] = useState<any[]>(Array.from({ length: 20 }, (_, i) => ({ time: i, alt: 800 })));
  const altRef = useRef(800);

  // Sync ref with state
  const handleAltitudeUpdate = (radius: number) => {
    // Convert arbitrary radius to km (2.0 earth radius = 0km, 4.0 = 800km)
    const km = ((radius - 2.0) * 400);
    altRef.current = km;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAltitudeData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: newData[newData.length - 1].time + 1,
          alt: Math.max(0, altRef.current)
        });
        return newData;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const resetSim = () => {
    setDrag(0);
    setRadiation(0);
    setJ2(1);
    setMultibody(false);
  };

  return (
    <div className="h-full w-full flex flex-col gap-6 p-2 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neonCyan/30 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <Focus size={32} className="text-neonCyan animate-spin-slow" />
          <div>
            <h1 className="text-2xl font-orbitron text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              ORBITAL SIMULATION SANDBOX
            </h1>
            <p className="text-neonCyan/70 font-mono text-xs">CUSTOM PHYSICS PROPAGATION ENGINE</p>
          </div>
        </div>
        <button onClick={resetSim} className="border border-neonRed text-neonRed hover:bg-neonRed/10 px-4 py-2 font-orbitron text-sm transition-colors rounded">
          RESET PHYSICS
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Col: Physics Controls */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="glass-panel flex-1">
            <h2 className="text-sm font-orbitron text-slate-300 mb-6 flex items-center gap-2">
              <Sliders size={16} className="text-neonCyan" />
              Environment Variables
            </h2>
            
            <div className="flex flex-col gap-8">
              {/* Drag */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-2 text-slate-300">
                  <span>Atmospheric Drag</span>
                  <span className={drag > 50 ? 'text-neonRed font-bold' : 'text-neonCyan'}>{drag}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={drag} 
                  onChange={(e) => setDrag(Number(e.target.value))}
                  className="w-full accent-neonCyan"
                />
                <p className="text-[10px] text-slate-500 mt-1">Increases orbital decay rate in LEO.</p>
              </div>

              {/* Radiation */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-2 text-slate-300">
                  <span>Solar Radiation Pressure</span>
                  <span className="text-neonAmber">{radiation}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={radiation} 
                  onChange={(e) => setRadiation(Number(e.target.value))}
                  className="w-full accent-neonAmber"
                />
                <p className="text-[10px] text-slate-500 mt-1">Perturbs orbital inclination and eccentricity.</p>
              </div>

              {/* J2 Gravity */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-2 text-slate-300">
                  <span>Earth J2 Anomaly Multiplier</span>
                  <span className="text-white">{j2}x</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.1" value={j2} 
                  onChange={(e) => setJ2(Number(e.target.value))}
                  className="w-full accent-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">Simulates Earth's equatorial bulge affecting velocity.</p>
              </div>

              {/* Multi-body */}
              <div className="border border-white/10 p-4 rounded bg-black/40 flex justify-between items-center">
                <div>
                  <div className="font-orbitron text-sm text-slate-300 flex items-center gap-2">
                    <Moon size={14} className="text-slate-400" />
                    Multi-Body Physics
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Enable Lunar/Solar gravity well perturbations.</div>
                </div>
                <button 
                  onClick={() => setMultibody(!multibody)}
                  className={`px-4 py-1.5 font-orbitron text-xs border rounded transition-colors ${multibody ? 'bg-neonCyan/20 border-neonCyan text-neonCyan shadow-glow-cyan' : 'border-white/20 text-slate-500'}`}
                >
                  {multibody ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Sandbox & Telemetry */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* 3D Sandbox */}
          <div className="glass-panel h-[450px] p-0 overflow-hidden relative border-neonCyan/30 shadow-glow-cyan">
            <div className="absolute top-4 left-4 z-10 font-orbitron text-sm text-white drop-shadow-md">
              <Zap size={16} className="inline mr-2 text-neonCyan" />
              LIVE PROPAGATION
            </div>
            {drag > 50 && (
              <div className="absolute bottom-4 right-4 z-10 text-neonRed font-orbitron text-xs animate-pulse">
                CRITICAL ORBITAL DECAY DETECTED
              </div>
            )}
            <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
              <EarthSandbox />
              {/* The Sandbox Satellite relies on key to force full reset when variables are reset, or we just pass them as props */}
              <SatelliteSandbox 
                key={drag === 0 && radiation === 0 && j2 === 1 && !multibody ? 'reset' : 'sim'} 
                drag={drag} 
                radiation={radiation} 
                j2={j2} 
                multibody={multibody} 
                onAltitudeUpdate={handleAltitudeUpdate} 
              />
              <OrbitControls enablePan={false} maxDistance={15} minDistance={3} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>

          {/* Telemetry Chart */}
          <div className="glass-panel h-[200px] relative">
            <h2 className="text-sm font-orbitron text-slate-300 mb-2 flex items-center gap-2">
              <Activity size={16} className={drag > 50 ? 'text-neonRed' : 'text-neonCyan'} />
              Satellite Altitude Telemetry
            </h2>
            <div className="absolute top-10 left-4 right-4 bottom-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={altitudeData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={drag > 50 ? '#ff003c' : '#00f0ff'} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={drag > 50 ? '#ff003c' : '#00f0ff'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 1000]} stroke="rgba(255,255,255,0.5)" fontSize={10} width={40} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: `1px solid ${drag > 50 ? '#ff003c' : '#00f0ff'}`, borderRadius: '4px' }}
                    itemStyle={{ color: drag > 50 ? '#ff003c' : '#00f0ff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="alt" stroke={drag > 50 ? '#ff003c' : '#00f0ff'} fillOpacity={1} fill="url(#colorAlt)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

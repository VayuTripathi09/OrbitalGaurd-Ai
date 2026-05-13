import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, Cpu, AlertOctagon, Rocket, Zap } from 'lucide-react';

const AvoidanceSimulation = ({ executing }: { executing: boolean }) => {
  const satRef = useRef<THREE.Mesh>(null);
  const debrisRef = useRef<THREE.Mesh>(null);
  const exhaustRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() % 6; // 6-second loop
    
    // Reset positions
    if (satRef.current) {
      satRef.current.position.set(-3 + t, 0, 0); // Moving right
      
      // Maneuver Logic
      if (executing && t > 2 && t < 4) {
        // Delta-V burn: Shift Z to dodge
        satRef.current.position.z = THREE.MathUtils.lerp(satRef.current.position.z, 1.5, 0.1);
      } else if (t < 2) {
        satRef.current.position.z = 0;
      }
    }
    
    if (debrisRef.current) {
      debrisRef.current.position.set(3 - t, 0, 0); // Moving left
    }

    if (exhaustRef.current) {
      exhaustRef.current.visible = executing && t > 2 && t < 3.5;
      exhaustRef.current.scale.setScalar(Math.random() * 0.5 + 0.5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Target Satellite */}
      <mesh ref={satRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
        {/* Thruster Exhaust */}
        <mesh ref={exhaustRef} position={[0, 0, -0.3]}>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshBasicMaterial color="#fcee0a" transparent opacity={0.8} />
        </mesh>
      </mesh>

      {/* Incoming Debris */}
      <mesh ref={debrisRef}>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color="#ff003c" emissive="#ff003c" emissiveIntensity={0.8} />
      </mesh>

      {/* Trajectory Lines */}
      <Line points={[[-5, 0, 0], [5, 0, 0]]} color="#ff003c" transparent opacity={0.3} dashed dashSize={0.2} dashScale={1} />
      <Line points={[[-5, 0, 1.5], [0, 0, 1.5], [0, 0, 0]]} color="#00f0ff" transparent opacity={0.3} dashed dashSize={0.2} dashScale={1} />
      
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI/2} />
    </>
  );
};

export const CollisionPrediction = () => {
  const [executing, setExecuting] = useState(false);

  const probData = [
    { name: 'Impact Probability', value: 98.4, color: '#ff003c' },
    { name: 'Safe Margin', value: 1.6, color: '#1a202c' }
  ];

  const handleManeuver = () => {
    setExecuting(true);
    setTimeout(() => setExecuting(false), 6000);
  };

  return (
    <div className="h-full w-full flex flex-col gap-6 p-2 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neonCyan/30 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <AlertOctagon size={32} className="text-neonRed animate-pulse" />
          <div>
            <h1 className="text-2xl font-orbitron text-white drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]">
              COLLISION PREDICTION ENGINE
            </h1>
            <p className="text-neonRed/70 font-mono text-xs">IMMINENT THREAT DETECTED: Iridium NEXT vs DEB-8422A</p>
          </div>
        </div>
        <div className="font-orbitron text-3xl text-neonRed drop-shadow-[0_0_15px_rgba(255,0,60,1)] animate-pulse">
          T-00:01:45
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Col: Probability & Radar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="glass-panel flex flex-col items-center justify-center relative">
            <h2 className="text-sm font-orbitron text-slate-300 w-full text-left mb-2 flex items-center gap-2">
              <Cpu size={16} className="text-neonCyan" />
              AI Impact Probability
            </h2>
            <div className="w-full h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={probData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    startAngle={180}
                    endAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {probData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-10">
                <span className="text-5xl font-orbitron text-neonRed font-bold drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]">
                  98.4%
                </span>
                <span className="text-xs font-mono text-slate-400 mt-1">CONFIDENCE</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 mt-4 border-t border-white/10 pt-4 text-xs font-mono">
              <div>
                <div className="text-slate-500">Miss Distance</div>
                <div className="text-neonRed font-bold text-lg">12.4m</div>
              </div>
              <div>
                <div className="text-slate-500">Relative Vel</div>
                <div className="text-white font-bold text-lg">14.2 km/s</div>
              </div>
            </div>
          </div>

          {/* Automated Warnings Feed */}
          <div className="glass-panel flex-1">
            <h2 className="text-sm font-orbitron text-slate-300 mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-neonAmber" />
              Emergency Console
            </h2>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="p-2 bg-neonRed/10 border-l-2 border-neonRed text-white">
                [CRITICAL] Trajectory intersection verified at LAT 45.2, LON -12.4.
              </div>
              <div className="p-2 bg-neonAmber/10 border-l-2 border-neonAmber text-white">
                [WARNING] Target debris (DEB-8422A) exhibits chaotic tumble. 
              </div>
              <div className="p-2 bg-white/5 border-l-2 border-neonCyan text-slate-300">
                [INFO] AI calculating optimal evasion burns... 3 options generated.
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Maneuvers & Simulation */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* 3D Avoidance Simulation */}
          <div className="glass-panel h-[400px] p-0 overflow-hidden relative border-neonRed/50 shadow-glow-red">
            <div className="absolute top-4 left-4 z-10 font-orbitron text-sm text-white drop-shadow-md">
              <Rocket size={16} className="inline mr-2 text-neonCyan" />
              EMERGENCY AVOIDANCE SIMULATION
            </div>
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
               {executing && <span className="text-neonAmber font-orbitron text-xs animate-pulse">BURN IN PROGRESS...</span>}
            </div>
            <Canvas camera={{ position: [0, 4, 4], fov: 50 }}>
              <AvoidanceSimulation executing={executing} />
            </Canvas>
          </div>

          {/* Maneuver Suggestions */}
          <div className="glass-panel">
            <h2 className="text-sm font-orbitron text-slate-300 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-neonCyan" />
              Automated Safe Maneuver Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="border border-neonCyan bg-neonCyan/5 p-4 rounded hover:bg-neonCyan/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-orbitron text-neonCyan">OPTION A: PROGRADE BURN</div>
                  <div className="text-xs bg-neonCyan text-black px-1 font-bold rounded">OPTIMAL</div>
                </div>
                <div className="font-mono text-xs text-slate-300 mb-4">
                  ΔV required: +1.2 m/s<br/>
                  Fuel cost: 4.2 kg<br/>
                  Post-maneuver miss distance: 1.4 km
                </div>
                <button 
                  onClick={handleManeuver}
                  disabled={executing}
                  className="w-full bg-neonCyan/20 border border-neonCyan text-neonCyan py-2 font-orbitron text-sm hover:bg-neonCyan hover:text-black transition-all disabled:opacity-50"
                >
                  EXECUTE MANEUVER
                </button>
              </div>

              <div className="border border-white/10 bg-black/40 p-4 rounded hover:border-neonAmber/50 transition-colors opacity-70">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-orbitron text-neonAmber">OPTION B: YAW EVASION</div>
                </div>
                <div className="font-mono text-xs text-slate-300 mb-4">
                  ΔV required: 2.8 m/s<br/>
                  Fuel cost: 8.5 kg<br/>
                  Post-maneuver miss distance: 0.8 km
                </div>
                <button className="w-full border border-white/20 text-slate-300 py-2 font-orbitron text-sm hover:bg-white/10 transition-all">
                  SIMULATE
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

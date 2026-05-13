import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useOrbitalStore } from '../store/store';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const colorMap = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  const { playback } = useOrbitalStore();
  
  useFrame(() => {
    if (earthRef.current && !playback.isPaused) {
      // Rotate earth based on playback speed
      earthRef.current.rotation.y += 0.005 * playback.speed;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={colorMap} roughness={0.6} />
      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[2.08, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </mesh>
  );
};

const DebrisCloud = () => {
  const count = 5000;
  const { playback } = useOrbitalStore();
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorThreat = new THREE.Color('#ff003c');
    const colorNormal = new THREE.Color('#88ccff');

    for (let i = 0; i < count; i++) {
      // Random position in a spherical shell (LEO representation)
      const r = 2.2 + Math.random() * 1.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Color clustering (simulate danger zones)
      const isThreat = Math.random() > 0.95;
      const finalColor = isThreat ? colorThreat : colorNormal;
      col[i * 3] = finalColor.r;
      col[i * 3 + 1] = finalColor.g;
      col[i * 3 + 2] = finalColor.b;
    }
    return [pos, col];
  }, []);

  useFrame(() => {
    if (pointsRef.current && !playback.isPaused) {
      pointsRef.current.rotation.y += 0.002 * playback.speed;
      pointsRef.current.rotation.z += 0.001 * playback.speed;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

import { Trail } from '@react-three/drei';

const OrbitPath = ({ radius, speed, color, name, inclination = 0 }: { radius: number, speed: number, color: string, name: string, inclination?: number }) => {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<any>(null);
  const { playback } = useOrbitalStore();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (ref.current && !playback.isPaused) {
      ref.current.rotation.y += speed * 0.05 * playback.speed;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const category = radius < 3.0 ? 'LEO' : radius < 4.5 ? 'MEO' : 'GEO';

  return (
    <group rotation={[inclination, 0, 0]}>
      <group ref={ref}>
        {/* Full Orbit Path */}
        <Line points={points} color={hovered ? '#ffffff' : color} lineWidth={hovered ? 2 : 1} transparent opacity={hovered ? 0.6 : 0.15} dashed={true} dashScale={50} dashSize={1} dashOffset={0} />
        
        {/* Satellite with Trail */}
        <Trail
          width={1.5}
          color={color}
          length={40}
          decay={1}
          attenuation={(t) => t * t}
          target={meshRef}
        >
          <mesh 
            ref={meshRef}
            position={[radius, 0, 0]} 
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} 
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[hovered ? 0.08 : 0.05, 16, 16]} />
            <meshBasicMaterial color={hovered ? '#ffffff' : color} />
            {hovered && (
              <Html distanceFactor={10} position={[0, 0.2, 0]} center zIndexRange={[100, 0]}>
                <div className="bg-black/80 border border-neonCyan p-3 rounded text-xs font-orbitron text-neonCyan whitespace-nowrap shadow-glow-cyan pointer-events-none min-w-[160px]">
                  <div className="font-bold border-b border-neonCyan/30 mb-2 pb-1 flex justify-between items-center">
                    <span className="text-[14px] text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{name}</span>
                    <span className="text-black bg-neonCyan px-1.5 py-0.5 rounded text-[9px]">{category}</span>
                  </div>
                  <div className="text-slate-300 flex justify-between"><span>ALT:</span> <span className="font-mono">{(radius * 200).toFixed(0)} km</span></div>
                  <div className="text-slate-300 flex justify-between"><span>VEL:</span> <span className="font-mono">{(Math.abs(speed) * 30).toFixed(1)} km/s</span></div>
                  <div className="text-slate-300 flex justify-between"><span>INC:</span> <span className="font-mono">{(inclination * (180/Math.PI)).toFixed(1)}°</span></div>
                </div>
              </Html>
            )}
          </mesh>
        </Trail>
      </group>
    </group>
  );
};

export const Globe3D = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-lg overflow-hidden border border-white/10 bg-[#02050a] shadow-glass">
      <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 5, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} color="#00f0ff" intensity={0.5} />
        
        <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={0.5} />
        
        <Earth />
        <DebrisCloud />
        
        {/* Simulate multiple orbital paths with trails and inclinations */}
        <OrbitPath radius={2.6} speed={0.2} color="#00f0ff" name="Starlink V2-A" inclination={0.8} />
        <OrbitPath radius={2.9} speed={-0.15} color="#ff003c" name="Iridium NEXT" inclination={1.5} />
        <OrbitPath radius={3.3} speed={0.1} color="#fcee0a" name="Hubble Space" inclination={0.5} />
        <OrbitPath radius={3.8} speed={-0.25} color="#ffffff" name="ISS Alpha" inclination={0.9} />
        <OrbitPath radius={5.2} speed={0.05} color="#ff00ff" name="Meteosat-11" inclination={0.1} />
        <OrbitPath radius={6.5} speed={0.03} color="#00ff88" name="GPS Block III" inclination={0.95} />
        
        <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={20} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

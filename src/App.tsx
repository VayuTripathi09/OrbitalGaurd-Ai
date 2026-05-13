import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Globe3D } from './components/Globe3D';
import { TelemetryPanel } from './components/TelemetryPanel';
import { CollisionAlerts } from './components/CollisionAlerts';
import { StatsDashboard } from './components/StatsDashboard';
import { AICopilot } from './components/AICopilot';
import { Sidebar } from './components/Sidebar';
import { TimelineScrubber } from './components/TimelineScrubber';
import { MediaCenter } from './pages/MediaCenter';
import { DebrisDetection } from './pages/DebrisDetection';
import { CollisionPrediction } from './pages/CollisionPrediction';
import { OrbitalSimulation } from './pages/OrbitalSimulation';
import { Globe, Clock, ShieldCheck, ScanLine } from 'lucide-react';

const Dashboard = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 z-10 w-full min-h-[850px] pb-10">
    {/* Left Column: Telemetry & Stats */}
    <div className="lg:col-span-3 flex flex-col gap-4">
      <div className="h-[400px]"><TelemetryPanel /></div>
      <div className="h-[400px]"><StatsDashboard /></div>
    </div>

    {/* Center Column: 3D Globe Visualization */}
    <div className="lg:col-span-6 h-[816px] relative rounded-lg overflow-hidden glass-panel p-0">
      <Globe3D />
      {/* Overlay HUD elements */}
      <div className="absolute top-4 right-4 pointer-events-none text-xs font-orbitron text-neonCyan/70 text-right z-10 bg-black/40 p-2 rounded backdrop-blur-md border border-neonCyan/30">
        <div>ORBITAL KINEMATICS ENGINE</div>
        <div>FPS: 60 (STABLE)</div>
        <ScanLine size={16} className="inline mt-1 animate-pulse" />
      </div>
      <TimelineScrubber />
    </div>

    {/* Right Column: AI & Alerts */}
    <div className="lg:col-span-3 flex flex-col gap-4">
      <div className="h-[400px]"><CollisionAlerts /></div>
      <div className="h-[400px]"><AICopilot /></div>
    </div>
  </div>
);

function App() {
  const [time, setTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex relative overflow-hidden bg-bgDark">
      {/* Animated Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(0,240,255,0)_50%,rgba(0,240,255,0.02)_50%)] bg-[length:100%_4px] opacity-30"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col pl-16">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-neonCyan/50 pb-2 pt-4 px-6 shadow-[0_4px_15px_rgba(0,240,255,0.05)] z-10 bg-black/20 backdrop-blur-md">
          <h1 className="text-neonCyan text-2xl flex items-center gap-3 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] font-orbitron">
            <Globe size={28} />
            ORBITALGUARD AI 3.0
          </h1>
          <div className="flex items-center gap-6 font-orbitron">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock size={16} />
              {time}
            </div>
            <div className="border border-neonCyan text-neonCyan bg-neonCyan/10 px-4 py-1.5 rounded flex items-center gap-2 text-sm shadow-glow-cyan animate-pulse">
              <ShieldCheck size={16} />
              SYSTEM ACTIVE
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 min-h-0 relative p-4 overflow-y-auto scrollbar-thin scroll-smooth">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/debris" element={<DebrisDetection />} />
            <Route path="/collision" element={<CollisionPrediction />} />
            <Route path="/simulation" element={<OrbitalSimulation />} />
            <Route path="/media" element={<MediaCenter />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

import { useOrbitalStore } from '../store/store';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';

export const TimelineScrubber = () => {
  const { playback, setPlayback } = useOrbitalStore();

  const handlePlayPause = () => {
    setPlayback({ isPaused: !playback.isPaused, speed: 1 });
  };

  const handleRewind = () => {
    setPlayback({ isPaused: false, speed: -2 });
  };

  const handleFastForward = () => {
    setPlayback({ isPaused: false, speed: 2 });
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel !p-2 flex items-center gap-4 z-50 rounded-full shadow-glow-cyan/50 backdrop-blur-xl bg-black/60 border-neonCyan/30">
      <div className="flex items-center gap-2 px-2">
        <button 
          onClick={handleRewind}
          className={`p-2 rounded-full transition-all ${playback.speed < 0 ? 'text-neonCyan bg-neonCyan/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
        >
          <Rewind size={16} />
        </button>
        <button 
          onClick={handlePlayPause}
          className="p-3 rounded-full bg-neonCyan text-black hover:scale-110 transition-transform shadow-glow-cyan"
        >
          {playback.isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
        </button>
        <button 
          onClick={handleFastForward}
          className={`p-2 rounded-full transition-all ${playback.speed > 1 ? 'text-neonCyan bg-neonCyan/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
        >
          <FastForward size={16} />
        </button>
      </div>
      <div className="w-64 flex flex-col gap-1 pr-4">
        <div className="flex justify-between text-[10px] font-orbitron text-neonCyan/70">
          <span>T-MINUS</span>
          <span className="text-neonCyan font-bold">{playback.isPaused ? 'PAUSED' : `${playback.speed}x SPEED`}</span>
          <span>LIVE</span>
        </div>
        <input 
          type="range" 
          min="-100" 
          max="0" 
          defaultValue="0"
          className="w-full accent-neonCyan h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { Play, Maximize2, ExternalLink } from 'lucide-react';

const MEDIA_ITEMS = [
  {
    id: 1,
    title: 'Kessler Syndrome Simulation',
    category: 'Debris Propagation',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    duration: '02:45'
  },
  {
    id: 2,
    title: 'Solar Flare Impact on LEO',
    category: 'Space Weather',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    duration: '01:15'
  },
  {
    id: 3,
    title: 'Active Debris Removal (ADR) Test',
    category: 'Mission Footage',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    duration: '05:30'
  },
  {
    id: 4,
    title: 'Lunar Gateway Construction',
    category: 'Future Scope',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop',
    duration: '04:20'
  },
  {
    id: 5,
    title: 'ISS Evasive Maneuver Replay',
    category: 'Historical Data',
    image: 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?q=80&w=800&auto=format&fit=crop',
    duration: '01:50'
  },
  {
    id: 6,
    title: 'Global Magnetic Field Fluctuations',
    category: 'Space Weather',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    duration: '03:10'
  }
];

export const MediaCenter = () => {
  return (
    <div className="h-full w-full overflow-y-auto scrollbar-thin p-6">
      <div className="flex justify-between items-end mb-8 border-b border-neonCyan/30 pb-4">
        <div>
          <h1 className="text-3xl font-orbitron text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            SPACE MEDIA CENTER
          </h1>
          <p className="text-neonCyan/70 font-mono text-sm">ARCHIVAL FOOTAGE & SIMULATION RENDERS</p>
        </div>
        <div className="flex gap-4">
          <button className="text-xs font-orbitron text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors border border-white/20">
            ALL MEDIA
          </button>
          <button className="text-xs font-orbitron text-neonCyan bg-neonCyan/10 hover:bg-neonCyan/20 px-4 py-2 rounded transition-colors border border-neonCyan/30 shadow-glow-cyan">
            SIMULATIONS
          </button>
          <button className="text-xs font-orbitron text-slate-400 hover:text-white transition-colors px-4 py-2">
            FOOTAGE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
        {MEDIA_ITEMS.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative rounded-xl overflow-hidden glass-panel !p-0 border border-white/10 hover:border-neonCyan/50 transition-all cursor-pointer shadow-lg hover:shadow-glow-cyan"
          >
            <div className="aspect-video w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 p-4 rounded-full border border-neonCyan/50 backdrop-blur-md shadow-glow-cyan">
                  <Play className="text-neonCyan translate-x-0.5" size={32} />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 z-20 bg-black/70 px-2 py-1 rounded text-xs font-mono text-white border border-white/20">
                {item.duration}
              </div>
            </div>
            <div className="p-5 bg-gradient-to-b from-black/60 to-black/90">
              <div className="text-xs font-orbitron text-neonCyan mb-2">{item.category}</div>
              <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1">{item.title}</h3>
              <div className="flex justify-between items-center text-slate-400">
                <button className="hover:text-neonCyan transition-colors"><ExternalLink size={16}/></button>
                <button className="hover:text-white transition-colors"><Maximize2 size={16}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

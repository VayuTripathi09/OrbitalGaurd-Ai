import { Link, useLocation } from 'react-router-dom';
import { Globe, Video, Settings, Activity, Radar, AlertOctagon, Focus } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/', icon: Globe, label: 'Mission Control' },
    { path: '/debris', icon: Radar, label: 'Debris Detection' },
    { path: '/collision', icon: AlertOctagon, label: 'Collision Engine' },
    { path: '/simulation', icon: Focus, label: 'Orbital Sandbox' },
    { path: '/media', icon: Video, label: 'Media Center' },
    { path: '/analytics', icon: Activity, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-16 hover:w-64 transition-all duration-300 h-full glass-panel overflow-hidden flex flex-col group z-50 absolute left-0 top-0 bottom-0">
      <div className="flex flex-col gap-6 mt-4">
        {links.map((link) => (
          <Link 
            key={link.path} 
            to={link.path}
            className={`flex items-center gap-4 p-2 rounded transition-colors ${
              location.pathname === link.path 
                ? 'text-neonCyan bg-neonCyan/10 shadow-glow-cyan' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <link.icon size={24} className="shrink-0" />
            <span className="font-orbitron text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

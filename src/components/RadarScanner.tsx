import { useEffect, useState } from 'react';

interface Debris {
  id: number;
  x: number;
  y: number;
  type: 'threat' | 'warning' | 'safe';
}

const generateRandomDebris = (): Debris => {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 200 + 20; // 20 to 220
  
  // Randomly assign type based on probability
  const rand = Math.random();
  const type = rand > 0.9 ? 'threat' : rand > 0.6 ? 'warning' : 'safe';

  return {
    id: Math.random(),
    x: 250 + radius * Math.cos(angle), // 250 is center
    y: 250 + radius * Math.sin(angle),
    type
  };
};

export const RadarScanner: React.FC = () => {
  const [debris, setDebris] = useState<Debris[]>([]);

  useEffect(() => {
    // Initial generation
    const initial = Array.from({ length: 40 }, generateRandomDebris);
    setDebris(initial);

    // Periodically update some debris positions
    const interval = setInterval(() => {
      setDebris(current => {
        const next = [...current];
        // Remove old
        if (next.length > 50) next.shift();
        // Add new
        next.push(generateRandomDebris());
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ gridColumn: '1 / -1', minHeight: '600px' }}>
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
        Orbital Radar Array (LEO)
      </h2>
      <div className="radar-container">
        <div className="radar-grid">
          {/* Circular grid lines already in CSS */}
          <div className="radar-sweep"></div>
          
          {debris.map(d => (
            <div 
              key={d.id} 
              className={`radar-dot ${d.type === 'threat' ? 'threat' : d.type === 'warning' ? 'warning' : ''}`}
              style={{ left: `${d.x}px`, top: `${d.y}px` }}
              title={`Object ID: ${d.id.toString().substring(2,8)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

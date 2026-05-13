import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrbitalStore } from '../store/store';
import { Cpu, Terminal, Sparkles } from 'lucide-react';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, 30);
    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayedText}</span>;
};

export const AICopilot = () => {
  const { aiMessages, addAiMessage } = useOrbitalStore();
  const [input, setInput] = useState('');

  useEffect(() => {
    // Simulate autonomous AI thoughts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const thoughts = [
          "Analyzing new trajectory data from LEO sector 7G...",
          "Optimizing collision avoidance algorithms...",
          "Warning: Solar flare activity detected. Recalculating orbital drag.",
          "Debris cluster alpha-9 behavior matches Kessler syndrome predictive model.",
        ];
        addAiMessage(thoughts[Math.floor(Math.random() * thoughts.length)], 'info');
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [addAiMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    addAiMessage(`User: ${input}`, 'info');
    setInput('');
    
    setTimeout(() => {
      addAiMessage("Processing command... Acknowledged. Updating parameters.", 'action');
    }, 1000);
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      <h2 className="text-neonCyan flex items-center gap-2 border-b border-white/10 pb-2">
        <Cpu size={20} className="animate-pulse" />
        OrbitalGuard AI Copilot
      </h2>

      <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 scrollbar-thin">
        <AnimatePresence>
          {aiMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-2 rounded border-l-2 text-sm font-orbitron tracking-wide ${
                msg.type === 'warning' ? 'border-neonAmber bg-neonAmber/10 text-neonAmber' :
                msg.type === 'action' ? 'border-neonRed bg-neonRed/10 text-neonRed' :
                'border-neonCyan bg-neonCyan/5 text-slate-300'
              }`}
            >
              <Terminal size={12} className="inline mr-2 mb-1" />
              <TypewriterText text={msg.text} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter voice or text command..."
          className="w-full bg-black/50 border border-neonCyan/30 rounded p-2 pl-8 text-sm text-neonCyan focus:outline-none focus:border-neonCyan font-orbitron placeholder:text-neonCyan/30"
        />
        <Sparkles size={14} className="absolute left-3 top-3 text-neonCyan/50" />
      </form>
    </div>
  );
};

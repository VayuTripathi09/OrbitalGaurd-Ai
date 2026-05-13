import { create } from 'zustand';

export interface TelemetryData {
  id: string;
  name: string;
  altitude: number;
  velocity: number;
  status: 'ok' | 'warn' | 'danger';
}

export interface Alert {
  id: string;
  target: string;
  debrisId: string;
  timeToImpact: number;
  probability: number;
  level: 'critical' | 'warning';
  actionTaken: boolean;
}

export interface SystemStats {
  debrisCount: number;
  activeSatellites: number;
  overallHealth: number;
}

export interface PlaybackState {
  isPaused: boolean;
  speed: number;
  timeOffset: number;
}

interface OrbitalState {
  satellites: TelemetryData[];
  alerts: Alert[];
  stats: SystemStats;
  aiMessages: { id: number, text: string, type: 'info' | 'warning' | 'action' }[];
  playback: PlaybackState;
  updateSatellites: () => void;
  updateAlerts: () => void;
  resolveAlert: (id: string) => void;
  addAiMessage: (text: string, type: 'info' | 'warning' | 'action') => void;
  setPlayback: (updates: Partial<PlaybackState>) => void;
}

const INITIAL_SATS: TelemetryData[] = [
  { id: 'SAT-01X', name: 'Starlink V2-A', altitude: 550, velocity: 7.66, status: 'ok' },
  { id: 'SAT-99B', name: 'ISS Alpha', altitude: 408, velocity: 7.66, status: 'ok' },
  { id: 'SAT-44C', name: 'Meteosat-11', altitude: 35786, velocity: 3.07, status: 'warn' },
  { id: 'SAT-12D', name: 'Hubble Space', altitude: 540, velocity: 7.59, status: 'ok' },
  { id: 'SAT-88Z', name: 'Iridium NEXT', altitude: 780, velocity: 7.46, status: 'danger' },
];

const INITIAL_ALERTS: Alert[] = [
  { id: 'ALT-991', target: 'Iridium NEXT', debrisId: 'DEB-8422A', timeToImpact: 14, probability: 98.4, level: 'critical', actionTaken: false },
  { id: 'ALT-992', target: 'Meteosat-11', debrisId: 'DEB-112B', timeToImpact: 145, probability: 45.2, level: 'warning', actionTaken: false },
];

export const useOrbitalStore = create<OrbitalState>((set) => ({
  satellites: INITIAL_SATS,
  alerts: INITIAL_ALERTS,
  stats: {
    debrisCount: 12450,
    activeSatellites: 8432,
    overallHealth: 94.2
  },
  aiMessages: [
    { id: 1, text: "OrbitalGuard AI Initialized. Monitoring LEO traffic...", type: 'info' }
  ],
  playback: {
    isPaused: false,
    speed: 1,
    timeOffset: 0
  },
  
  updateSatellites: () => set((state) => {
    if (state.playback.isPaused) return state;
    return {
      satellites: state.satellites.map(sat => ({
        ...sat,
        altitude: sat.altitude + (Math.random() * 2 - 1) * state.playback.speed,
        velocity: sat.velocity + (Math.random() * 0.02 - 0.01) * state.playback.speed
      }))
    };
  }),

  updateAlerts: () => set((state) => {
    if (state.playback.isPaused) return state;
    return {
      alerts: state.alerts.map(a => ({
        ...a,
        timeToImpact: Math.max(0, a.timeToImpact - (1 * state.playback.speed))
      }))
    };
  }),

  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => 
      a.id === id ? { ...a, actionTaken: true, level: 'warning', probability: 0 } : a
    )
  })),

  addAiMessage: (text, type) => set((state) => ({
    aiMessages: [...state.aiMessages, { id: Date.now(), text, type }].slice(-10) // keep last 10
  })),

  setPlayback: (updates) => set((state) => ({
    playback: { ...state.playback, ...updates }
  }))
}));

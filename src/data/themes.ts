import { FestTheme } from '../types.ts';

export const PROBLEM_STATEMENT_THEMES: FestTheme[] = [
  {
    name: 'Space',
    badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-700/60',
    directive: 'Orbital mechanics, satellite telemetry pipelines, and planetary exploration algorithms.',
    coreRule: 'Your team must apply the Space theme consistently across your application UI, data modeling, and submission presentation.'
  },
  {
    name: 'Retro',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-700/60',
    directive: '8-bit/16-bit computing paradigms, vintage terminal aesthetics, CRT scanline styling, and 1980s analog-to-digital hybrid systems.',
    coreRule: 'Your team must apply the Retro theme consistently across typography, pixelated assets, and retro-computing workflows.'
  },
  {
    name: 'Nature',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60',
    directive: 'Biomimetic computing, ecological monitoring sensors, regenerative agriculture telemetry, and organic fluid UI models.',
    coreRule: 'Your team must apply the Nature theme consistently across biological color palettes, organic component structures, and eco-centric logic.'
  },
  {
    name: 'Cyberpunk',
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-700/60',
    directive: 'Decentralized cyber defense, low-latency neural data interfaces, edge telemetry networks, and high-tech dark dystopian dashboards.',
    coreRule: 'Your team must apply the Cyberpunk theme consistently across high-contrast neon accents, terminal diagnostics, and telemetry grids.'
  },
  {
    name: 'Steampunk',
    badgeColor: 'text-orange-400 bg-orange-950/80 border-orange-700/60',
    directive: 'Brass gear kinematics, pneumatic automation simulators, Victorian industrial aesthetics, and clockwork mechanical calculating engines.',
    coreRule: 'Your team must apply the Steampunk motif consistently across copper/brass styling, gear physics, and industrial schematics.'
  },
  {
    name: 'Futurism',
    badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-700/60',
    directive: 'Smart-city quantum grids, autonomous hyperloop logistics, zero-emission propulsion, and hyper-minimal glassmorphism.',
    coreRule: 'Your team must apply the Futurism motif consistently across ultra-clean typography, predictive telemetry, and next-gen layouts.'
  }
];

export function getRandomTheme(): FestTheme {
  const randomIndex = Math.floor(Math.random() * PROBLEM_STATEMENT_THEMES.length);
  return PROBLEM_STATEMENT_THEMES[randomIndex];
}

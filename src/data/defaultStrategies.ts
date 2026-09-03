import { Strategy, Player } from '../types';

export const PITCH_LENGTH = 105;
export const PITCH_WIDTH = 68;

export function createFormationPlayers(
  formationA: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1',
  formationB: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1'
): Player[] {
  const players: Player[] = [];

  // Team A (Red, attacking right +X)
  // GK
  players.push({
    id: 'teamA-1',
    team: 'teamA',
    number: 1,
    name: 'Alisson',
    role: 'GK',
    position: { x: -48, y: 0, z: 0 },
    rotation: 0,
    isGoalkeeper: true,
  });

  if (formationA === '4-3-3') {
    players.push(
      { id: 'teamA-2', team: 'teamA', number: 2, name: 'Trent', role: 'RB', position: { x: -30, y: 0, z: 22 }, rotation: 0 },
      { id: 'teamA-4', team: 'teamA', number: 4, name: 'Van Dijk', role: 'CB', position: { x: -35, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-5', team: 'teamA', number: 5, name: 'Konaté', role: 'CB', position: { x: -35, y: 0, z: -8 }, rotation: 0 },
      { id: 'teamA-3', team: 'teamA', number: 3, name: 'Robertson', role: 'LB', position: { x: -30, y: 0, z: -22 }, rotation: 0 },
      { id: 'teamA-6', team: 'teamA', number: 6, name: 'Fabinho', role: 'CDM', position: { x: -20, y: 0, z: 0 }, rotation: 0 },
      { id: 'teamA-8', team: 'teamA', number: 8, name: 'Szoboszlai', role: 'CM', position: { x: -10, y: 0, z: 12 }, rotation: 0 },
      { id: 'teamA-10', team: 'teamA', number: 10, name: 'Mac Allister', role: 'CM', position: { x: -10, y: 0, z: -12 }, rotation: 0 },
      { id: 'teamA-11', team: 'teamA', number: 11, name: 'Salah', role: 'RW', position: { x: 12, y: 0, z: 22 }, rotation: 0 },
      { id: 'teamA-9', team: 'teamA', number: 9, name: 'Núñez', role: 'ST', position: { x: 18, y: 0, z: 0 }, rotation: 0 },
      { id: 'teamA-7', team: 'teamA', number: 7, name: 'Díaz', role: 'LW', position: { x: 12, y: 0, z: -22 }, rotation: 0 }
    );
  } else if (formationA === '4-4-2') {
    players.push(
      { id: 'teamA-2', team: 'teamA', number: 2, name: 'Right Back', role: 'RB', position: { x: -30, y: 0, z: 22 }, rotation: 0 },
      { id: 'teamA-4', team: 'teamA', number: 4, name: 'Center Back 1', role: 'CB', position: { x: -35, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-5', team: 'teamA', number: 5, name: 'Center Back 2', role: 'CB', position: { x: -35, y: 0, z: -8 }, rotation: 0 },
      { id: 'teamA-3', team: 'teamA', number: 3, name: 'Left Back', role: 'LB', position: { x: -30, y: 0, z: -22 }, rotation: 0 },
      { id: 'teamA-7', team: 'teamA', number: 7, name: 'Right Mid', role: 'RM', position: { x: -10, y: 0, z: 22 }, rotation: 0 },
      { id: 'teamA-6', team: 'teamA', number: 6, name: 'Center Mid 1', role: 'CM', position: { x: -14, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-8', team: 'teamA', number: 8, name: 'Center Mid 2', role: 'CM', position: { x: -14, y: 0, z: -8 }, rotation: 0 },
      { id: 'teamA-11', team: 'teamA', number: 11, name: 'Left Mid', role: 'LM', position: { x: -10, y: 0, z: -22 }, rotation: 0 },
      { id: 'teamA-9', team: 'teamA', number: 9, name: 'Striker 1', role: 'ST', position: { x: 14, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-10', team: 'teamA', number: 10, name: 'Striker 2', role: 'ST', position: { x: 14, y: 0, z: -8 }, rotation: 0 }
    );
  } else if (formationA === '3-5-2') {
    players.push(
      { id: 'teamA-3', team: 'teamA', number: 3, name: 'Right CB', role: 'CB', position: { x: -34, y: 0, z: 15 }, rotation: 0 },
      { id: 'teamA-4', team: 'teamA', number: 4, name: 'Sweeper', role: 'CB', position: { x: -36, y: 0, z: 0 }, rotation: 0 },
      { id: 'teamA-5', team: 'teamA', number: 5, name: 'Left CB', role: 'CB', position: { x: -34, y: 0, z: -15 }, rotation: 0 },
      { id: 'teamA-2', team: 'teamA', number: 2, name: 'Right Wing-Back', role: 'RWB', position: { x: -18, y: 0, z: 24 }, rotation: 0 },
      { id: 'teamA-6', team: 'teamA', number: 6, name: 'Anchor Man', role: 'CDM', position: { x: -22, y: 0, z: 0 }, rotation: 0 },
      { id: 'teamA-8', team: 'teamA', number: 8, name: 'Right CM', role: 'CM', position: { x: -10, y: 0, z: 10 }, rotation: 0 },
      { id: 'teamA-10', team: 'teamA', number: 10, name: 'Left CM', role: 'CM', position: { x: -10, y: 0, z: -10 }, rotation: 0 },
      { id: 'teamA-11', team: 'teamA', number: 11, name: 'Left Wing-Back', role: 'LWB', position: { x: -18, y: 0, z: -24 }, rotation: 0 },
      { id: 'teamA-9', team: 'teamA', number: 9, name: 'Forward 1', role: 'ST', position: { x: 15, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-7', team: 'teamA', number: 7, name: 'Forward 2', role: 'ST', position: { x: 15, y: 0, z: -8 }, rotation: 0 }
    );
  } else {
    // 4-2-3-1
    players.push(
      { id: 'teamA-2', team: 'teamA', number: 2, name: 'Right Back', role: 'RB', position: { x: -30, y: 0, z: 22 }, rotation: 0 },
      { id: 'teamA-4', team: 'teamA', number: 4, name: 'Center Back', role: 'CB', position: { x: -35, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-5', team: 'teamA', number: 5, name: 'Center Back', role: 'CB', position: { x: -35, y: 0, z: -8 }, rotation: 0 },
      { id: 'teamA-3', team: 'teamA', number: 3, name: 'Left Back', role: 'LB', position: { x: -30, y: 0, z: -22 }, rotation: 0 },
      { id: 'teamA-6', team: 'teamA', number: 6, name: 'Def Mid 1', role: 'CDM', position: { x: -22, y: 0, z: 8 }, rotation: 0 },
      { id: 'teamA-8', team: 'teamA', number: 8, name: 'Def Mid 2', role: 'CDM', position: { x: -22, y: 0, z: -8 }, rotation: 0 },
      { id: 'teamA-7', team: 'teamA', number: 7, name: 'Right Wing', role: 'RW', position: { x: -4, y: 0, z: 20 }, rotation: 0 },
      { id: 'teamA-10', team: 'teamA', number: 10, name: 'Attacking Mid', role: 'CAM', position: { x: -6, y: 0, z: 0 }, rotation: 0 },
      { id: 'teamA-11', team: 'teamA', number: 11, name: 'Left Wing', role: 'LW', position: { x: -4, y: 0, z: -20 }, rotation: 0 },
      { id: 'teamA-9', team: 'teamA', number: 9, name: 'Striker', role: 'ST', position: { x: 16, y: 0, z: 0 }, rotation: 0 }
    );
  }

  // Team B (Blue, attacking left -X)
  // GK
  players.push({
    id: 'teamB-1',
    team: 'teamB',
    number: 1,
    name: 'Courtois',
    role: 'GK',
    position: { x: 48, y: 0, z: 0 },
    rotation: Math.PI,
    isGoalkeeper: true,
  });

  if (formationB === '4-4-2') {
    players.push(
      { id: 'teamB-2', team: 'teamB', number: 2, name: 'Carvajal', role: 'RB', position: { x: 30, y: 0, z: -22 }, rotation: Math.PI },
      { id: 'teamB-3', team: 'teamB', number: 3, name: 'Militão', role: 'CB', position: { x: 35, y: 0, z: -8 }, rotation: Math.PI },
      { id: 'teamB-4', team: 'teamB', number: 4, name: 'Rüdiger', role: 'CB', position: { x: 35, y: 0, z: 8 }, rotation: Math.PI },
      { id: 'teamB-5', team: 'teamB', number: 5, name: 'Mendy', role: 'LB', position: { x: 30, y: 0, z: 22 }, rotation: Math.PI },
      { id: 'teamB-11', team: 'teamB', number: 11, name: 'Rodrygo', role: 'RM', position: { x: 14, y: 0, z: -22 }, rotation: Math.PI },
      { id: 'teamB-8', team: 'teamB', number: 8, name: 'Valverde', role: 'CM', position: { x: 18, y: 0, z: -8 }, rotation: Math.PI },
      { id: 'teamB-14', team: 'teamB', number: 14, name: 'Tchouaméni', role: 'CM', position: { x: 18, y: 0, z: 8 }, rotation: Math.PI },
      { id: 'teamB-7', team: 'teamB', number: 7, name: 'Vinícius', role: 'LM', position: { x: 14, y: 0, z: 22 }, rotation: Math.PI },
      { id: 'teamB-5b', team: 'teamB', number: 5, name: 'Bellingham', role: 'CAM', position: { x: 2, y: 0, z: -7 }, rotation: Math.PI },
      { id: 'teamB-9', team: 'teamB', number: 9, name: 'Mbappé', role: 'ST', position: { x: 2, y: 0, z: 7 }, rotation: Math.PI }
    );
  } else {
    // 4-3-3 for Team B
    players.push(
      { id: 'teamB-2', team: 'teamB', number: 2, name: 'Right Back', role: 'RB', position: { x: 30, y: 0, z: -22 }, rotation: Math.PI },
      { id: 'teamB-3', team: 'teamB', number: 3, name: 'Center Back', role: 'CB', position: { x: 35, y: 0, z: -8 }, rotation: Math.PI },
      { id: 'teamB-4', team: 'teamB', number: 4, name: 'Center Back', role: 'CB', position: { x: 35, y: 0, z: 8 }, rotation: Math.PI },
      { id: 'teamB-5', team: 'teamB', number: 5, name: 'Left Back', role: 'LB', position: { x: 30, y: 0, z: 22 }, rotation: Math.PI },
      { id: 'teamB-6', team: 'teamB', number: 6, name: 'Def Mid', role: 'CDM', position: { x: 22, y: 0, z: 0 }, rotation: Math.PI },
      { id: 'teamB-8', team: 'teamB', number: 8, name: 'Center Mid', role: 'CM', position: { x: 12, y: 0, z: -12 }, rotation: Math.PI },
      { id: 'teamB-10', team: 'teamB', number: 10, name: 'Center Mid', role: 'CM', position: { x: 12, y: 0, z: 12 }, rotation: Math.PI },
      { id: 'teamB-7', team: 'teamB', number: 7, name: 'Right Wing', role: 'RW', position: { x: -8, y: 0, z: -20 }, rotation: Math.PI },
      { id: 'teamB-9', team: 'teamB', number: 9, name: 'Striker', role: 'ST', position: { x: -12, y: 0, z: 0 }, rotation: Math.PI },
      { id: 'teamB-11', team: 'teamB', number: 11, name: 'Left Wing', role: 'LW', position: { x: -8, y: 0, z: 20 }, rotation: Math.PI }
    );
  }

  return players;
}

export const INITIAL_STRATEGIES: Strategy[] = [
  {
    id: 'strategy-press-433',
    title: '4-3-3 High Press vs 4-4-2',
    description: 'Aggressive pressing in opponent half with blocked passing channels',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2,
    teamAName: 'Red Team (4-3-3)',
    teamBName: 'Blue Team (4-4-2)',
    teamAColor: '#EF4444',
    teamBColor: '#3B82F6',
    players: createFormationPlayers('4-3-3', '4-4-2'),
    ball: { position: { x: 2, y: 0.5, z: 7 } },
    markers: [
      { id: 'm-1', type: 'cone', color: '#F59E0B', position: { x: 15, y: 0, z: 12 }, label: 'Pressing Trap' },
      { id: 'm-2', type: 'cone', color: '#F59E0B', position: { x: 15, y: 0, z: -12 }, label: 'Pressing Trap' },
    ],
    arrows: [
      { id: 'a-1', from: { x: 2, y: 0.5, z: 7 }, to: { x: 12, y: 0.5, z: 22 }, color: '#FBBF24', type: 'pass' }
    ],
  },
  {
    id: 'strategy-counter-442',
    title: '4-4-2 Fast Transition & Counter',
    description: 'Compact low block transitioning into quick outlet balls to the flanks',
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 12,
    teamAName: 'Red Team',
    teamBName: 'Blue Team',
    teamAColor: '#DC2626',
    teamBColor: '#2563EB',
    players: createFormationPlayers('4-4-2', '4-3-3'),
    ball: { position: { x: 0, y: 0.5, z: 0 } },
    markers: [],
    arrows: [],
  },
  {
    id: 'strategy-attack-352',
    title: '3-5-2 Positional Overload',
    description: 'Wing-backs push high to generate numerical overload in the middle third',
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 5,
    teamAName: 'Red Team (3-5-2)',
    teamBName: 'Blue Team (4-4-2)',
    teamAColor: '#EA580C',
    teamBColor: '#0284C7',
    players: createFormationPlayers('3-5-2', '4-4-2'),
    ball: { position: { x: -10, y: 0.5, z: 12 } },
    markers: [],
    arrows: [],
  },
];

export const STORAGE_KEY = 'football_tactics_strategies_v2';
export const ACTIVE_STRATEGY_KEY = 'football_tactics_active_id';

export function loadStrategiesFromStorage(): Strategy[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading strategies from localStorage:', err);
  }
  return INITIAL_STRATEGIES;
}

export function saveStrategiesToStorage(strategies: Strategy[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
  } catch (err) {
    console.error('Error saving strategies to localStorage:', err);
  }
}

export type TeamId = 'teamA' | 'teamB';

export interface Player {
  id: string;
  team: TeamId;
  number: number;
  name: string;
  role: string;
  position: { x: number; y: number; z: number };
  rotation: number; // in radians or degrees (facing angle on the pitch)
  isGoalkeeper?: boolean;
}

export interface Ball {
  position: { x: number; y: number; z: number };
}

export interface TacticalMarker {
  id: string;
  type: 'cone' | 'marker' | 'flag';
  color: string;
  position: { x: number; y: number; z: number };
  label?: string;
}

export interface TacticalArrow {
  id: string;
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  color: string;
  type: 'pass' | 'run' | 'dribble';
}

export interface Strategy {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  description?: string;
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  players: Player[];
  ball: Ball;
  markers: TacticalMarker[];
  arrows: TacticalArrow[];
}

export type CameraPreset = 'top' | 'center_angled' | 'ball_angled' | 'goal_a' | 'goal_b';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: 'player' | 'ball' | 'field' | 'marker';
  targetId?: string;
  pitchCoords?: { x: number; z: number };
}

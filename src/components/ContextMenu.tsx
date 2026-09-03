import React, { useEffect, useRef } from 'react';
import { 
  ContextMenuState, 
  Player, 
  Ball, 
  TacticalMarker 
} from '../types';
import { 
  UserPlus, 
  CircleDot, 
  RotateCw, 
  Edit, 
  Trash2, 
  Compass, 
  Shuffle, 
  Target, 
  Flag,
  ArrowRight,
  Shield,
  X
} from 'lucide-react';

interface ContextMenuProps {
  menuState: ContextMenuState;
  players: Player[];
  ball: Ball;
  markers?: TacticalMarker[];
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  onClose: () => void;
  onPassToPlayer: (playerId: string) => void;
  onRotatePlayer: (playerId: string, angleDelta: number) => void;
  onFaceGoal: (playerId: string) => void;
  onSwitchPlayerTeam: (playerId: string) => void;
  onToggleGoalkeeper: (playerId: string) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  onMoveBallToCenter: () => void;
  onMoveBallToPoint: (x: number, z: number) => void;
  onPassToNearestPlayer: () => void;
  onShootGoal: (isLeft: boolean) => void;
  onAddPlayer: (team: 'teamA' | 'teamB', x: number, z: number) => void;
  onAddMarker: (x: number, z: number) => void;
  onDeleteMarker: (markerId: string) => void;
  onChangeMarkerColor?: (markerId: string, color: string) => void;
  onClearAllMarkers?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  menuState,
  players,
  ball,
  markers,
  teamAName,
  teamBName,
  teamAColor,
  teamBColor,
  onClose,
  onPassToPlayer,
  onRotatePlayer,
  onFaceGoal,
  onSwitchPlayerTeam,
  onToggleGoalkeeper,
  onEditPlayer,
  onDeletePlayer,
  onMoveBallToCenter,
  onMoveBallToPoint,
  onPassToNearestPlayer,
  onShootGoal,
  onAddPlayer,
  onAddMarker,
  onDeleteMarker,
  onChangeMarkerColor,
  onClearAllMarkers,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!menuState.isOpen) return null;

  // Clamp menu to stay within screen boundaries
  const menuWidth = 260;
  const menuHeight = 320;
  const left = Math.min(menuState.x, window.innerWidth - menuWidth - 16);
  const top = Math.min(menuState.y, window.innerHeight - menuHeight - 16);

  const activePlayer = menuState.targetType === 'player'
    ? players.find((p) => p.id === menuState.targetId)
    : null;

  const activeMarker = menuState.targetType === 'marker' && markers
    ? markers.find((m) => m.id === menuState.targetId)
    : null;

  return (
    <div
      ref={menuRef}
      id="context-menu-popover"
      style={{ left: Math.max(8, left), top: Math.max(8, top) }}
      className="fixed z-50 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 text-xs py-1 animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      {/* PLAYER CONTEXT MENU */}
      {menuState.targetType === 'player' && activePlayer && (
        <>
          <div className="px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner flex-shrink-0"
                style={{
                  backgroundColor: activePlayer.isGoalkeeper
                    ? '#eab308'
                    : activePlayer.team === 'teamA'
                    ? teamAColor
                    : teamBColor,
                }}
              >
                {activePlayer.number}
              </div>
              <div className="truncate">
                <div className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                  <span>{activePlayer.name}</span>
                  {activePlayer.isGoalkeeper && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded">GK</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activePlayer.team === 'teamA' ? teamAName : teamBName} • {activePlayer.role || 'Player'}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onPassToPlayer(activePlayer.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-emerald-600/20 hover:text-emerald-300 flex items-center gap-2.5 transition"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Pass ball to this player</span>
            </button>

            <button
              onClick={() => {
                onFaceGoal(activePlayer.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Face opponent goal</span>
            </button>

            <button
              onClick={() => {
                onRotatePlayer(activePlayer.id, Math.PI / 4);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <RotateCw className="w-4 h-4 text-slate-400" />
              <span>Rotate 45°</span>
            </button>

            <div className="my-1 border-t border-slate-800" />

            <button
              onClick={() => {
                onSwitchPlayerTeam(activePlayer.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <Shuffle className="w-4 h-4 text-indigo-400" />
              <span>Switch team ({activePlayer.team === 'teamA' ? 'To Blue' : 'To Red'})</span>
            </button>

            <button
              onClick={() => {
                onToggleGoalkeeper(activePlayer.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{activePlayer.isGoalkeeper ? 'Set as Outfield Player' : 'Set as Goalkeeper'}</span>
            </button>

            <button
              onClick={() => {
                onEditPlayer(activePlayer);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <Edit className="w-4 h-4 text-slate-300" />
              <span>Edit number & name...</span>
            </button>

            <div className="my-1 border-t border-slate-800" />

            <button
              onClick={() => {
                onDeletePlayer(activePlayer.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove player</span>
            </button>
          </div>
        </>
      )}

      {/* BALL CONTEXT MENU */}
      {menuState.targetType === 'ball' && (
        <>
          <div className="px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚽</span>
              <div>
                <div className="font-bold text-white text-sm">Match Ball</div>
                <div className="text-[11px] text-slate-400">
                  Position: X {ball.position.x.toFixed(1)}, Z {ball.position.z.toFixed(1)}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700/50">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onMoveBallToCenter();
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-emerald-600/20 hover:text-emerald-300 flex items-center gap-2.5 transition"
            >
              <CircleDot className="w-4 h-4 text-emerald-400" />
              <span>Move to center spot</span>
            </button>

            <button
              onClick={() => {
                onPassToNearestPlayer();
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Pass to nearest player</span>
            </button>

            <button
              onClick={() => {
                onShootGoal(true);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <ArrowRight className="w-4 h-4 text-rose-400 rotate-180" />
              <span>Shoot towards left goal</span>
            </button>

            <button
              onClick={() => {
                onShootGoal(false);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <ArrowRight className="w-4 h-4 text-sky-400" />
              <span>Shoot towards right goal</span>
            </button>
          </div>
        </>
      )}

      {/* FIELD CONTEXT MENU */}
      {menuState.targetType === 'field' && menuState.pitchCoords && (
        <>
          <div className="px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌿</span>
              <div>
                <div className="font-bold text-white text-sm">Pitch Area</div>
                <div className="text-[11px] text-slate-400">
                  Coordinates: X {menuState.pitchCoords.x.toFixed(1)}, Z {menuState.pitchCoords.z.toFixed(1)}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700/50">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onAddPlayer('teamA', menuState.pitchCoords!.x, menuState.pitchCoords!.z);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-rose-950/40 text-rose-300 flex items-center gap-2.5 transition"
            >
              <UserPlus className="w-4 h-4 text-rose-400" />
              <span>Add player ({teamAName})</span>
            </button>

            <button
              onClick={() => {
                onAddPlayer('teamB', menuState.pitchCoords!.x, menuState.pitchCoords!.z);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-sky-950/40 text-sky-300 flex items-center gap-2.5 transition"
            >
              <UserPlus className="w-4 h-4 text-sky-400" />
              <span>Add player ({teamBName})</span>
            </button>

            <div className="my-1 border-t border-slate-800" />

            <button
              onClick={() => {
                onMoveBallToPoint(menuState.pitchCoords!.x, menuState.pitchCoords!.z);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <CircleDot className="w-4 h-4 text-emerald-400" />
              <span>Move ball here</span>
            </button>

            <button
              onClick={() => {
                onAddMarker(menuState.pitchCoords!.x, menuState.pitchCoords!.z);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition"
            >
              <Flag className="w-4 h-4 text-amber-400" />
              <span>Place training cone</span>
            </button>
          </div>
        </>
      )}

      {/* TRAINING CONE / MARKER CONTEXT MENU */}
      {menuState.targetType === 'marker' && (
        <>
          <div className="px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white border shadow-inner flex-shrink-0"
                style={{
                  backgroundColor: activeMarker?.color || '#F59E0B',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Flag className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Training Cone</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {activeMarker?.position
                    ? `X: ${activeMarker.position.x.toFixed(1)}, Z: ${activeMarker.position.z.toFixed(1)}`
                    : 'Marker'}
                </div>
              </div>
            </div>
            <button
              id="close-marker-context-menu-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1">
            {/* Cone color selector */}
            <div className="px-3.5 py-2">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Cone Color
              </span>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Orange', hex: '#F97316' },
                  { name: 'Amber', hex: '#F59E0B' },
                  { name: 'Red', hex: '#EF4444' },
                  { name: 'Blue', hex: '#3B82F6' },
                  { name: 'Green', hex: '#10B981' },
                  { name: 'White', hex: '#FFFFFF' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    onClick={() => {
                      if (menuState.targetId && onChangeMarkerColor) {
                        onChangeMarkerColor(menuState.targetId, c.hex);
                      }
                      onClose();
                    }}
                    className={`w-5 h-5 rounded-full border transition transform hover:scale-115 shadow-sm ${
                      activeMarker?.color === c.hex
                        ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900 border-white'
                        : 'border-slate-600'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="my-1 border-t border-slate-800" />

            {/* Remove this cone */}
            <button
              id="delete-marker-btn"
              onClick={() => {
                if (menuState.targetId) {
                  onDeleteMarker(menuState.targetId);
                }
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 flex items-center gap-2.5 transition font-medium"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Remove cone</span>
            </button>

            {/* Remove all cones option */}
            {markers && markers.length > 1 && onClearAllMarkers && (
              <button
                id="clear-all-markers-btn"
                onClick={() => {
                  onClearAllMarkers();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-2.5 transition text-[11px]"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>Remove all cones ({markers.length})</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

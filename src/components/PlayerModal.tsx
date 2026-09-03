import React, { useState, useEffect } from 'react';
import { Player, TeamId } from '../types';
import { X, Check, Shield } from 'lucide-react';

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  onClose: () => void;
  onSave: (updated: Player) => void;
}

const ROLES = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  isOpen,
  teamAName,
  teamBName,
  teamAColor,
  teamBColor,
  onClose,
  onSave,
}) => {
  const [number, setNumber] = useState(1);
  const [name, setName] = useState('');
  const [role, setRole] = useState('CM');
  const [team, setTeam] = useState<TeamId>('teamA');
  const [isGoalkeeper, setIsGoalkeeper] = useState(false);

  useEffect(() => {
    if (player) {
      setNumber(player.number);
      setName(player.name);
      setRole(player.role || 'CM');
      setTeam(player.team);
      setIsGoalkeeper(!!player.isGoalkeeper);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...player,
      number: Number(number) || 1,
      name: name.trim() || `Player ${number}`,
      role,
      team,
      isGoalkeeper: isGoalkeeper || role === 'GK',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{
                backgroundColor: isGoalkeeper
                  ? '#eab308'
                  : team === 'teamA'
                  ? teamAColor
                  : teamBColor,
              }}
            >
              {number}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Player</h3>
              <p className="text-xs text-slate-400">Configure squad number, name, and position</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Team Switch */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Team</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTeam('teamA')}
                className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 border transition ${
                  team === 'teamA'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamAColor }} />
                <span>{teamAName}</span>
              </button>

              <button
                type="button"
                onClick={() => setTeam('teamB')}
                className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 border transition ${
                  team === 'teamB'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-300 ring-2 ring-sky-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamBColor }} />
                <span>{teamBName}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Number */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Squad Number (#)</label>
              <input
                type="number"
                min="1"
                max="99"
                value={number}
                onChange={(e) => setNumber(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            {/* Name */}
            <div className="col-span-2">
              <label className="block text-slate-400 font-semibold mb-1.5">Player Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Modrić"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Position / Role</label>
            <div className="grid grid-cols-4 gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (r === 'GK') setIsGoalkeeper(true);
                  }}
                  className={`py-1.5 px-2 rounded-md font-semibold text-center transition ${
                    role === r
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Goalkeeper toggle */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isGoalkeeper}
                onChange={(e) => {
                  setIsGoalkeeper(e.target.checked);
                  if (e.target.checked && role !== 'GK') setRole('GK');
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
              />
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Team Goalkeeper (distinct yellow kit)</span>
              </div>
            </label>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Save Player</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Palette, Sparkles, RefreshCw } from 'lucide-react';
import { Strategy } from '../types';

interface StrategyModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  currentStrategy?: Strategy;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    formationA?: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';
    formationB?: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';
    teamAName?: string;
    teamBName?: string;
    teamAColor?: string;
    teamBColor?: string;
    applyFormation?: boolean;
  }) => void;
}

const COLOR_PALETTE = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Emerald / Green
  '#F59E0B', // Amber / Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#FFFFFF', // White
  '#1E293B', // Dark Navy / Black
];

export const StrategyModal: React.FC<StrategyModalProps> = ({
  isOpen,
  mode,
  currentStrategy,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('New Strategy');
  const [description, setDescription] = useState('');
  const [formationA, setFormationA] = useState<'4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1'>('4-3-3');
  const [formationB, setFormationB] = useState<'4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1'>('4-4-2');
  const [teamAName, setTeamAName] = useState('Red Team');
  const [teamBName, setTeamBName] = useState('Blue Team');
  const [teamAColor, setTeamAColor] = useState('#EF4444');
  const [teamBColor, setTeamBColor] = useState('#3B82F6');
  const [resetFormationInEdit, setResetFormationInEdit] = useState(false);

  // Synchronize internal state whenever the modal opens or the strategy changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && currentStrategy) {
        setTitle(currentStrategy.title || '');
        setDescription(currentStrategy.description || '');
        setTeamAName(currentStrategy.teamAName || 'Red Team');
        setTeamBName(currentStrategy.teamBName || 'Blue Team');
        setTeamAColor(currentStrategy.teamAColor || '#EF4444');
        setTeamBColor(currentStrategy.teamBColor || '#3B82F6');
        setResetFormationInEdit(false);
      } else {
        setTitle('New Strategy');
        setDescription('');
        setFormationA('4-3-3');
        setFormationB('4-4-2');
        setTeamAName('Red Team');
        setTeamBName('Blue Team');
        setTeamAColor('#EF4444');
        setTeamBColor('#3B82F6');
        setResetFormationInEdit(false);
      }
    }
  }, [isOpen, mode, currentStrategy]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      formationA,
      formationB,
      teamAName: teamAName.trim() || 'Red Team',
      teamBName: teamBName.trim() || 'Blue Team',
      teamAColor,
      teamBColor,
      applyFormation: mode === 'create' || resetFormationInEdit,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/90 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-800/60 select-none">
          <div>
            <h3 className="font-bold text-white text-base">
              {mode === 'create' ? 'Create New Strategy' : 'Edit Strategy Details'}
            </h3>
            <p className="text-xs text-slate-400">
              {mode === 'create'
                ? 'Set title, team names, and opening formations'
                : 'Modify title, coaching instructions, team names and colors'}
            </p>
          </div>
          <button
            id="close-strategy-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Strategy Title *
            </label>
            <input
              id="strategy-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 4-3-3 High Pressing Trap"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>Coaching Notes & Instructions</span>
              <span className="text-[10px] text-slate-500 font-normal">Also synced with Coach's Notes</span>
            </label>
            <textarea
              id="strategy-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Build-up guidelines, pressing triggers, transitional movements..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none leading-relaxed"
            />
          </div>

          {/* Team Names and Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 border-t border-slate-800">
            {/* Team A */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-300 font-bold text-xs">Team A</label>
                <div 
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: teamAColor }}
                />
              </div>
              <input
                id="team-a-name-input"
                type="text"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                placeholder="Team A Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Kit Color:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTeamAColor(color)}
                      className={`w-5 h-5 rounded-full border transition transform hover:scale-110 ${
                        teamAColor === color ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900 border-white' : 'border-slate-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-300 font-bold text-xs">Team B</label>
                <div 
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: teamBColor }}
                />
              </div>
              <input
                id="team-b-name-input"
                type="text"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                placeholder="Team B Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Kit Color:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTeamBColor(color)}
                      className={`w-5 h-5 rounded-full border transition transform hover:scale-110 ${
                        teamBColor === color ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900 border-white' : 'border-slate-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formations (Mandatory for Create, Optional for Edit) */}
          {mode === 'create' ? (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Team A Formation ({teamAName})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormationA(fmt)}
                      className={`py-2 px-2 rounded-lg font-bold text-center border transition ${
                        formationA === fmt
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Team B Formation ({teamBName})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormationB(fmt)}
                      className={`py-2 px-2 rounded-lg font-bold text-center border transition ${
                        formationB === fmt
                          ? 'bg-sky-950/60 border-sky-500 text-sky-300 ring-1 ring-sky-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* In Edit Mode: Optional Formation Reset */
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white py-1">
                <input
                  type="checkbox"
                  checked={resetFormationInEdit}
                  onChange={(e) => setResetFormationInEdit(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reset & re-arrange players to new formations</span>
                </span>
              </label>

              {resetFormationInEdit && (
                <div className="space-y-3 pt-2 mt-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 animate-in fade-in">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Team A Formation
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setFormationA(fmt)}
                          className={`py-1.5 px-2 rounded-lg font-bold text-center border text-[11px] transition ${
                            formationA === fmt
                              ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Team B Formation
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setFormationB(fmt)}
                          className={`py-1.5 px-2 rounded-lg font-bold text-center border text-[11px] transition ${
                            formationB === fmt
                              ? 'bg-sky-950/60 border-sky-500 text-sky-300 ring-1 ring-sky-500/30'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 select-none">
            <button
              id="cancel-strategy-modal-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              id="submit-strategy-modal-btn"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold transition shadow-md"
            >
              {mode === 'create' ? <Plus className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              <span>{mode === 'create' ? 'Create Strategy' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

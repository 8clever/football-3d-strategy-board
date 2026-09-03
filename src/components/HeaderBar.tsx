import React from 'react';
import { 
  Plus, 
  Save, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  FolderOpen, 
  Sparkles,
  Shield,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { Strategy } from '../types';

interface HeaderBarProps {
  strategies: Strategy[];
  currentStrategy: Strategy;
  onSelectStrategy: (id: string) => void;
  onSaveStrategy: (updated?: Partial<Strategy>) => void;
  onNewStrategy: () => void;
  onDuplicateStrategy: () => void;
  onDeleteStrategy: () => void;
  onResetFormation: (formation: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1') => void;
  isDirty: boolean;
  onOpenRenameModal: () => void
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  strategies,
  currentStrategy,
  onSelectStrategy,
  onSaveStrategy,
  onNewStrategy,
  onDuplicateStrategy,
  onDeleteStrategy,
  onResetFormation,
  isDirty,
  onOpenRenameModal
}) => {
  const [showFormations, setShowFormations] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = () => {
    onSaveStrategy();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
      {/* Brand & Strategy Switcher */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 pr-3 border-r border-slate-700/80">
          <div className="w-9 h-9 rounded-xl">
            <img src="/favicon.svg" className="size-9" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
              Tactical 3D
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium leading-none">
              Football Tactical Board
            </p>
          </div>
        </div>

        {/* Strategy selector dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <FolderOpen className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <select
              id="strategy-selector"
              value={currentStrategy.id}
              onChange={(e) => onSelectStrategy(e.target.value)}
              className="bg-slate-800 text-slate-100 text-sm font-semibold pl-9 pr-8 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer max-w-[240px] sm:max-w-[320px] truncate"
            >
              {strategies.map((strat) => (
                <option key={strat.id} value={strat.id}>
                  {strat.title}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 pointer-events-none text-xs text-slate-400">▼</div>
          </div>

          <button
            id="rename-strategy-btn"
            onClick={onOpenRenameModal}
            title="Edit strategy title, notes, and team settings"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-xs font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            id="new-strategy-btn"
            onClick={onNewStrategy}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Strategy</span>
          </button>
        </div>
      </div>

      {/* Center / Right actions: Save, Formations, Duplication */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Formations Quick Loader */}
        <div className="relative">
          <button
            id="formations-dropdown-btn"
            onClick={() => setShowFormations(!showFormations)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>11v11 Formation</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {showFormations && (
            <div 
              className="absolute top-full mt-1.5 right-0 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs text-slate-200"
              onMouseLeave={() => setShowFormations(false)}
            >
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-700/60">
                Reset Formation:
              </div>
              {(['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    onResetFormation(fmt);
                    setShowFormations(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-600/20 hover:text-emerald-300 flex items-center justify-between transition"
                >
                  <span className="font-semibold">{fmt}</span>
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duplicate */}
        <button
          id="duplicate-strategy-btn"
          onClick={onDuplicateStrategy}
          title="Duplicate current strategy"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          id="delete-strategy-btn"
          onClick={onDeleteStrategy}
          title={strategies.length > 1 ? "Delete strategy" : "Reset to default strategy"}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Save button */}
        <button
          id="save-strategy-btn"
          onClick={handleSave}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow-md ${
            saveSuccess
              ? 'bg-emerald-500 text-white'
              : isDirty
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold animate-pulse'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isDirty ? 'Save *' : 'Save'}</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

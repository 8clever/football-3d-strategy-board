import React from 'react';
import { 
  Camera, 
  Layers, 
  Eye, 
  EyeOff, 
  Compass, 
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { CameraPreset } from '../types';

interface CameraToolbarProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  showNames: boolean;
  onToggleNames: () => void;
  showPassingLines: boolean;
  onTogglePassingLines: () => void;
  onResetView: () => void;
  onOpenHelp: () => void;
}

export const CameraToolbar: React.FC<CameraToolbarProps> = ({
  currentPreset,
  onSelectPreset,
  showNames,
  onToggleNames,
  showPassingLines,
  onTogglePassingLines,
  onResetView,
  onOpenHelp,
}) => {

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 shadow-2xl text-slate-200 select-none max-w-[95vw] overflow-x-auto">
      <div className="flex items-center gap-1 text-xs font-medium text-slate-400 pl-1 pr-2 border-r border-slate-700/80">
        <Camera className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Camera:</span>
      </div>

      {/* Preset 1: Top-down Perpendicular */}
      <button
        id="camera-top-btn"
        onClick={() => onSelectPreset('top')}
        title="Top-down perpendicular view (90°)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
          currentPreset === 'top'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
      >
        <span>📐 Top-down (90°)</span>
      </button>

      {/* Preset 2: Angled Center */}
      <button
        id="camera-center-angled-btn"
        onClick={() => onSelectPreset('center_angled')}
        title="Broadcast angled center pitch view"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
          currentPreset === 'center_angled'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
      >
        <span>🏟️ Angled (Center)</span>
      </button>

      {/* Preset 3: Angled Ball */}
      <button
        id="camera-ball-angled-btn"
        onClick={() => onSelectPreset('ball_angled')}
        title="Angled ball focus view"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
          currentPreset === 'ball_angled'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
      >
        <span>⚽ Angled (Ball)</span>
      </button>

      <div className="h-5 w-px bg-slate-700/80 mx-1" />

      {/* Toggle Player Names */}
      <button
        id="toggle-names-btn"
        onClick={onToggleNames}
        title={showNames ? 'Hide player names' : 'Show player names'}
        className={`p-1.5 rounded-lg transition ${
          showNames
            ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
        }`}
      >
        {showNames ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>

      {/* Toggle Passing Lines */}
      <button
        id="toggle-lines-btn"
        onClick={onTogglePassingLines}
        title={showPassingLines ? 'Hide passing lanes' : 'Show passing lanes'}
        className={`p-1.5 rounded-lg transition ${
          showPassingLines
            ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
        }`}
      >
        <Layers className="w-4 h-4" />
      </button>

      {/* Help button */}
      <button
        id="help-btn"
        onClick={onOpenHelp}
        title="Help & Project Information"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition text-xs font-semibold whitespace-nowrap"
      >
        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Help</span>
      </button>
    </div>
  );
};

import React from 'react';
import { 
  X, 
  ExternalLink, 
  Globe, 
  User, 
  MousePointer, 
  Move, 
  Rotate3d, 
  ZoomIn, 
  Layers, 
  Shield, 
  Camera, 
  Sparkles,
  Info
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-slate-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">Help & Project Information</h2>
              <p className="text-[11px] text-slate-400">3D Football Tactical Board</p>
            </div>
          </div>
          <button
            id="close-help-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar">
          {/* Developer Attribution Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-800/80 to-slate-900 border border-emerald-500/30 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] tracking-wide uppercase border border-emerald-500/30">
                    Free Tactical Tool
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pt-1">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Developed by Ivan Vitiaev</span>
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  Interactive 3D strategy and tactical board built for football coaches, managers, analysts, and passionate players.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-400">Creator Website & Portfolio:</span>
              <a
                id="developer-link"
                href="https://vitiaev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition group"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>vitiaev.com</span>
                <ExternalLink className="w-3 h-3 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Controls Guide */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-slate-300">
              <MousePointer className="w-3.5 h-3.5 text-sky-400" />
              <span>3D Board Controls</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Move className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Drag & Drop</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Left-click and drag any player or the ball to freely position them anywhere across the grass pitch.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Rotate3d className="w-3.5 h-3.5 text-sky-400" />
                  <span>Orbit & Pan</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Hold left-click on empty pitch to rotate 3D view. Hold right-click (or Shift + drag) to pan.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Context Menu</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click on any player, the ball, or empty turf to open tactical options (passes, rotations, roles, cones).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Camera Zoom</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Use the mouse wheel or trackpad pinch gestures to smoothly zoom in for detailed tactical moments.
                </p>
              </div>
            </div>
          </div>

          {/* Tactical Features Overview */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Features & Presets</span>
            </h4>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <Camera className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Camera Presets:</strong> Quickly toggle between 90° Top-Down Bird's Eye, Broadcast TV Angled Center, and dynamic Ball Focus.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Formations & Squads:</strong> Instant 11v11 squad setups for 4-3-3, 4-4-2, 3-5-2, and 4-2-3-1 with goalkeepers and custom jersey numbers.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Save & Duplicate:</strong> Keep multiple tactical scenarios, duplicate plays, and add coaching notes.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/40 flex items-center justify-between">
          <a
            href="https://vitiaev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-400 hover:text-emerald-400 transition flex items-center gap-1"
          >
            <span>vitiaev.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            id="help-modal-close-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

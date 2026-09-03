import React, { useState } from 'react';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Trash2,
  BookOpen
} from 'lucide-react';

interface CoachNotesProps {
  notes: string;
  strategyTitle: string;
  onChange: (notes: string) => void;
  onEditStrategy?: () => void;
}

const QUICK_PROMPTS = [
  '⚡ Pressing trigger: press on backward pass to fullback',
  '🛡️ Rest defense: keep 3+2 structure behind the ball',
  '🎯 Build-up: DM drops deep to create numerical overload',
  '🏃 Half-spaces: wingers pin fullbacks, 8s attack channels',
  '⚠️ Transition: counter-press aggressively for 5 seconds',
];

export const CoachNotes: React.FC<CoachNotesProps> = ({
  notes,
  strategyTitle,
  onChange,
  onEditStrategy,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);

  const handleCopy = () => {
    if (!notes.trim()) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertPrompt = (prompt: string) => {
    const trimmed = notes.trim();
    const newText = trimmed ? `${trimmed}\n• ${prompt}` : `• ${prompt}`;
    onChange(newText);
    setShowQuickPrompts(false);
  };

  const handleClear = () => {
    if (window.confirm('Clear all notes for this strategy?')) {
      onChange('');
    }
  };

  // If collapsed, render a sleek floating toggle button on the left
  if (isCollapsed) {
    return (
      <div className="absolute top-16 left-4 z-20">
        <button
          id="expand-coach-notes-btn"
          onClick={() => setIsCollapsed(false)}
          title="Open Coach's Notes"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 shadow-2xl text-slate-200 hover:text-white transition group"
        >
          <div className="relative flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            {notes.trim().length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <span className="text-xs font-semibold">Coach's Notes</span>
          {notes.trim().length > 0 && (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full border border-slate-700">
              {notes.split('\n').filter(Boolean).length}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  // Expanded Window
  return (
    <div 
      className="absolute top-16 left-4 z-20 w-80 sm:w-88 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col text-slate-200 text-xs overflow-hidden select-text"
      style={{ maxHeight: 'calc(100vh - 12rem)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/60 select-none">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="font-bold text-white text-xs leading-tight flex items-center gap-1.5">
              <span>Coach's Notes</span>
              {notes.trim().length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-[170px]">
                {strategyTitle}
              </span>
              {onEditStrategy && (
                <button
                  id="coach-notes-edit-strategy-btn"
                  onClick={onEditStrategy}
                  title="Edit strategy title and settings"
                  className="text-slate-500 hover:text-emerald-400 transition"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle View Mode (Presentation / Edit) */}
          <button
            id="toggle-notes-mode-btn"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            title={isPreviewMode ? 'Switch to Edit mode' : 'Presentation view (clean reading)'}
            className={`p-1.5 rounded-lg border transition ${
              isPreviewMode 
                ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Button */}
          <button
            id="copy-notes-btn"
            onClick={handleCopy}
            disabled={!notes.trim()}
            title={copied ? 'Copied to clipboard!' : 'Copy notes'}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Collapse Window Button */}
          <button
            id="collapse-coach-notes-btn"
            onClick={() => setIsCollapsed(true)}
            title="Collapse notes"
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition ml-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col min-h-[160px] max-h-[360px]">
        {isPreviewMode ? (
          /* Presentation / Clean Reading View */
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-medium pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Presentation Mode</span>
              </span>
              <button
                onClick={() => setIsPreviewMode(false)}
                className="text-slate-400 hover:text-white underline text-[10px]"
              >
                Edit
              </button>
            </div>

            {notes.trim() ? (
              <div className="space-y-1.5 text-slate-200 leading-relaxed font-sans text-xs pt-1">
                {notes.split('\n').map((line, idx) => {
                  const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
                  return (
                    <div 
                      key={idx} 
                      className={`transition ${
                        isBullet 
                          ? 'pl-2 text-slate-100 font-medium bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/40 my-1' 
                          : line.trim() ? 'text-slate-300' : 'h-2'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-center text-slate-500 gap-1.5">
                <FileText className="w-6 h-6 stroke-[1.5] text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">No notes written yet</p>
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="mt-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold transition"
                >
                  Write coaching instructions
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Editor View */
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              id="coach-notes-textarea"
              value={notes}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Jot down tactical thoughts, key instructions, pressing cues, or half-time notes..."
              rows={8}
              className="w-full flex-1 bg-slate-950/60 border border-slate-700/60 rounded-xl p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none font-sans leading-relaxed"
            />

            {/* Quick Tactical Cue Chips */}
            {showQuickPrompts && (
              <div className="p-2 bg-slate-800/90 border border-slate-700 rounded-xl space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Quick Tactical Cues</span>
                  </span>
                  <button 
                    onClick={() => setShowQuickPrompts(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleInsertPrompt(prompt)}
                      className="w-full text-left px-2 py-1 rounded bg-slate-900/60 hover:bg-emerald-950/40 hover:text-emerald-300 text-[11px] text-slate-300 border border-slate-700/40 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="px-3.5 py-2 bg-slate-800/60 border-t border-slate-700/60 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          {!isPreviewMode && (
            <button
              id="quick-cues-btn"
              onClick={() => setShowQuickPrompts(!showQuickPrompts)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-medium border border-slate-700/60 transition"
            >
              <Plus className="w-3 h-3" />
              <span>Tactical Cues</span>
            </button>
          )}

          {notes.trim().length > 0 && !isPreviewMode && (
            <button
              onClick={handleClear}
              title="Clear notes"
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <span>Auto-saved with strategy</span>
        </div>
      </div>
    </div>
  );
};

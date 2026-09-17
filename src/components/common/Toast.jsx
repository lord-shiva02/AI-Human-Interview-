import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = "info", onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borders = {
    success: "border-emerald-500/30 bg-emerald-950/80 text-emerald-200",
    warning: "border-amber-500/30 bg-amber-950/80 text-amber-200",
    error: "border-rose-500/30 bg-rose-950/80 text-rose-200",
    info: "border-cyan-500/30 bg-slate-900/90 text-cyan-200"
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${borders[type] || borders.info} animate-slideUp`}>
      {icons[type] || icons.info}
      <span className="text-xs font-semibold">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

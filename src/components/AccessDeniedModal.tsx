import React from 'react';

interface AccessDeniedModalProps {
  error: {
    code: string;
    title: string;
    message: string;
    email?: string;
  };
  onClose: () => void;
  onRetryGoogle: () => void;
  onOpenSandbox: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  error,
  onClose,
  onRetryGoogle,
  onOpenSandbox,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-labelledby="security-alert-title"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Institutional Alert Header */}
        <div className="bg-red-50/80 border-b border-red-100 p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">shield_lock</span>
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 bg-red-100/80 px-2 py-0.5 rounded">
              AICTE / IMSEC Security Enforcement
            </span>
            <h2 id="security-alert-title" className="text-lg font-bold text-slate-900 mt-1">
              {error.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Code: <span className="font-mono font-semibold text-red-700">{error.code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Dismiss"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error.email && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Attempted Account:</span>
              <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                {error.email}
              </span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Institutional Boundary Policy:</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              {error.message}
            </p>
            <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1 pt-1">
              <li>Only verified accounts ending strictly in <strong className="font-mono text-slate-900">@imsec.ac.in</strong> are authorized.</li>
              <li>Personal email providers (<span className="font-mono">@gmail.com</span>, <span className="font-mono">@yahoo.com</span>) and lookalike domains are rejected.</li>
              <li>Google accounts with unconfirmed or unverified emails are not permitted.</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onOpenSandbox}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">science</span>
            <span>Explore Sandbox Demo</span>
          </button>

          <button
            onClick={onRetryGoogle}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4338ca] text-white text-xs font-bold hover:bg-[#2a14b4] shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign In with @imsec.ac.in Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

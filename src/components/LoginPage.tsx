import React from 'react';

interface LoginPageProps {
  onGoogleLogin: () => void;
  loading: boolean;
  error: {
    code: string;
    title: string;
    message: string;
    email?: string;
  } | null;
  onClearError: () => void;
  onDemoPreview?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onGoogleLogin,
  loading,
  error,
  onClearError,
  onDemoPreview,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col justify-between antialiased selection:bg-[#4338ca] selection:text-white">
      {/* Top Simple Header */}
      <header className="w-full border-b border-[#c7c4d7]/40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4338ca] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#2a14b4] tracking-tight leading-tight">
              CampusVoice
            </h1>
            <p className="text-xs text-[#464554] font-medium leading-none">
              IMS Engineering College · Student Redressal & Resolution Portal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#464554] bg-[#eff4ff] px-3 py-1.5 rounded-full border border-[#c7c4d7]/40">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>Official Portal · AY 2024–25</span>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-[#c7c4d7]/60 shadow-xl shadow-indigo-900/5 p-8 transition-all">
            {/* Institution Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#4338ca] mb-3 shadow-inner">
                <span className="material-symbols-outlined text-[32px]">verified_user</span>
              </div>
              <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
                Sign In to CampusVoice
              </h2>
              <p className="text-xs text-[#464554] mt-1.5 leading-relaxed">
                Log in using your authorized institutional Google account to access grievances, status tracking, and proctorial resolutions.
              </p>
            </div>

            {/* Error Banner if domain or verification failed */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0 mt-0.5">
                    error
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-950 mb-0.5">{error.title}</h4>
                    <p className="text-red-800 leading-relaxed">{error.message}</p>
                    {error.email && (
                      <p className="mt-1 font-mono text-[11px] text-red-700 bg-red-100/60 px-2 py-0.5 rounded w-fit">
                        Attempted: {error.email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClearError}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Dismiss"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            )}

            {/* Authorized Domain Notice */}
            <div className="mb-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#16a34a] text-[20px] shrink-0">
                check_circle
              </span>
              <div className="text-xs text-[#166534]">
                <span className="font-semibold">Authorized Domain:</span> Only accounts ending in{' '}
                <span className="font-mono font-bold bg-[#dcfce7] px-1.5 py-0.5 rounded text-[#14532d]">
                  @imsec.ac.in
                </span>{' '}
                are permitted.
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="space-y-4">
              <button
                onClick={onGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] active:bg-[#2a14b4] text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all duration-150 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Authenticating with Google...</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <span>Sign In with @imsec.ac.in Account</span>
                  </>
                )}
              </button>

              {/* Offline Demo preview option */}
              {onDemoPreview && (
                <div className="pt-2 text-center">
                  <button
                    onClick={onDemoPreview}
                    type="button"
                    className="text-xs text-[#777586] hover:text-[#4338ca] transition-colors font-medium underline underline-offset-4 cursor-pointer"
                  >
                    Or explore demo preview without login
                  </button>
                </div>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="mt-8 pt-6 border-t border-[#c7c4d7]/40 flex items-center justify-between text-[11px] text-[#777586]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#10b981]">
                  lock
                </span>
                256-Bit SSL Encrypted
              </span>
              <span>AICTE Norms Compliant</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#c7c4d7]/40 py-4 px-6 text-center text-xs text-[#777586]">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto gap-2">
          <span>
            © 2024–2025 IMS Engineering College, Ghaziabad. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#464554]">
              <span className="material-symbols-outlined text-[14px]">call</span>
              Proctorial Cell: 0120-2780281
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

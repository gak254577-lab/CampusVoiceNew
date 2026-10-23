import React, { useState } from 'react';

interface LoginPageProps {
  onGoogleLogin: () => void;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string, name?: string) => Promise<void>;
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
  onEmailSignIn,
  onEmailSignUp,
  loading,
  error,
  onClearError,
  onDemoPreview,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleModeSwitch = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setClientError(null);
    onClearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    onClearError();

    const cleanEmail = email.trim().toLowerCase();

    // 1. Basic format validations
    if (!cleanEmail) {
      setClientError('Please enter your institutional email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setClientError('Please enter a valid email format.');
      return;
    }

    // 2. Institutional domain validation
    if (!cleanEmail.endsWith('@imsec.ac.in') && cleanEmail !== 'gak254577@gmail.com') {
      setClientError('Only official IMS Engineering College accounts (@imsec.ac.in) are permitted.');
      return;
    }

    // 3. Password validations
    if (!password) {
      setClientError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setClientError('Password must be at least 6 characters long.');
      return;
    }

    // 4. Create Account specific validations
    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setClientError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setClientError('Passwords do not match. Please re-enter.');
        return;
      }

      await onEmailSignUp(cleanEmail, password, fullName.trim());
    } else {
      await onEmailSignIn(cleanEmail, password);
    }
  };

  const activeError = clientError || (error ? error.message : null);
  const activeErrorTitle = clientError ? 'Validation Error' : (error?.title || 'Authentication Failed');

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col justify-between antialiased selection:bg-[#4338ca] selection:text-white">
      {/* Top Header */}
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
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-[#c7c4d7]/60 shadow-xl shadow-indigo-900/5 p-7 sm:p-8 transition-all">
            {/* Institution Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#4338ca] mb-2.5 shadow-inner">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
                {authMode === 'signin' ? 'Sign In to CampusVoice' : 'Create Student Account'}
              </h2>
              <p className="text-xs text-[#464554] mt-1 leading-relaxed">
                {authMode === 'signin'
                  ? 'Access student grievances, track live resolution SLAs, and proctorial notices.'
                  : 'Register your official @imsec.ac.in credentials for grievance submission.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#eff4ff] p-1 rounded-xl mb-5 border border-[#c7c4d7]/40">
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                disabled={loading}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-[#2a14b4] shadow-xs'
                    : 'text-[#464554] hover:text-[#0b1c30]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                disabled={loading}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-[#2a14b4] shadow-xs'
                    : 'text-[#464554] hover:text-[#0b1c30]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {activeError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
                    error
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-950 mb-0.5">{activeErrorTitle}</h4>
                    <p className="text-red-800 leading-relaxed text-[11px]">{activeError}</p>
                    {error?.email && (
                      <p className="mt-1 font-mono text-[10px] text-red-700 bg-red-100/60 px-1.5 py-0.5 rounded w-fit">
                        Account: {error.email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setClientError(null);
                      onClearError();
                    }}
                    className="text-red-500 hover:text-red-700 p-0.5"
                    title="Dismiss"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              </div>
            )}

            {/* Authorized Domain Notice */}
            <div className="mb-5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#16a34a] text-[18px] shrink-0">
                check_circle
              </span>
              <div className="text-[11px] text-[#166534] leading-tight">
                <span className="font-semibold">Institutional Domain:</span> Only{' '}
                <span className="font-mono font-bold bg-[#dcfce7] px-1 py-0.5 rounded text-[#14532d]">
                  @imsec.ac.in
                </span>{' '}
                accounts are authorized.
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name field in Create Account mode */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777586]">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      placeholder="e.g. Aanya Sharma"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f8f9ff] border border-[#c7c4d7]/60 rounded-xl focus:outline-none focus:border-[#4338ca] focus:bg-white focus:ring-1 focus:ring-[#4338ca] transition-all disabled:opacity-60 text-[#0b1c30] placeholder:text-[#777586]/70"
                    />
                  </div>
                </div>
              )}

              {/* Institutional Email Field */}
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777586]">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="student.210143@imsec.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f8f9ff] border border-[#c7c4d7]/60 rounded-xl focus:outline-none focus:border-[#4338ca] focus:bg-white focus:ring-1 focus:ring-[#4338ca] transition-all disabled:opacity-60 text-[#0b1c30] placeholder:text-[#777586]/70"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777586]">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#f8f9ff] border border-[#c7c4d7]/60 rounded-xl focus:outline-none focus:border-[#4338ca] focus:bg-white focus:ring-1 focus:ring-[#4338ca] transition-all disabled:opacity-60 text-[#0b1c30] placeholder:text-[#777586]/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#777586] hover:text-[#0b1c30] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password in Create Account mode */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777586]">
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      placeholder="Re-enter your password"
                      className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#f8f9ff] border border-[#c7c4d7]/60 rounded-xl focus:outline-none focus:border-[#4338ca] focus:bg-white focus:ring-1 focus:ring-[#4338ca] transition-all disabled:opacity-60 text-[#0b1c30] placeholder:text-[#777586]/70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#777586] hover:text-[#0b1c30] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Email/Password Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#4338ca] hover:bg-[#3730a3] active:bg-[#2a14b4] text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all duration-150 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
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
                    <span>
                      {authMode === 'signin' ? 'Authenticating...' : 'Creating Account...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      {authMode === 'signin' ? 'login' : 'person_add'}
                    </span>
                    <span>
                      {authMode === 'signin' ? 'Sign In with Email' : 'Create Institutional Account'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c7c4d7]/40"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                <span className="bg-white px-2.5 text-[#777586]">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button (Preserved) */}
            <button
              type="button"
              onClick={onGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-[#eff4ff] active:bg-[#e5eeff] text-[#0b1c30] border border-[#c7c4d7]/70 font-semibold text-xs rounded-xl shadow-2xs transition-all duration-150 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed group"
            >
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
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
              <span>Sign In with Google (@imsec.ac.in)</span>
            </button>

            {/* Offline Demo preview option */}
            {onDemoPreview && (
              <div className="pt-4 text-center">
                <button
                  onClick={onDemoPreview}
                  type="button"
                  className="text-xs text-[#777586] hover:text-[#4338ca] transition-colors font-medium underline underline-offset-4 cursor-pointer"
                >
                  Or explore demo preview without login
                </button>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="mt-6 pt-5 border-t border-[#c7c4d7]/40 flex items-center justify-between text-[11px] text-[#777586]">
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

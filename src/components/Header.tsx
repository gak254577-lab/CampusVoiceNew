import React from 'react';
import { UserProfile, PushNotificationMessage } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
  notifications: PushNotificationMessage[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  onClearNotifications: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onGoogleLogin: () => void;
  sessionMode: 'authenticated' | 'demo' | 'unauthenticated';
  isForcedAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  notifications,
  showNotifications,
  setShowNotifications,
  onClearNotifications,
  onOpenProfile,
  onLogout,
  onGoogleLogin,
  sessionMode,
  isForcedAdmin,
  onToggleAdmin,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length || (notifications.length > 0 ? notifications.length : 3);

  const studentName = profile?.name || 'Aanya Sharma';
  const rollNumber = profile?.rollNumber || (profile?.role === 'admin' ? 'EMP-NODAL-088' : '2101430100042');
  const avatarUrl = profile?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCFTI8WrD3h4N_jIV1xAZB1YSbIZUebduORRKOf9MeiPWBfAl9SWIIcPPOQRN9XTNyVMX_m77qlbRaXr2vYhUXkyllWUCbgK6bfaHP01RV0S57PB4GW8xMZod9d_iZguTXnVMcCbE2h1OD0rEnglZg3Ch5LfPdCq9oNYMqk9cogJsLvuay_JWtYSdbyliuBOypIttS80rkcKAJFzLySz5KckR9g5TQ49K-pEm2bCtKProEbkzZxdv';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#ffffff] z-40 border-b border-[#c7c4d7]/50 shadow-xs">
      <div className="w-full h-16 px-4 flex items-center justify-between">
        {/* Logo and institutional title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#4338ca] text-white flex items-center justify-center font-bold text-base shadow-sm">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
            <div className="flex flex-col border-l border-[#c7c4d7]/40 pl-3 ml-1">
              <span className="font-bold text-base text-[#2a14b4] tracking-tight leading-tight">
                CampusVoice
              </span>
              <span className="text-[11px] text-[#464554] font-medium tracking-normal leading-tight hidden sm:inline">
                IMSEC Student Redressal &amp; Resolution Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right utility items */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Verified badge for authenticated users */}
          {sessionMode === 'authenticated' && profile?.role === 'admin' && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4338ca] text-white uppercase tracking-wider">
              Staff
            </span>
          )}

          {/* Proctorial Hotline */}
          <div className="hidden xl:flex items-center gap-1.5 bg-[#ffdad6]/40 text-[#93000a] border border-[#ba1a1a]/20 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">phone_in_talk</span>
            <span className="font-semibold text-xs font-mono">0120-2780281</span>
            <span className="text-xs text-[#464554]/80 border-l border-[#c7c4d7]/40 pl-2">Proctorial Office</span>
          </div>

          {/* Academic Semester Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#dce9ff] px-3 py-1 rounded-lg border border-[#c7c4d7]/40">
            <span className="material-symbols-outlined text-[16px] text-[#2a14b4]">calendar_today</span>
            <span className="text-xs text-[#0b1c30] font-semibold">AY 2024–25 (Odd Sem)</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center p-2 text-[#464554] hover:text-[#0b1c30] cursor-pointer rounded-lg hover:bg-[#e5eeff] transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] leading-none flex items-center justify-center rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#c7c4d7]/60 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e5eeff]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0b1c30]">Notifications</span>
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-[#2a14b4] hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-xs text-[#464554]">
                      <p className="font-medium text-[#0b1c30]">Wi-Fi #CV-2024-089 Resolved</p>
                      <p className="text-[11px] mt-0.5">Please test band in Lab 204 and certify closure.</p>
                      <span className="text-[10px] text-[#777586] font-mono mt-1 block">34 hours left before auto-closure</span>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-[#eff4ff] text-xs">
                        <div className="font-semibold text-[#0b1c30]">{n.title}</div>
                        <div className="text-[11px] text-[#464554] mt-0.5">{n.body}</div>
                        <div className="text-[10px] text-[#777586] font-mono mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile & Quick Actions */}
          {profile && (
            <div className="flex items-center gap-2.5 border-l border-[#c7c4d7]/40 pl-3">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#0b1c30] group-hover:text-[#2a14b4] transition-colors">
                    {studentName}
                  </span>
                  <span className="text-[11px] font-mono text-[#464554] tracking-tight">
                    {rollNumber}
                  </span>
                </div>
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-[#c7c4d7]/60"
                  src={avatarUrl}
                />
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-[#777586] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors"
                title={sessionMode === 'demo' ? "Exit Sandbox" : "Sign Out"}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

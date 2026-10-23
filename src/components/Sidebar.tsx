import React from 'react';

export type NavTab = 'dashboard' | 'submit-grievance' | 'my-tickets' | 'campus-insights' | 'student-profile' | 'staff-resolution-portal';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  activeTicketsCount?: number;
  isStaff?: boolean;
  onRestrictedAccess?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeTicketsCount = 2,
  isStaff = false,
  onRestrictedAccess,
}) => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white z-30 border-r border-[#c7c4d7]/50 flex flex-col justify-between py-4 select-none">
      <div className="flex flex-col gap-1">
        {/* Academic Redressal Header */}
        <div className="px-4 mb-2">
          <span className="text-[11px] text-[#464554] uppercase tracking-wider font-bold">
            Academic Redressal
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-2">
          {/* Dashboard */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left text-sm font-medium ${
              currentTab === 'dashboard'
                ? 'bg-[#4338ca] text-white font-semibold shadow-xs'
                : 'text-[#464554] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span>Dashboard</span>
          </button>

          {/* Submit Grievance */}
          <button
            onClick={() => setCurrentTab('submit-grievance')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left text-sm font-medium ${
              currentTab === 'submit-grievance'
                ? 'bg-[#4338ca] text-white font-semibold shadow-xs'
                : 'text-[#464554] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">post_add</span>
            <span>Submit Grievance</span>
          </button>

          {/* My Tickets */}
          <button
            onClick={() => setCurrentTab('my-tickets')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors text-left text-sm font-medium ${
              currentTab === 'my-tickets'
                ? 'bg-[#4338ca] text-white font-semibold shadow-xs'
                : 'text-[#464554] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              <span>My Tickets</span>
            </div>
            <span
              className={`font-mono text-[11px] px-2 py-0.5 rounded-full border ${
                currentTab === 'my-tickets'
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-[#d3e4fe] text-[#0b1c30] border-[#c7c4d7]/50'
              }`}
            >
              {activeTicketsCount} Active
            </span>
          </button>

          {/* Campus Insights */}
          <button
            onClick={() => setCurrentTab('campus-insights')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left text-sm font-medium ${
              currentTab === 'campus-insights'
                ? 'bg-[#4338ca] text-white font-semibold shadow-xs'
                : 'text-[#464554] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span>Campus Insights</span>
          </button>

          {/* Student Profile */}
          <button
            onClick={() => setCurrentTab('student-profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left text-sm font-medium ${
              currentTab === 'student-profile'
                ? 'bg-[#4338ca] text-white font-semibold shadow-xs'
                : 'text-[#464554] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">badge</span>
            <span>Student Profile</span>
          </button>
        </nav>
      </div>

      {/* Administration & Statutory Compliance */}
      <div className="px-2 border-t border-[#c7c4d7]/40 pt-3">
        <div className="px-3 mb-2">
          <span className="text-[11px] text-[#464554] uppercase tracking-wider font-bold">
            Administration
          </span>
        </div>

        <button
          onClick={() => {
            if (isStaff) {
              setCurrentTab('staff-resolution-portal');
            } else if (onRestrictedAccess) {
              onRestrictedAccess();
            } else {
              alert('Access Restricted: Staff Resolution Portal requires authorized institutional credentials.');
            }
          }}
          className={`w-full flex flex-col gap-1 px-3.5 py-2.5 rounded-lg transition-colors border text-left ${
            currentTab === 'staff-resolution-portal'
              ? 'bg-[#4338ca] text-white border-[#4338ca] shadow-xs'
              : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] border-[#c7c4d7]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold ${
                currentTab === 'staff-resolution-portal' ? 'text-white' : 'text-[#2a14b4]'
              }`}
            >
              Staff Resolution Portal
            </span>
            <span
              className={`material-symbols-outlined text-[16px] ${
                currentTab === 'staff-resolution-portal' ? 'text-white' : 'text-[#2a14b4]'
              }`}
            >
              {isStaff ? 'admin_panel_settings' : 'lock'}
            </span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded inline-block w-fit font-bold border ${
              currentTab === 'staff-resolution-portal'
                ? 'bg-white/20 text-white border-white/30'
                : isStaff
                ? 'text-[#005c54] bg-[#005c54]/10 border-[#005c54]/20'
                : 'text-amber-800 bg-amber-50 border-amber-200'
            }`}
          >
            {isStaff ? 'Authorized Nodal Officer' : 'Requires Staff Role'}
          </span>
        </button>

        {/* Statutory Compliance Footer */}
        <div className="mt-4 px-3">
          <div className="flex items-center justify-between text-[#464554]">
            <span className="text-[11px] font-semibold">Statutory Compliance</span>
            <span className="material-symbols-outlined text-[16px] text-[#005c54]">
              verified_user
            </span>
          </div>
          <span className="text-[10px] text-[#777586] block mt-0.5 font-mono">
            AICTE Regulation 2019/Sec-4
          </span>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';

interface RedressalSopModalProps {
  onClose: () => void;
}

export const RedressalSopModal: React.FC<RedressalSopModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#c7c4d7]/60 overflow-hidden flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#eff4ff] p-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4338ca] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b1c30]">
                IMSEC Student Grievance Redressal Charter &amp; SLAs
              </h2>
              <span className="text-xs text-[#464554]">
                Statutory AICTE Regulations 2019 • Standing Order VII
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777586] hover:text-[#0b1c30] hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* SOP Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-[#0b1c30] leading-relaxed">
          {/* Section 1 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-[#2a14b4] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              1. Statutory Mandate &amp; Confidentiality Guarantee
            </h3>
            <p className="text-[#464554]">
              CampusVoice operates under the strict procedural framework defined by the All India Council for Technical Education (AICTE) Grievance Redressal Mechanism Regulations. Every submitted docket receives an immutable timestamp and cryptographic ledger hash. Under no circumstances may any student be subject to victimization, academic reprisal, or administrative discrimination for exercising redressal rights.
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-[#2a14b4] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">timer</span>
              2. Three-Tier Escalation SLA Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#2a14b4] block">Stage 1: Nodal Cell</span>
                <strong className="text-sm font-bold text-[#0b1c30] block mt-0.5">Within 48 Hours</strong>
                <span className="text-[11px] text-[#464554] mt-1 block">
                  Department faculty in-charge / estate supervisor immediate dispatch.
                </span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#2a14b4] block">Stage 2: Head of Dept</span>
                <strong className="text-sm font-bold text-[#0b1c30] block mt-0.5">Within 5 Days</strong>
                <span className="text-[11px] text-[#464554] mt-1 block">
                  Intervention by Academic Head and infrastructure fund sanctioning.
                </span>
              </div>
              <div className="p-3 bg-[#ffdad6]/30 rounded-lg border border-[#ba1a1a]/20">
                <span className="text-[10px] uppercase font-bold text-[#ba1a1a] block">Stage 3: Proctorial</span>
                <strong className="text-sm font-bold text-[#ba1a1a] block mt-0.5">7+ Days Overdue</strong>
                <span className="text-[11px] text-[#93000a] mt-1 block">
                  Direct formal hearing before the College Ombudsman and Director.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-[#2a14b4] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              3. Mandatory Complainant Concurrence &amp; Verification
            </h3>
            <p className="text-[#464554]">
              A grievance is never deemed closed solely by maintenance personnel assertion. When a technician marks an issue as resolved, the complainant receives a 48-hour verification window to physically inspect the work, rate the quality of service, and provide concurrence. If unresolved, the ticket can be rejected with one-click escalation to the HOD office.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">phone_in_talk</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#0b1c30]">Proctorial Standing Emergency Hotline</span>
                <span className="text-[11px] text-[#464554]">Available 24x7 for urgent safety and hostel distress</span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-[#2a14b4]">0120-2780281</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#e2e8f0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#4338ca] hover:bg-[#2a14b4] text-white text-xs font-bold transition-all shadow-xs"
          >
            I Understand the Redressal Terms
          </button>
        </div>
      </div>
    </div>
  );
};

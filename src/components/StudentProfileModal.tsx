import React, { useState } from 'react';
import { UserProfile } from '../types';

interface StudentProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onSignOut: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  profile,
  onClose,
  onUpdateProfile,
  onSignOut,
}) => {
  const [name, setName] = useState(profile?.name || 'Aanya Sharma');
  const [rollNumber, setRollNumber] = useState(profile?.rollNumber || '2101430100042');
  const [branch, setBranch] = useState(profile?.branch || 'Computer Science');
  const [year, setYear] = useState(profile?.year || '4th Year');
  const [hostelBlock, setHostelBlock] = useState(profile?.hostelBlock || 'Block C (Girls)');
  const [phone, setPhone] = useState(profile?.phone || '0120-2780281');
  const [peerMaskingDefault, setPeerMaskingDefault] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name,
        rollNumber,
        branch,
        year,
        hostelBlock,
        phone,
      });
      alert('Institutional profile record updated successfully.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#c7c4d7]/60 overflow-hidden flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#eff4ff] p-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4338ca] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b1c30]">IMSEC Student Profile Dossier</h2>
              <span className="text-xs text-[#464554]">Verified Academic Record &amp; Privacy Shield</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777586] hover:text-[#0b1c30] hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Profile Content */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 p-3 bg-[#eff4ff]/60 rounded-xl border border-[#e2e8f0]">
            <img
              src={profile?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCFTI8WrD3h4N_jIV1xAZB1YSbIZUebduORRKOf9MeiPWBfAl9SWIIcPPOQRN9XTNyVMX_m77qlbRaXr2vYhUXkyllWUCbgK6bfaHP01RV0S57PB4GW8xMZod9d_iZguTXnVMcCbE2h1OD0rEnglZg3Ch5LfPdCq9oNYMqk9cogJsLvuay_JWtYSdbyliuBOypIttS80rkcKAJFzLySz5KckR9g5TQ49K-pEm2bCtKProEbkzZxdv'}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0b1c30]">{name}</span>
              <span className="font-mono text-xs text-[#2a14b4] font-semibold">{rollNumber}</span>
              <span className="text-[11px] text-[#005c54] font-medium flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                AICTE Redressal Verified Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#eff4ff] text-xs text-[#0b1c30] p-2.5 rounded-lg border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30]">College Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="bg-[#eff4ff] font-mono text-xs text-[#0b1c30] p-2.5 rounded-lg border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30]">Engineering Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-[#eff4ff] text-xs text-[#0b1c30] p-2.5 rounded-lg border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30]">Academic Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-[#eff4ff] text-xs text-[#0b1c30] p-2.5 rounded-lg border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30]">Hostel / Residential Block</label>
              <input
                type="text"
                value={hostelBlock}
                onChange={(e) => setHostelBlock(e.target.value)}
                className="bg-[#eff4ff] text-xs text-[#0b1c30] p-2.5 rounded-lg border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30]">Contact Hotline Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#eff4ff] font-mono text-xs text-[#0b1c30] p-2.5 rounded-lg border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              />
            </div>
          </div>

          {/* Statutory Shield Setting */}
          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">visibility_off</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0b1c30]">Default Peer Masking</span>
                <span className="text-[11px] text-[#464554]">Always mask identity on public bulletin boards</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={peerMaskingDefault}
              onChange={(e) => setPeerMaskingDefault(e.target.checked)}
              className="w-4 h-4 text-[#4338ca] rounded focus:ring-[#4338ca] accent-[#4338ca]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onSignOut}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-[#ba1a1a] bg-[#ffdad6]/40 hover:bg-[#ffdad6] border border-[#ba1a1a]/20 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-bold text-[#0b1c30] bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#4338ca] hover:bg-[#2a14b4] shadow-xs transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

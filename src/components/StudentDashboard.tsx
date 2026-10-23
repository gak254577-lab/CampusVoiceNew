import React, { useState } from 'react';
import { ComplaintTicket, UserProfile } from '../types';

interface StudentDashboardProps {
  profile: UserProfile | null;
  complaints: ComplaintTicket[];
  onSelectTicket: (ticket: ComplaintTicket) => void;
  onSubmitGrievance: () => void;
  onOpenSop: () => void;
  onOpenCharter: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  complaints,
  onSelectTicket,
  onSubmitGrievance,
  onOpenSop,
  onOpenCharter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPill, setFilterPill] = useState<'all' | 'active' | 'verification' | 'closed'>('all');

  const studentName = profile?.name || 'Aanya Sharma';
  const rollNumber = profile?.rollNumber || '2101430100042';
  const branch = profile?.branch || 'Computer Science';
  const year = profile?.year || '4th Year';

  // Find verification-required complaint or default to mock
  const verificationTicket = complaints.find(
    c => c.status === 'Resolution Submitted' || c.ticketId === 'CV-2024-089'
  ) || complaints[0];

  // Filtering for table
  const filteredComplaints = complaints.filter(ticket => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.category && ticket.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterPill === 'active') {
      return ticket.status === 'Submitted' || ticket.status === 'In Review' || ticket.status === 'In Progress';
    }
    if (filterPill === 'verification') {
      return ticket.status === 'Resolution Submitted';
    }
    if (filterPill === 'closed') {
      return ticket.status === 'Resolved' || ticket.status === 'Rejected';
    }
    return true;
  });

  const totalFiled = complaints.length || 5;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'In Review').length || 2;
  const pendingReviewCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'Resolution Submitted').length || 1;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length || 2;

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Welcome & Academic Identity Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-[30px] font-bold text-[#0b1c30] tracking-tight leading-tight">
              Welcome back, {studentName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#0b1c30] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#005c54]"></span>
              AY 2024–25 (Odd Semester)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#464554]">
            <span className="font-semibold text-[#0b1c30]">B.Tech {branch}</span>
            <span className="text-[#c7c4d7]">•</span>
            <span>{year} • Section B</span>
            <span className="text-[#c7c4d7]">•</span>
            <span className="font-mono text-[11px] text-[#464554]">Roll: {rollNumber}</span>
            <span className="text-[#c7c4d7]">•</span>
            <span className="inline-flex items-center gap-1 text-[#005c54] font-semibold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              Verified Student Portal Account
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start xl:self-center">
          <button
            onClick={onOpenSop}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] transition-colors text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#464554]">description</span>
            <span>Redressal SOP &amp; SLAs</span>
          </button>
          <button
            onClick={onSubmitGrievance}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#2a14b4] text-white text-xs font-bold shadow-sm transition-all transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Submit Grievance</span>
          </button>
        </div>
      </div>

      {/* Operational Action Callout Banner */}
      {verificationTicket && (
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-[#e2e8f0] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full font-bold">
                    Action Required by Complainant
                  </span>
                  <span className="font-mono text-xs text-[#464554] font-bold">
                    #{verificationTicket.ticketId || 'CV-2024-089'}
                  </span>
                </div>
                <p className="text-sm text-[#0b1c30] mt-1">
                  IT Maintenance Staff has marked <span className="font-semibold">"{verificationTicket.title}"</span> as resolved.
                </p>
                <span className="text-xs text-[#464554] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-700">schedule</span>
                  Automated closure in <strong className="text-[#0b1c30] font-semibold">38 hours</strong> if unverified. Please test the network band in Lab 204.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => onSelectTicket(verificationTicket)}
                className="px-3 py-1.5 rounded-lg bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff] text-xs font-semibold transition-colors"
              >
                View Work Report
              </button>
              <button
                onClick={() => onSelectTicket(verificationTicket)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Review &amp; Verify Completion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metric Badges Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Filed */}
        <div className="rounded-xl bg-white p-4 flex flex-col justify-between shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#464554] tracking-wider">Total Filed</span>
            <div className="w-8 h-8 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#2a14b4]">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-[32px] font-bold text-[#0b1c30] leading-none">
              {String(totalFiled).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-semibold text-[#464554] bg-[#eff4ff] px-2 py-0.5 rounded-full">
              Academic Lifetime
            </span>
          </div>
          <div className="mt-2 pt-1 flex items-center gap-1 text-[11px] text-[#777586]">
            <span>First logged: 12 Jan 2023</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl bg-white p-4 flex flex-col justify-between shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#464554] tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-800">
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-[32px] font-bold text-[#0b1c30] leading-none">
              {String(inProgressCount).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
              Active Dispatch
            </span>
          </div>
          <div className="mt-2 pt-1 flex items-center gap-1 text-[11px] text-[#464554]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
            <span>Estate • IT Infrastructure</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="rounded-xl bg-white p-4 flex flex-col justify-between shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#464554] tracking-wider">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-[32px] font-bold text-[#0b1c30] leading-none">
              {String(pendingReviewCount).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Under Stage-1 SLA
            </span>
          </div>
          <div className="mt-2 pt-1 flex items-center gap-1 text-[11px] text-[#777586]">
            <span>Awaiting Proctorial assignment</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="rounded-xl bg-white p-4 flex flex-col justify-between shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#464554] tracking-wider">Resolved &amp; Closed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-[32px] font-bold text-[#0b1c30] leading-none">
              {String(resolvedCount).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              100% Student Verified
            </span>
          </div>
          <div className="mt-2 pt-1 flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
            <span className="material-symbols-outlined text-[14px]">thumb_up</span>
            <span>Avg Resolution: 3.2 Days</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid (8 Cols Left, 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Grievance Registry Table */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-xl bg-white shadow-xs border border-[#e2e8f0] overflow-hidden flex flex-col">
            {/* Table Control Toolbar */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#eff4ff]/60 border-b border-[#e2e8f0]">
              <div>
                <h2 className="text-base font-bold text-[#0b1c30] tracking-tight">
                  Grievance Case Registry
                </h2>
                <span className="block text-xs text-[#464554]">
                  Statutory tracking under Section 4 of IMSEC Grievance Charter
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg text-[#464554] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
                  title="Export Registry"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="p-1.5 rounded-lg text-[#464554] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
                  title="Refresh"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Filter Subbar */}
            <div className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border-b border-[#e2e8f0]">
              <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-[#777586]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Ticket ID, keyword..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#eff4ff] text-xs text-[#0b1c30] placeholder:text-[#777586] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setFilterPill('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    filterPill === 'all'
                      ? 'bg-[#4338ca] text-white'
                      : 'bg-[#eff4ff] text-[#464554] hover:bg-[#e5eeff]'
                  }`}
                >
                  All ({complaints.length})
                </button>
                <button
                  onClick={() => setFilterPill('active')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    filterPill === 'active'
                      ? 'bg-[#4338ca] text-white'
                      : 'bg-[#eff4ff] text-[#464554] hover:bg-[#e5eeff]'
                  }`}
                >
                  Active ({inProgressCount})
                </button>
                <button
                  onClick={() => setFilterPill('verification')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    filterPill === 'verification'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  Requires Verification (1)
                </button>
                <button
                  onClick={() => setFilterPill('closed')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    filterPill === 'closed'
                      ? 'bg-[#4338ca] text-white'
                      : 'bg-[#eff4ff] text-[#464554] hover:bg-[#e5eeff]'
                  }`}
                >
                  Closed ({resolvedCount})
                </button>
              </div>
            </div>

            {/* Registry Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#464554] text-[11px] uppercase tracking-wider font-bold border-b border-[#e2e8f0]">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Issue Title &amp; Department</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Logged Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-xs">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#777586]">
                        No grievance records found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((ticket) => {
                      const isVerification = ticket.status === 'Resolution Submitted';
                      const isInProgress = ticket.status === 'In Progress' || ticket.status === 'In Review';
                      const isResolved = ticket.status === 'Resolved';

                      return (
                        <tr
                          key={ticket.id}
                          onClick={() => onSelectTicket(ticket)}
                          className={`hover:bg-[#eff4ff]/80 transition-colors cursor-pointer ${
                            isVerification ? 'bg-amber-50/40' : 'bg-white'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#2a14b4] align-top whitespace-nowrap">
                            #{ticket.ticketId}
                            {isVerification && (
                              <span className="block text-[10px] text-amber-700 font-normal font-sans">
                                Verification Req
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-[#0b1c30] group-hover:text-[#2a14b4] transition-colors">
                                {ticket.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 text-[11px] text-[#464554]">
                                  <span className="material-symbols-outlined text-[14px]">
                                    {ticket.category.toLowerCase().includes('wifi') ? 'router' : ticket.category.toLowerCase().includes('hostel') ? 'water_drop' : 'school'}
                                  </span>
                                  {ticket.category}
                                </span>
                                <span className="text-[#c7c4d7]">•</span>
                                <span className="text-[11px] text-[#777586]">
                                  {ticket.building || 'Block A, Level 2'} {ticket.room ? `• ${ticket.room}` : ''}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#464554] align-top whitespace-nowrap hidden sm:table-cell">
                            {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            <span className="block text-[10px] text-[#777586] font-sans">
                              {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top whitespace-nowrap">
                            {isVerification ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                                Resolution Submitted
                              </span>
                            ) : isInProgress ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                                In Progress
                              </span>
                            ) : isResolved ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                                <span className="material-symbols-outlined text-[13px]">check</span>
                                Resolved &amp; Closed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                                {ticket.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-top text-right">
                            <span className="inline-flex items-center justify-center p-1.5 rounded-lg text-[#2a14b4] hover:bg-[#e5eeff] transition-colors">
                              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Footer */}
            <div className="px-4 py-3 bg-[#eff4ff]/40 flex items-center justify-between border-t border-[#e2e8f0]">
              <span className="text-xs text-[#464554]">
                Showing <strong className="text-[#0b1c30] font-semibold">{filteredComplaints.length}</strong> records
              </span>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 text-xs font-semibold text-[#464554] hover:text-[#0b1c30] bg-[#e5eeff] rounded-md">
                  Previous
                </button>
                <button className="px-2.5 py-1 text-xs font-semibold text-white bg-[#4338ca] rounded-md">
                  1
                </button>
                <button className="px-2.5 py-1 text-xs font-semibold text-[#464554] hover:text-[#0b1c30] bg-[#e5eeff] rounded-md">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Institutional Transparency Metric Card */}
          <div className="rounded-xl bg-[#eff4ff] p-4 border border-[#e2e8f0] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2a14b4] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[28px]">shield</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#0b1c30]">
                  Confidentiality &amp; Anti-Victimization Guarantee
                </h3>
                <span className="text-xs text-[#464554] mt-0.5">
                  Complaints registered under CampusVoice are directly monitored by the College Ombudsman as per AICTE Notification F.No. 1-101/PGRC/AICTE/Regulation/2019.
                </span>
              </div>
            </div>
            <button
              onClick={onOpenCharter}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-white text-[#2a14b4] hover:bg-[#e5eeff] text-xs font-bold transition-colors flex items-center gap-1 border border-[#c7c4d7]/40 shadow-xs"
            >
              <span>Read Charter</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Activity Stream & Escalation Matrix */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Chronological Activity Stream */}
          <div className="rounded-xl bg-white p-4 shadow-xs border border-[#e2e8f0] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">history_edu</span>
                <h3 className="text-sm font-bold text-[#0b1c30]">Activity Stream</h3>
              </div>
              <span className="text-[11px] font-bold text-[#464554] bg-[#eff4ff] px-2 py-0.5 rounded-full">
                Live Audit
              </span>
            </div>

            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#d3e4fe]">
              {/* Step 1: Resolution Submitted */}
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 shadow-xs ring-4 ring-amber-100"></span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">Resolution Submitted</span>
                  <span className="font-mono text-[10px] text-[#777586]">2h ago</span>
                </div>
                <p className="text-xs text-[#0b1c30] mt-0.5">
                  Hardware replaced and throughput tested at 112 Mbps by Network Admin <span className="font-semibold">Er. Rakesh Kumar</span>.
                </p>
                <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[#2a14b4]">
                  <span className="bg-[#eff4ff] px-1.5 py-0.5 rounded font-bold">Ticket #CV-2024-089</span>
                </div>
              </div>

              {/* Step 2: Technician Dispatched */}
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100"></span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">Technician Dispatched</span>
                  <span className="font-mono text-[10px] text-[#777586]">Yesterday</span>
                </div>
                <p className="text-xs text-[#0b1c30] mt-0.5">
                  Estate Office assigned Plumbing &amp; Compressor Engineer for Raman Hostel cooler.
                </p>
                <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[#2a14b4]">
                  <span className="bg-[#eff4ff] px-1.5 py-0.5 rounded font-bold">Ticket #CV-2024-074</span>
                </div>
              </div>

              {/* Step 3: Formal Acknowledgement */}
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#4338ca] ring-4 ring-[#e3dfff]"></span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">Formal Acknowledgement</span>
                  <span className="font-mono text-[10px] text-[#777586]">3 days ago</span>
                </div>
                <p className="text-xs text-[#0b1c30] mt-0.5">
                  Ticket verified &amp; routed to Department IT Cell by HOD Office.
                </p>
                <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[#2a14b4]">
                  <span className="bg-[#eff4ff] px-1.5 py-0.5 rounded font-bold">Ticket #CV-2024-089</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSop}
              className="mt-4 w-full py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-semibold transition-colors text-center border border-[#e2e8f0]"
            >
              View Complete Historical Audit Trail
            </button>
          </div>

          {/* Statutory Escalation Tiers / SLA Terms */}
          <div className="rounded-xl bg-white p-4 shadow-xs border border-[#e2e8f0] flex flex-col">
            <div className="flex items-center gap-2 pb-2">
              <span className="material-symbols-outlined text-[#4f5c8e] text-[20px]">tune</span>
              <h3 className="text-sm font-bold text-[#0b1c30]">Statutory Escalation Tiers</h3>
            </div>
            <p className="text-xs text-[#464554] mb-3 leading-relaxed">
              If unresolved within prescribed turnaround times, grievance automatically elevates to upper administrative authorities.
            </p>

            <div className="flex flex-col gap-2">
              {/* Level 1 */}
              <div className="p-2.5 rounded-lg bg-[#eff4ff] flex flex-col border border-[#e2e8f0]/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">Level 1: Department Cell</span>
                  <span className="font-mono text-[11px] font-bold text-[#2a14b4]">48 Hours</span>
                </div>
                <span className="text-[11px] text-[#464554] mt-0.5">
                  Faculty In-charge / Estate Supervisor level immediate handling.
                </span>
              </div>

              {/* Level 2 */}
              <div className="p-2.5 rounded-lg bg-[#eff4ff] flex flex-col border border-[#e2e8f0]/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">Level 2: Head of Department</span>
                  <span className="font-mono text-[11px] font-bold text-[#2a14b4]">5 Working Days</span>
                </div>
                <span className="text-[11px] text-[#464554] mt-0.5">
                  Academic/Facility Head intervention &amp; resource sanctioning.
                </span>
              </div>

              {/* Level 3 */}
              <div className="p-2.5 rounded-lg bg-[#ffdad6]/30 flex flex-col border border-[#ba1a1a]/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ba1a1a]">Level 3: Proctorial Board</span>
                  <span className="font-mono text-[11px] font-bold text-[#ba1a1a]">7+ Days Overdue</span>
                </div>
                <span className="text-[11px] text-[#93000a] mt-0.5">
                  College Director &amp; Disciplinary Ombudsman direct hearing.
                </span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between border border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">support_agent</span>
                <span className="text-xs font-semibold text-[#0b1c30]">Need offline guidance?</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#2a14b4]">Ext: 281</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

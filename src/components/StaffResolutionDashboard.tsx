import React, { useState } from 'react';
import { ComplaintTicket, UserProfile } from '../types';

interface StaffResolutionDashboardProps {
  profile: UserProfile | null;
  complaints: ComplaintTicket[];
  onSelectTicket: (ticket: ComplaintTicket) => void;
  onSubmitStaffResolution: (
    ticketId: string,
    actionTaken: string,
    photoUrl?: string,
    speedtest?: string
  ) => Promise<void>;
  onExportAuditDossier: () => void;
}

export const StaffResolutionDashboard: React.FC<StaffResolutionDashboardProps> = ({
  profile,
  complaints,
  onSelectTicket,
  onSubmitStaffResolution,
  onExportAuditDossier,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'immediate' | 'awaiting' | 'resolved' | 'escalated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Selected ticket for resolution action drawer
  const [activeActionTicket, setActiveActionTicket] = useState<ComplaintTicket | null>(
    complaints.find(c => c.status === 'In Progress' || c.status === 'Submitted') || complaints[0] || null
  );

  const [interventionNote, setInterventionNote] = useState('');
  const [speedtestData, setSpeedtestData] = useState('');
  const [photoProofUrl, setPhotoProofUrl] = useState<string>('');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  // Dynamic KPI counts
  const assignedQueueCount = complaints.length;
  const immediateCount = complaints.filter(c => c.severity === 'Urgent' || c.severity === 'High').length;
  const awaitingCount = complaints.filter(c => c.status === 'Resolution Submitted').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const escalatedCount = complaints.filter(c => Boolean(c.escalated) || c.status === 'Escalated').length;

  const resolvedWithTimes = complaints.filter(c => c.status === 'Resolved' && c.createdAt && c.updatedAt && c.updatedAt > c.createdAt);
  const avgTurnaroundHours = resolvedWithTimes.length > 0
    ? (resolvedWithTimes.reduce((acc, c) => acc + (c.updatedAt - c.createdAt) / (1000 * 60 * 60), 0) / resolvedWithTimes.length).toFixed(1)
    : null;

  const slaRate = complaints.length > 0
    ? Math.max(0, Math.round(((complaints.length - escalatedCount) / complaints.length) * 100))
    : 100;

  // Filter complaints
  const filteredQueue = complaints.filter(ticket => {
    if (activeTab === 'immediate' && !(ticket.severity === 'Urgent' || ticket.severity === 'High')) return false;
    if (activeTab === 'awaiting' && ticket.status !== 'Resolution Submitted') return false;
    if (activeTab === 'resolved' && ticket.status !== 'Resolved') return false;
    if (activeTab === 'escalated' && !ticket.escalated && ticket.status !== 'Escalated') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.ticketId.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        (ticket.studentRoll && ticket.studentRoll.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (priorityFilter && ticket.severity.toLowerCase() !== priorityFilter.toLowerCase()) return false;
    if (categoryFilter && !ticket.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
    if (locationFilter && !(ticket.building && ticket.building.toLowerCase().includes(locationFilter.toLowerCase()))) return false;

    return true;
  });

  const handleResolveSubmit = async () => {
    if (!activeActionTicket) return;
    if (!interventionNote.trim()) {
      alert('Please describe the corrective action implemented.');
      return;
    }
    setIsSubmittingResolution(true);
    try {
      await onSubmitStaffResolution(
        activeActionTicket.id,
        interventionNote.trim(),
        photoProofUrl.trim() || undefined,
        speedtestData.trim() || undefined
      );
      alert(`Resolution report submitted for #${activeActionTicket.ticketId}! Complainant has been notified to verify.`);
      setInterventionNote('');
      setSpeedtestData('');
      setPhotoProofUrl('');
    } catch (e) {
      console.error(e);
      alert('Failed to submit resolution.');
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Banner & Compliance Header */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] mb-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#4338ca] flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-[#2a14b4] uppercase tracking-wider bg-[#eff4ff] px-2 py-0.5 rounded font-bold">
                  STAFF WORKSPACE // SEC-IT-REDRESSAL
                </span>
                <span className="text-[11px] bg-[#005c54]/10 text-[#005c54] px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005c54] animate-pulse"></span>
                  AICTE Compliance Mode: Active
                </span>
              </div>
              <h1 className="text-lg font-bold text-[#0b1c30] mt-1 tracking-tight">
                IT &amp; Multimedia Redressal Cell — Administrative Resolution Desk
              </h1>
              <p className="text-xs text-[#464554] flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#2a14b4]">verified</span>
                Nodal Officer: <span className="font-bold text-[#0b1c30]">{profile?.name || 'Er. Rakesh Kumar'}</span>
                <span className="font-mono text-[11px] text-[#777586]">({profile?.rollNumber || 'EMP-IT-088'})</span> • Department of Information Technology • Standing Committee Member
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch xl:self-auto justify-end">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              immediateCount > 0
                ? 'bg-[#ffdad6]/40 border-[#ba1a1a]/20 text-[#ba1a1a]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {immediateCount > 0 ? 'warning' : 'verified'}
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {immediateCount > 0 ? 'Action Alert' : 'SLA Status'}
                </span>
                <span className="text-xs font-semibold">
                  {immediateCount > 0
                    ? `${immediateCount} urgent docket(s) requiring priority dispatch`
                    : 'All active queue dockets within SLA target'}
                </span>
              </div>
            </div>
            <button
              onClick={onExportAuditDossier}
              className="bg-[#2a14b4] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#4338ca] transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Audit Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid (4 Institutional KPI Panels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464554] uppercase tracking-wider">Assigned Queue</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#2a14b4]">
              <span className="material-symbols-outlined text-[18px]">inbox</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-mono text-3xl font-bold text-[#0b1c30]">{assignedQueueCount}</span>
            <span className="text-xs text-[#464554]">Active Dockets</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-xs text-[#2a14b4] font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">dynamic_feed</span> Real-time Sync
            </span>
            <span className="font-mono text-[11px] text-[#777586]">Queue: {assignedQueueCount}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464554] uppercase tracking-wider">Priority Attention</span>
            <span className="p-1.5 rounded-lg bg-[#ffdad6]/40 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-mono text-3xl font-bold text-[#ba1a1a]">
              {String(immediateCount).padStart(2, '0')}
            </span>
            <span className="text-xs text-[#464554]">Urgent / High</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-xs text-[#ba1a1a] font-bold">Priority Triage</span>
            <span className="font-mono text-[11px] text-[#777586]">
              {immediateCount > 0 ? 'Requires action' : 'Zero urgent'}
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464554] uppercase tracking-wider">Student Verification</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#4f5c8e]">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-mono text-3xl font-bold text-[#0b1c30]">
              {String(awaitingCount).padStart(2, '0')}
            </span>
            <span className="text-xs text-[#464554]">Awaiting Sign-off</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-xs text-[#4f5c8e] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">hourglass_top</span> Student Review
            </span>
            <span className="font-mono text-[11px] text-[#777586]">
              {awaitingCount} Submitted
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464554] uppercase tracking-wider">SLA Compliance</span>
            <span className="p-1.5 rounded-lg bg-[#005c54]/10 text-[#005c54]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-bold text-[#0b1c30]">{slaRate}</span>
                <span className="text-sm font-bold text-[#464554]">%</span>
              </div>
              <span className="text-xs text-[#005c54] font-bold">
                {avgTurnaroundHours ? `Avg: ${avgTurnaroundHours} hrs` : 'Target: ≤48h'}
              </span>
            </div>
            {/* Inline radial SVG gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-[#eff4ff]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <path className="text-[#2a14b4]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${slaRate}, 100`} strokeLinecap="round" strokeWidth="3.5" />
              </svg>
              <span className="absolute font-mono text-[9px] text-[#2a14b4] font-bold">SLA</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-[11px] text-[#777586]">Target: &gt;95%</span>
            <span className="text-[11px] text-[#005c54] font-bold">AICTE Compliant</span>
          </div>
        </div>
      </div>

      {/* Tabs and Filters Row */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] mb-4 flex flex-col gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-[#eff4ff] p-1 rounded-lg">
          {[
            { id: 'all', label: 'All Assigned', count: assignedQueueCount },
            { id: 'immediate', label: 'Immediate Action', count: immediateCount, alert: immediateCount > 0 },
            { id: 'awaiting', label: 'Awaiting Student Verification', count: awaitingCount },
            { id: 'resolved', label: 'Resolved & Audited', count: resolvedCount },
            { id: 'escalated', label: 'Escalated (Dean Office)', count: escalatedCount, critical: escalatedCount > 0 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-[#2a14b4] shadow-xs font-bold'
                  : 'text-[#464554] hover:text-[#0b1c30]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab.critical
                    ? 'bg-[#ba1a1a] text-white'
                    : tab.alert
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : activeTab === tab.id
                    ? 'bg-[#4338ca] text-white'
                    : 'bg-[#d3e4fe] text-[#0b1c30]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Input Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined text-[18px] text-[#777586] absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Ticket ID (#CV-...), Complainant Roll, Keyword..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#eff4ff] text-xs text-[#0b1c30] rounded-lg border border-[#e2e8f0] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4338ca]/20"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full bg-[#eff4ff] text-xs text-[#0b1c30] py-1.5 px-3 rounded-lg border border-[#e2e8f0] focus:outline-none focus:bg-white"
            >
              <option value="">Priority: All Levels</option>
              <option value="urgent">Urgent (&lt; 6h SLA)</option>
              <option value="high">High (&lt; 24h SLA)</option>
              <option value="medium">Medium</option>
              <option value="low">Routine</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full bg-[#eff4ff] text-xs text-[#0b1c30] py-1.5 px-3 rounded-lg border border-[#e2e8f0] focus:outline-none focus:bg-white"
            >
              <option value="">Category: All IT</option>
              <option value="wifi">Campus Wi-Fi / LAN</option>
              <option value="classroom">Lab Projector &amp; AV</option>
              <option value="hostel">Hostel Electrical</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('');
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="w-full p-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#464554] rounded-lg transition-colors flex items-center justify-center border border-[#e2e8f0]"
              title="Reset Filters"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split: Active Queue + Quick Resolution Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Active Queue Table (7 cols) */}
        <div className="xl:col-span-7 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-4 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">dynamic_feed</span>
              <h2 className="text-sm font-bold text-[#0b1c30]">Active Grievance Roster</h2>
              <span className="font-mono text-[11px] text-[#777586]">#AUDIT-ACTIVE-2024-Q3</span>
            </div>
            <span className="font-mono text-[11px] text-[#2a14b4] bg-[#eff4ff] px-2 py-0.5 rounded font-bold">
              Priority ↓
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#eff4ff] text-[#464554] text-[10.5px] uppercase font-bold tracking-wider border-b border-[#e2e8f0]">
                  <th className="py-2.5 px-3">Docket / Complainant</th>
                  <th className="py-2.5 px-3">Subject &amp; Location</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#777586]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[28px] text-[#c7c4d7]">inbox</span>
                        <span>No grievance records matching this queue filter.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map(t => {
                    const isSelected = activeActionTicket?.id === t.id;
                    const isUrgent = t.severity === 'Urgent';

                    return (
                      <tr
                        key={t.id}
                        onClick={() => setActiveActionTicket(t)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#dce9ff]/60' : isUrgent ? 'bg-[#ffdad6]/15 hover:bg-[#ffdad6]/25' : 'hover:bg-[#eff4ff]/60'
                        }`}
                      >
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#2a14b4]">#{t.ticketId}</span>
                              {isUrgent && (
                                <span className="bg-[#ba1a1a] text-white text-[9px] px-1 py-0.2 rounded font-bold uppercase">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-[#0b1c30] mt-0.5">
                              {t.studentName || 'Student Complainant'}
                            </span>
                            <span className="font-mono text-[10px] text-[#777586]">
                              {t.studentRoll || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#0b1c30] line-clamp-1">{t.title}</span>
                            <span className="text-[11px] text-[#777586] mt-0.5">
                              {t.building || 'Campus Facility'} {t.room ? `• ${t.room}` : ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eff4ff] text-[#2a14b4] border border-[#d3e4fe]">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 align-top text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onSelectTicket(t);
                            }}
                            className="px-2 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#2a14b4] rounded text-[11px] font-bold border border-[#e2e8f0]"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Resolution Action Panel (5 cols) */}
        <div className="xl:col-span-5 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-4 sm:p-5 flex flex-col gap-4 sticky top-20">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005c54] text-[20px]">fact_check</span>
              <h3 className="text-sm font-bold text-[#0b1c30]">Submit Technical Resolution</h3>
            </div>
            {activeActionTicket && (
              <span className="font-mono text-xs font-bold text-[#2a14b4] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#e2e8f0]">
                #{activeActionTicket.ticketId}
              </span>
            )}
          </div>

          {activeActionTicket ? (
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e2e8f0] flex flex-col gap-1">
                <span className="text-xs font-bold text-[#0b1c30]">{activeActionTicket.title}</span>
                <span className="text-[11px] text-[#464554]">
                  Complainant: <strong className="text-[#0b1c30]">{activeActionTicket.studentName || 'Student Complainant'}</strong> ({activeActionTicket.studentRoll || 'N/A'})
                </span>
                <span className="text-[11px] text-[#777586]">
                  Location: {activeActionTicket.building || 'Campus Facility'}{activeActionTicket.room ? ` • ${activeActionTicket.room}` : ''}
                </span>
              </div>

              {/* Intervention Action Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0b1c30]">
                  Technical Corrective Action Implemented *
                </label>
                <textarea
                  rows={4}
                  value={interventionNote}
                  onChange={e => setInterventionNote(e.target.value)}
                  placeholder="Detail parts replaced, switch rack port, IP configuration, and physical checks..."
                  className="w-full bg-[#eff4ff]/40 p-2.5 rounded-lg text-xs text-[#0b1c30] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
              </div>

              {/* Speedtest / Telemetry Benchmark */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0b1c30]">
                  Telemetry Benchmark &amp; Validation Result
                </label>
                <input
                  type="text"
                  value={speedtestData}
                  onChange={e => setSpeedtestData(e.target.value)}
                  placeholder="e.g., Signal calibrated at -52 dBm across 45 nodes, 112 Mbps verified"
                  className="w-full bg-[#eff4ff]/40 px-3 py-2 rounded-lg text-xs text-[#0b1c30] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
              </div>

              {/* Photographic Evidence Attachment */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0b1c30]">
                  Photographic Evidence URL (Optional)
                </label>
                <input
                  type="text"
                  value={photoProofUrl}
                  onChange={e => setPhotoProofUrl(e.target.value)}
                  placeholder="https://... photo link of completed repair"
                  className="w-full bg-[#eff4ff]/40 px-3 py-2 rounded-lg text-xs text-[#0b1c30] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
                {photoProofUrl && (
                  <div className="mt-1 p-2 rounded bg-[#eff4ff] border border-[#e2e8f0] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005c54] text-[18px]">image</span>
                    <span className="text-[11px] text-[#0b1c30] truncate">{photoProofUrl}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleResolveSubmit}
                disabled={isSubmittingResolution}
                className="mt-2 w-full py-2.5 rounded-lg bg-[#005c54] hover:bg-[#00423c] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isSubmittingResolution ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Submitting Resolution Docket...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Submit Resolution for Student Verification</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#777586]">
              Select a ticket from the roster to dispatch resolution evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

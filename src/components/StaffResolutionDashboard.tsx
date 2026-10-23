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

  const [interventionNote, setInterventionNote] = useState(
    'Replaced damaged ceiling-mount access point and configured dual-band 5GHz backhaul. Calibrated signal strength to -52 dBm across 45 nodes.'
  );
  const [speedtestData, setSpeedtestData] = useState('112.4 Mbps (0.00% packet loss, 0.8ms jitter)');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  // Filter complaints
  const filteredQueue = complaints.filter(ticket => {
    if (activeTab === 'immediate' && !(ticket.severity === 'Urgent' || ticket.severity === 'High')) return false;
    if (activeTab === 'awaiting' && ticket.status !== 'Resolution Submitted') return false;
    if (activeTab === 'resolved' && ticket.status !== 'Resolved') return false;
    if (activeTab === 'escalated' && !ticket.escalated) return false;

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
        interventionNote,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFXK7AHK_zU87UjPXOqa8_y-dnqS6zH1s4K8PZUdj-T_tby0a8Ef7eoFOpIp6QhrepPXuXEHi2qt-5HMIdE6LwRJlpcS4OVN9WDuextcH9Zx6mB8_28D9qCGFHZZueWkoCo0FX09OuazMF-JMYDHEVznVcpjEg8Mp9M0rYZO7LTlGSJXRR1_sLboebFvYKTwvd-uZXNiMNZqQ4CvWuFckub3BhceIrLdQXumkbmR-zlEUKmvGpykU',
        speedtestData
      );
      alert(`Resolution report submitted for #${activeActionTicket.ticketId}! Complainant has been notified to verify.`);
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
                Nodal Officer: <span className="font-bold text-[#0b1c30]">Er. Rakesh Kumar</span>
                <span className="font-mono text-[11px] text-[#777586]">(EMP-IT-088)</span> • Department of Information Technology • Standing Committee Member
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch xl:self-auto justify-end">
            <div className="flex items-center gap-2 bg-[#ffdad6]/40 border border-[#ba1a1a]/20 px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">warning</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#ba1a1a] font-bold uppercase tracking-wide">Action Alert</span>
                <span className="text-xs text-[#93000a] font-semibold">1 Grievance pending SLA breach (&lt; 2h left)</span>
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
            <span className="font-mono text-3xl font-bold text-[#0b1c30]">14</span>
            <span className="text-xs text-[#464554]">Active Dockets</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-xs text-[#2a14b4] font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2 from yesterday
            </span>
            <span className="font-mono text-[11px] text-[#777586]">Queue Load: 68%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464554] uppercase tracking-wider">Action Required</span>
            <span className="p-1.5 rounded-lg bg-[#ffdad6]/40 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-mono text-3xl font-bold text-[#ba1a1a]">03</span>
            <span className="text-xs text-[#464554]">Unassigned Dockets</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-xs text-[#ba1a1a] font-bold">Immediate Inspection</span>
            <span className="font-mono text-[11px] text-[#777586]">Max Age: 4h 10m</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464554] uppercase tracking-wider">Student Sign-off</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#4f5c8e]">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-mono text-3xl font-bold text-[#0b1c30]">04</span>
            <span className="text-xs text-[#464554]">Pending Review</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 bg-[#eff4ff] px-2.5 py-1 rounded">
            <span className="text-xs text-[#4f5c8e] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">hourglass_top</span> Auto-close in 48h
            </span>
            <span className="font-mono text-[11px] text-[#777586]">Avg: 11h ago</span>
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
                <span className="font-mono text-3xl font-bold text-[#0b1c30]">98.2</span>
                <span className="text-sm font-bold text-[#464554]">%</span>
              </div>
              <span className="text-xs text-[#005c54] font-bold">Turnaround: 26.4 hrs</span>
            </div>
            {/* Inline radial SVG gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-[#eff4ff]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <path className="text-[#2a14b4]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="98.2, 100" strokeLinecap="round" strokeWidth="3.5" />
              </svg>
              <span className="absolute font-mono text-[9px] text-[#2a14b4] font-bold">48h Std</span>
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
            { id: 'all', label: 'All Assigned', count: complaints.length },
            { id: 'immediate', label: 'Immediate Action', count: 3, alert: true },
            { id: 'awaiting', label: 'Awaiting Student Verification', count: 4 },
            { id: 'resolved', label: 'Resolved & Audited', count: 62 },
            { id: 'escalated', label: 'Escalated (Dean Office)', count: 1, critical: true }
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
                {filteredQueue.map(t => {
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
                            {t.studentName || 'Aanya Sharma'}
                          </span>
                          <span className="font-mono text-[10px] text-[#777586]">
                            {t.studentRoll || '2101430100042'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0b1c30] line-clamp-1">{t.title}</span>
                          <span className="text-[11px] text-[#777586] mt-0.5">
                            {t.building || 'Block A'} {t.room ? `• ${t.room}` : ''}
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
                })}
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
                  Complainant: <strong className="text-[#0b1c30]">{activeActionTicket.studentName || 'Aanya Sharma'}</strong> ({activeActionTicket.studentRoll || '2101430100042'})
                </span>
                <span className="text-[11px] text-[#777586]">
                  Location: {activeActionTicket.building || 'Block A'} • {activeActionTicket.room || 'Lab 204'}
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
                  placeholder="e.g., 112.4 Mbps (0.00% packet loss, 0.8ms jitter)"
                  className="w-full bg-[#eff4ff]/40 px-3 py-2 rounded-lg text-xs text-[#0b1c30] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
              </div>

              {/* Hardware Photo Preview */}
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e2e8f0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-[#d3e4fe] flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsFXK7AHK_zU87UjPXOqa8_y-dnqS6zH1s4K8PZUdj-T_tby0a8Ef7eoFOpIp6QhrepPXuXEHi2qt-5HMIdE6LwRJlpcS4OVN9WDuextcH9Zx6mB8_28D9qCGFHZZueWkoCo0FX09OuazMF-JMYDHEVznVcpjEg8Mp9M0rYZO7LTlGSJXRR1_sLboebFvYKTwvd-uZXNiMNZqQ4CvWuFckub3BhceIrLdQXumkbmR-zlEUKmvGpykU"
                      alt="Hardware"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30]">CAM-PROOF-01.jpg</span>
                    <span className="text-[10px] text-[#005c54] font-semibold">✓ Geofence Verified</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('New photographic capture simulation activated.')}
                  className="px-2.5 py-1 text-xs bg-white text-[#2a14b4] rounded border border-[#c7c4d7]/60 font-semibold hover:bg-[#eff4ff]"
                >
                  Change
                </button>
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

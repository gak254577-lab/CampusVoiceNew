import React, { useState } from 'react';
import { ComplaintTicket } from '../types';

interface MyTicketsProps {
  complaints: ComplaintTicket[];
  onSelectTicket: (ticket: ComplaintTicket) => void;
  onOpenSop: () => void;
}

export const MyTickets: React.FC<MyTicketsProps> = ({
  complaints,
  onSelectTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending-verification' | 'resolved' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filter complaints
  const filteredComplaints = complaints.filter(ticket => {
    // Quick tabs
    if (activeTab === 'active' && !(ticket.status === 'Submitted' || ticket.status === 'In Review' || ticket.status === 'In Progress')) {
      return false;
    }
    if (activeTab === 'pending-verification' && ticket.status !== 'Resolution Submitted') {
      return false;
    }
    if (activeTab === 'resolved' && ticket.status !== 'Resolved') {
      return false;
    }
    if (activeTab === 'archived') {
      return false;
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.ticketId.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        (ticket.room && ticket.room.toLowerCase().includes(q)) ||
        (ticket.building && ticket.building.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (categoryFilter !== 'all' && !ticket.category.toLowerCase().includes(categoryFilter)) {
      return false;
    }

    // Status
    if (statusFilter !== 'all' && ticket.status.toLowerCase() !== statusFilter) {
      return false;
    }

    // Priority
    if (priorityFilter !== 'all' && ticket.severity.toLowerCase() !== priorityFilter) {
      return false;
    }

    return true;
  });

  const activeCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'In Review' || c.status === 'In Progress').length;
  const verificationCount = complaints.filter(c => c.status === 'Resolution Submitted').length || 1;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ticket ID,Title,Category,Status,Severity,Date']
        .concat(
          filteredComplaints.map(
            c => `"${c.ticketId}","${c.title}","${c.category}","${c.status}","${c.severity}","${new Date(c.createdAt).toLocaleDateString()}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusVoice_Audit_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-12">
      {/* Top Action / Context Utility Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-[#c7c4d7]/40">
        <div className="flex items-center gap-1.5 text-[#464554] font-mono text-xs">
          <span className="material-symbols-outlined text-[16px] text-[#2a14b4]">security</span>
          <span>IMSEC REGISTRY // RECORD SEC-4(b)</span>
          <span className="text-[#c7c4d7]">•</span>
          <span className="text-[#005c54] font-bold tracking-tight">ENCRYPTION ACTIVE</span>
        </div>
        <div className="flex items-center gap-3 text-[#464554] text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#eff4ff] border border-[#c7c4d7]/50 text-[#0b1c30]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005c54] animate-pulse"></span>
            SLA Tracker: Synchronized
          </span>
          <span className="font-mono text-[11px] text-[#777586]">REF: AY24-O-210143</span>
        </div>
      </div>

      {/* Header & Metric Cards Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-[#4338ca]/10 text-[#2a14b4] text-[11px] uppercase tracking-wider font-bold">
                Student Dossier
              </span>
              <span className="text-[#c7c4d7] text-xs">/</span>
              <span className="text-[#464554] text-xs">Registry Section 2024</span>
            </div>
            <h1 className="text-2xl sm:text-[30px] font-bold text-[#0b1c30] tracking-tight">
              My Filed Grievances
            </h1>
            <p className="text-sm text-[#464554] max-w-2xl leading-relaxed">
              Track statutory redressal status, communicate directly with assigned institutional officers, and certify official resolution evidence.
            </p>
          </div>

          {/* Quick Filter Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#2a14b4] text-white'
                  : 'bg-white text-[#464554] hover:bg-[#eff4ff] border border-[#c7c4d7]/60'
              }`}
            >
              <span>All Grievances</span>
              <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px] font-mono">
                {complaints.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-[#2a14b4] text-white shadow-xs'
                  : 'bg-white text-[#464554] hover:bg-[#eff4ff] border border-[#c7c4d7]/60'
              }`}
            >
              <span>Active / In Progress</span>
              <span className="px-1.5 py-0.2 bg-[#eff4ff] text-[#2a14b4] font-semibold rounded text-[10px] font-mono">
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pending-verification')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pending-verification'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-500/10 text-amber-900 border border-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Resolution Pending Verification</span>
              <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 font-bold rounded text-[10px] font-mono">
                {verificationCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'resolved'
                  ? 'bg-[#2a14b4] text-white shadow-xs'
                  : 'bg-white text-[#464554] hover:bg-[#eff4ff] border border-[#c7c4d7]/60'
              }`}
            >
              <span>Resolved</span>
              <span className="px-1.5 py-0.2 bg-[#eff4ff] text-[#464554] rounded text-[10px] font-mono">
                {resolvedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'archived'
                  ? 'bg-[#2a14b4] text-white shadow-xs'
                  : 'bg-white text-[#777586] hover:bg-[#eff4ff] border border-[#c7c4d7]/40'
              }`}
            >
              <span>Archived</span>
              <span className="px-1.5 py-0.2 bg-[#eff4ff] text-[#777586] rounded text-[10px] font-mono">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Compact Metric / Compliance Card */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">shield_with_heart</span>
              <span className="text-xs text-[#0b1c30] font-bold uppercase tracking-wider">
                AICTE Turnaround SLA
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#005c54] bg-[#89f5e7]/40 px-2 py-0.5 rounded font-bold border border-[#005c54]/20">
              98.4% Compliant
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[#777586] tracking-wider font-semibold">
                Avg. Turnaround
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-[#0b1c30]">36.2</span>
                <span className="text-xs text-[#464554]">Hours</span>
              </div>
              <span className="font-mono text-[11px] text-[#005c54] mt-0.5 flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[12px]">trending_down</span> -4.1h vs Avg
              </span>
            </div>

            <div className="flex flex-col pl-3 border-l border-[#e2e8f0]">
              <span className="text-[10px] uppercase text-[#777586] tracking-wider font-semibold">
                Proctorial Esc.
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-[#0b1c30]">0</span>
                <span className="text-xs text-[#464554]">Escalated</span>
              </div>
              <span className="font-mono text-[11px] text-[#464554] mt-0.5">Under 5-day limit</span>
            </div>
          </div>

          <div className="bg-[#eff4ff] px-3 py-1.5 rounded flex items-center justify-between text-[11px] text-[#464554] font-medium border border-[#e2e8f0]">
            <span>Active Escort Window: <strong>3 Working Days Rem.</strong></span>
            <span className="material-symbols-outlined text-[16px] text-[#2a14b4]">policy</span>
          </div>
        </div>
      </div>

      {/* Search, Filter & Bulk Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col xl:flex-row gap-3 xl:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777586] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ticket ID (e.g. CV-2024-...), title, keyword, or room..."
            className="w-full bg-[#eff4ff] pl-10 pr-4 py-2 rounded text-xs text-[#0b1c30] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/15 transition-all placeholder:text-[#777586]"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#eff4ff] px-2.5 py-1.5 rounded border border-[#e2e8f0]">
            <span className="material-symbols-outlined text-[18px] text-[#464554]">category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-[#0b1c30] focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Categories</option>
              <option value="wifi">Wi-Fi &amp; IT Infrastructure</option>
              <option value="classroom">Classrooms &amp; Audio-Visual</option>
              <option value="hostel">Hostel Facilities</option>
              <option value="cleanliness">Cleanliness &amp; Maintenance</option>
              <option value="academic">Academic / Examination</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#eff4ff] px-2.5 py-1.5 rounded border border-[#e2e8f0]">
            <span className="material-symbols-outlined text-[18px] text-[#464554]">tune</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-[#0b1c30] focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">Status: All</option>
              <option value="submitted">Submitted</option>
              <option value="in progress">In Progress</option>
              <option value="resolution submitted">Resolution Submitted</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Selector */}
          <div className="flex items-center gap-1 bg-[#eff4ff] px-2.5 py-1.5 rounded border border-[#e2e8f0]">
            <span className="material-symbols-outlined text-[18px] text-[#464554]">flag</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs text-[#0b1c30] focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">Priority: All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Export CTA */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#eff4ff] hover:bg-[#e5eeff] border border-[#e2e8f0] text-[#0b1c30] text-xs font-semibold transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">download</span>
            <span>Export Audit Log</span>
            <span className="font-mono text-[10px] text-[#464554] bg-white px-1 py-0.2 rounded border border-[#c7c4d7]/40">
              CSV
            </span>
          </button>
        </div>
      </div>

      {/* Grievance Docket Directory Table / List */}
      <div className="flex flex-col bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-6 py-3 bg-[#eff4ff] border-b-2 border-[#c7c4d7]/70 items-center text-xs font-bold uppercase tracking-wider text-[#464554]">
          <div className="col-span-2">Ticket ID &amp; Code</div>
          <div className="col-span-4">Grievance Subject &amp; Location</div>
          <div className="col-span-2">Assigned Authority</div>
          <div className="col-span-2">Timeline &amp; Status</div>
          <div className="col-span-2 text-right">Action / Docket</div>
        </div>

        {/* Rows */}
        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center text-[#777586] text-xs">
            No grievance records matching your query.
          </div>
        ) : (
          filteredComplaints.map((ticket) => {
            const isVerification = ticket.status === 'Resolution Submitted';
            const isUrgent = ticket.severity === 'Urgent';

            return (
              <div
                key={ticket.id}
                className={`p-4 lg:px-6 lg:py-4 border-b border-[#e2e8f0] transition-colors ${
                  isVerification ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'bg-white hover:bg-[#eff4ff]/40'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* ID & Priority Tag */}
                  <div className="lg:col-span-2 flex flex-row lg:flex-col justify-between lg:justify-center items-start gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[13px] font-bold text-[#2a14b4]">
                        #{ticket.ticketId}
                      </span>
                      {isUrgent && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30">
                          URGENT
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-[#777586]">
                      CAT: {ticket.category.substring(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* Title, Category & Location */}
                  <div className="lg:col-span-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase text-[#2a14b4] px-1.5 py-0.5 rounded bg-[#4338ca]/10">
                        {ticket.category}
                      </span>
                      <span className="text-[#c7c4d7] text-xs">•</span>
                      <div className="flex items-center gap-1 text-[#464554] text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-[#777586]">location_on</span>
                        <span>{ticket.building || 'Block A'} {ticket.room ? `• ${ticket.room}` : ''}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1c30] leading-tight hover:text-[#2a14b4] transition-colors cursor-pointer" onClick={() => onSelectTicket(ticket)}>
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-[#464554] line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>

                  {/* Assigned Officer */}
                  <div className="lg:col-span-2 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#d3e4fe] border border-[#c7c4d7]/60 flex items-center justify-center text-[#2a14b4] font-bold font-mono text-xs shrink-0">
                      RK
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#0b1c30] truncate">
                        {ticket.resolutionProof?.officerName || 'Er. Rakesh Kumar'}
                      </span>
                      <span className="text-[11px] text-[#777586] truncate">
                        {ticket.resolutionProof?.officerRole || 'Network Admin'}
                      </span>
                    </div>
                  </div>

                  {/* Timeline & Status Badge */}
                  <div className="lg:col-span-2 flex flex-col gap-1">
                    {isVerification ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 w-fit">
                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                        <span className="text-[10px] uppercase font-bold tracking-tight">Resolution Submitted</span>
                      </div>
                    ) : ticket.status === 'Resolved' ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 w-fit">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        <span className="text-[10px] uppercase font-bold tracking-tight">Resolved &amp; Closed</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                        <span className="text-[10px] uppercase font-bold tracking-tight">{ticket.status}</span>
                      </div>
                    )}

                    <div className="flex flex-col text-[11px] font-mono text-[#464554]">
                      <span>Submitted: <strong className="text-[#0b1c30]">{new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                      {isVerification && (
                        <span className="text-amber-800 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span> Verification Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-1.5">
                    {isVerification ? (
                      <>
                        <button
                          onClick={() => onSelectTicket(ticket)}
                          className="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Verify &amp; Confirm</span>
                        </button>
                        <span className="text-[10px] text-center text-amber-900 font-bold tracking-tight">
                          Requires Student Verification
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className="px-3.5 py-1.5 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#2a14b4] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#e2e8f0]"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>View Docket</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Resolution Note Alert Box (if available) */}
                {isVerification && (
                  <div className="mt-3 p-3 rounded-lg bg-white border border-amber-300/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">task_alt</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0b1c30]">
                          Officer Resolution Note (Er. Rakesh Kumar):
                        </span>
                        <p className="text-xs text-[#464554] mt-0.5">
                          "{ticket.resolutionProof?.actionTaken || 'Installed secondary Cisco AP-502 unit with 5GHz dedicated channel backhaul. Verified throughput at 112 Mbps across all 45 terminals. Please check ping latency in Lab 204 and click verify.'}"
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectTicket(ticket)}
                      className="shrink-0 px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                    >
                      Inspect Evidence
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

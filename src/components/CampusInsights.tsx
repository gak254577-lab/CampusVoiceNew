import React, { useState } from 'react';

export const CampusInsights: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('AY 2024–25 (Odd Sem)');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 90 Days');

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Department,Percentage,Tickets,Median Hours',
        'Wi-Fi & IT Infrastructure,38%,275,18.2',
        'Classrooms & Laboratories,24%,174,26.0',
        'Hostel & Residential Living,19%,137,31.4',
        'Cleanliness & Maintenance,12%,87,12.8',
        'Academic & Administration,7%,50,42.5',
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IMSEC_Statutory_Analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Operational Notice Bar */}
      <div className="mb-4 bg-[#eff4ff] rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">verified</span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs text-[#0b1c30] uppercase tracking-wider font-bold">
              Public Audit Dataset:
            </span>
            <span className="text-xs text-[#464554]">
              Synced every 6 hours under AICTE Student Grievance Redressal Regulation 2019 (Sec. 4/B).
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#464554] shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#005c54] animate-pulse"></span>
          <span>Registry Hash: 0x98EF…42A1 (Immutable Ledger)</span>
        </div>
      </div>

      {/* Page Header & Filtering Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs uppercase tracking-wider text-[#2a14b4] font-bold">
              IMS Engineering College — Institutional Accountability
            </span>
            <span className="text-[#c7c4d7]">/</span>
            <span className="text-xs text-[#464554] font-medium">Internal Audit Unit</span>
          </div>
          <h1 className="text-2xl sm:text-[30px] font-bold text-[#0b1c30] tracking-tight">
            Campus Insights &amp; Transparency Analytics
          </h1>
          <p className="text-sm text-[#464554] max-w-3xl mt-0.5 leading-relaxed">
            Public institutional accountability report, grievance trends, and redressal benchmarks for IMS Engineering College.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="appearance-none bg-white text-[#0b1c30] text-xs font-semibold pl-3 pr-8 py-2 rounded-lg border border-[#e2e8f0] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#4338ca] cursor-pointer"
            >
              <option>AY 2024–25 (Odd Sem)</option>
              <option>AY 2023–24 (Even Sem)</option>
              <option>AY 2023–24 (Odd Sem)</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-[#777586] absolute right-2 top-2 pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none bg-white text-[#0b1c30] text-xs font-semibold pl-3 pr-8 py-2 rounded-lg border border-[#e2e8f0] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#4338ca] cursor-pointer"
            >
              <option>Last 90 Days</option>
              <option>Last 30 Days</option>
              <option>Current Semester to Date</option>
              <option>Full Academic Year</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-[#777586] absolute right-2 top-2 pointer-events-none">
              calendar_view_day
            </span>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-[#2a14b4] hover:bg-[#4338ca] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Statutory Report (PDF/CSV)</span>
          </button>
        </div>
      </div>

      {/* Top Metrics KPI Banner (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#464554] font-bold">
                Total Redressal Rate
              </span>
              <span className="font-mono text-[32px] leading-tight font-bold text-[#0b1c30] mt-1">
                94.6%
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2a14b4] group-hover:bg-[#4338ca] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
          </div>
          <div className="mt-4 pt-1 flex items-center justify-between text-[#464554]">
            <span className="text-xs">
              <strong className="text-[#0b1c30] font-mono">684</strong> of 723 resolved
            </span>
            <span className="text-[11px] text-[#005c54] bg-[#eff4ff] px-2 py-0.5 rounded-full font-bold">
              Within SLA
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eff4ff]">
            <div className="h-full bg-[#2a14b4]" style={{ width: '94.6%' }}></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#464554] font-bold">
                Median Turnaround Time
              </span>
              <span className="font-mono text-[32px] leading-tight font-bold text-[#0b1c30] mt-1">
                28.5 <span className="text-sm font-sans text-[#464554]">Hours</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2a14b4] group-hover:bg-[#4338ca] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">timer</span>
            </div>
          </div>
          <div className="mt-4 pt-1 flex items-center justify-between">
            <span className="text-xs text-[#464554]">Statutory limit: 72 hrs</span>
            <span className="text-[11px] text-[#005c54] flex items-center font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -14% vs AY 23-24
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eff4ff]">
            <div className="h-full bg-[#005c54]" style={{ width: '39.5%' }}></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#464554] font-bold">
                Student Satisfaction
              </span>
              <span className="font-mono text-[32px] leading-tight font-bold text-[#0b1c30] mt-1">
                4.7 <span className="text-sm font-sans text-[#464554] font-normal">/ 5.0</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2a14b4] group-hover:bg-[#4338ca] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">star</span>
            </div>
          </div>
          <div className="mt-4 pt-1 flex items-center justify-between">
            <span className="text-xs text-[#464554]">Verified student ratings</span>
            <span className="text-[11px] text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded-full font-bold">
              512 Reviews
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eff4ff]">
            <div className="h-full bg-[#4338ca]" style={{ width: '94%' }}></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#464554] font-bold">
                Active In-Progress Cases
              </span>
              <span className="font-mono text-[32px] leading-tight font-bold text-[#0b1c30] mt-1">
                39 <span className="text-sm font-sans text-[#464554] font-normal">Cases</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2a14b4] group-hover:bg-[#4338ca] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 pt-1 flex items-center justify-between">
            <span className="text-xs text-[#464554]">0 overdue (&gt;7 days)</span>
            <span className="text-[11px] text-[#005c54] bg-[#eff4ff] px-2 py-0.5 rounded-full font-bold">
              0 Ombudsman
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eff4ff]">
            <div className="h-full bg-[#4f5c8e]" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Grid (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Domain Distribution & Monthly Trends */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Section 1: Grievance Distribution by Category */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0b1c30] tracking-tight">
                  Grievance Distribution by Functional Domain
                </h2>
                <p className="text-xs text-[#464554]">
                  Breakdown of 723 logged requests across administrative and facility verticals
                </p>
              </div>
              <span className="text-[11px] text-[#464554] font-mono bg-[#eff4ff] px-2 py-1 rounded self-start sm:self-center">
                SLA Target: ≤48h
              </span>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {/* Item 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">wifi</span>
                    <span className="text-xs font-bold text-[#0b1c30]">Wi-Fi &amp; IT Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#0b1c30] font-bold">38%</span>
                    <span className="text-[#777586]">(275 tickets)</span>
                    <span className="text-[#005c54] bg-[#eff4ff] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                      Median: 18.2h
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden">
                  <div className="h-full bg-[#2a14b4] rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">school</span>
                    <span className="text-xs font-bold text-[#0b1c30]">Classrooms &amp; Laboratories</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#0b1c30] font-bold">24%</span>
                    <span className="text-[#777586]">(174 tickets)</span>
                    <span className="text-[#005c54] bg-[#eff4ff] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                      Median: 26.0h
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden">
                  <div className="h-full bg-[#4338ca] rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">apartment</span>
                    <span className="text-xs font-bold text-[#0b1c30]">Hostel &amp; Residential Living</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#0b1c30] font-bold">19%</span>
                    <span className="text-[#777586]">(137 tickets)</span>
                    <span className="text-[#005c54] bg-[#eff4ff] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                      Median: 31.4h
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden">
                  <div className="h-full bg-[#4f5c8e] rounded-full" style={{ width: '19%' }}></div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">cleaning_services</span>
                    <span className="text-xs font-bold text-[#0b1c30]">Cleanliness &amp; Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#0b1c30] font-bold">12%</span>
                    <span className="text-[#777586]">(87 tickets)</span>
                    <span className="text-[#005c54] bg-[#eff4ff] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                      Median: 12.8h
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden">
                  <div className="h-full bg-[#005c54] rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">description</span>
                    <span className="text-xs font-bold text-[#0b1c30]">Academic &amp; Administration</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#0b1c30] font-bold">7%</span>
                    <span className="text-[#777586]">(50 tickets)</span>
                    <span className="text-[#005c54] bg-[#eff4ff] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                      Median: 42.5h
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden">
                  <div className="h-full bg-[#b7c4fd] rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>

            {/* Metric insight footline */}
            <div className="mt-6 pt-3 bg-[#eff4ff] rounded-lg p-3 flex items-center justify-between border border-[#e2e8f0]">
              <div className="flex items-center gap-1.5 text-[#0b1c30]">
                <span className="material-symbols-outlined text-[#2a14b4] text-[18px]">speed</span>
                <span className="text-xs font-medium">
                  Fastest Resolved Category: Cleanliness &amp; Sanitization (12.8 hrs avg)
                </span>
              </div>
              <span className="text-xs text-[#2a14b4] font-bold">View Category SLA Policy →</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Department Performance & Audit Feed */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Institutional SLA Compliance by Department */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">domain_verification</span>
                <h3 className="text-sm font-bold text-[#0b1c30]">Standing Cell Compliance</h3>
              </div>
              <span className="font-mono text-[10px] text-[#005c54] font-bold bg-[#89f5e7]/40 px-2 py-0.5 rounded">
                AY 2024–25
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { dept: 'IT & Multimedia Infrastructure Cell', rate: 98.4, avg: '18.2 hrs' },
                { dept: 'Estate Maintenance & Power Works', rate: 96.5, avg: '22.0 hrs' },
                { dept: 'Hostel & Residential Welfare', rate: 92.1, avg: '31.4 hrs' },
                { dept: 'Academic & Examination Registrar', rate: 99.0, avg: '14.5 hrs' },
              ].map((cell, idx) => (
                <div key={idx} className="p-3 bg-[#eff4ff] rounded-lg border border-[#e2e8f0] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0b1c30]">{cell.dept}</span>
                    <span className="font-mono text-xs font-bold text-[#2a14b4]">{cell.rate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#d3e4fe] overflow-hidden">
                    <div className="h-full bg-[#4338ca] rounded-full" style={{ width: `${cell.rate}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#777586]">
                    <span>Average Turnaround</span>
                    <span className="font-mono font-semibold text-[#0b1c30]">{cell.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AICTE Statutory Accountability Guarantee */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005c54] text-[22px]">policy</span>
              <h3 className="text-sm font-bold text-[#0b1c30]">AICTE Regulation Guarantee</h3>
            </div>
            <p className="text-xs text-[#464554] leading-relaxed">
              In accordance with AICTE Gazette Notification F.No. 1-101/PGRC/AICTE/Regulation/2019, any complaint remaining pending past 7 business days automatically escalates to the Ombudsman Directorate with statutory reporting to state grievance bodies.
            </p>
            <div className="p-3 rounded-lg bg-[#eff4ff] flex items-center justify-between font-mono text-xs text-[#2a14b4] font-bold border border-[#e2e8f0]">
              <span>Zero Cases Beyond Level-3</span>
              <span className="text-[#005c54]">100% Audit Cleared</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

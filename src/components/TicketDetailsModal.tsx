import React, { useState } from 'react';
import { ComplaintTicket, UserProfile } from '../types';

interface TicketDetailsModalProps {
  ticket: ComplaintTicket | null;
  profile: UserProfile | null;
  onClose: () => void;
  onVerifyClose: (ticketId: string, rating: number, feedback: string) => Promise<void>;
  onRejectEscalate: (ticketId: string, reason: string) => Promise<void>;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  profile,
  onClose,
  onVerifyClose,
  onRejectEscalate,
}) => {
  if (!ticket) return null;

  const [rating, setRating] = useState<number>(5);
  const [concurrence, setConcurrence] = useState(true);
  const [feedback, setFeedback] = useState('Tested in CS Lab 204 during practical hours. Signal is stable at ~110 Mbps. Thanks for the quick replacement!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const studentName = profile?.name || 'Aanya Sharma';
  const rollNumber = profile?.rollNumber || '2101430100042';

  const isResolved = ticket.status === 'Resolved';
  const isVerificationRequired = ticket.status === 'Resolution Submitted';

  const handleCertify = async () => {
    if (!concurrence) {
      alert('Please check the verification concurrence before certifying closure.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onVerifyClose(ticket.id, rating, feedback);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    const reason = prompt('Please specify the reason for escalation to the Head of Department:');
    if (!reason) return;
    setIsRejecting(true);
    try {
      await onRejectEscalate(ticket.id, reason);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#f8f9ff] w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl border border-[#c7c4d7]/60 overflow-y-auto flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2a14b4] text-[22px]">policy</span>
            <span className="font-mono text-xs font-bold text-[#0b1c30]">
              IMSEC OFFICIAL DOCKET // {ticket.ticketId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#464554] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Top Breadcrumb & Action Required Flag */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <nav className="flex items-center gap-2 text-[#464554] text-xs font-semibold">
                <span>My Tickets</span>
                <span className="text-[#c7c4d7]">/</span>
                <span className="font-mono text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#e2e8f0]">
                  #{ticket.ticketId}
                </span>
              </nav>

              {isVerificationRequired && (
                <div className="flex items-center gap-1.5 bg-[#ffdad6]/60 text-[#93000a] px-3 py-1 rounded-full border border-[#ba1a1a]/20">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] animate-pulse">timer</span>
                  <span className="text-[11px] tracking-wide uppercase font-bold">Action Required by Complainant</span>
                  <span className="w-1 h-1 rounded-full bg-[#ba1a1a]/40"></span>
                  <span className="font-mono text-[11px] text-[#0b1c30]">Auto-closure in 34 hrs if unverified</span>
                </div>
              )}
            </div>

            {/* Master Title */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight leading-tight max-w-4xl">
                  {ticket.title}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                    isVerificationRequired
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : isResolved
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-[#eff4ff] text-[#2a14b4] border border-[#d3e4fe]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  {ticket.status}
                </span>
              </div>

              {/* Attributes Stream */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md text-[#0b1c30] border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#2a14b4]">lan</span>
                  <span className="font-semibold">{ticket.category}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md text-[#0b1c30] border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#4f5c8e]">meeting_room</span>
                  <span>{ticket.building || 'Academic Block A'} {ticket.room ? `• ${ticket.room}` : ''}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md text-[#0b1c30] border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#777586]">schedule</span>
                  <span className="font-mono text-[11px]">
                    Filed: {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {ticket.severity === 'Urgent' && (
                  <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-md font-bold text-[11px]">
                    <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">priority_high</span>
                    <span>Urgent (Statutory 24h SLA)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid Layout (8 cols left, 4 cols right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Resolution Proof & Verification */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* 1. SIGNATURE RESOLUTION PROOF DOCKET */}
              <section className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#005c54] via-[#4338ca] to-[#89f5e7]"></div>
                <div className="p-5 sm:p-6 flex flex-col gap-4">
                  {/* Card Header & Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#005c54]/10 flex items-center justify-center text-[#005c54]">
                        <span className="material-symbols-outlined text-[24px]">verified_user</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-[#0b1c30]">
                            Officer Resolution Report &amp; Evidence Docket
                          </h2>
                          <span className="bg-[#89f5e7]/40 text-[#00201d] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            AICTE Audit Ready
                          </span>
                        </div>
                        <span className="text-xs text-[#464554]">
                          Official technical intervention logged under Regulation Sec-4
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[#464554] bg-[#eff4ff] px-2.5 py-1 rounded border border-[#e2e8f0]">
                      Log ID: {ticket.resolutionProof?.logId || 'RES-2024-8841-A'}
                    </span>
                  </div>

                  {/* Handled by Officer Section */}
                  <div className="bg-[#eff4ff]/70 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 border border-[#e2e8f0]/80">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#4338ca] text-white flex items-center justify-center font-bold text-base shadow-xs">
                        RK
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0b1c30]">
                          {ticket.resolutionProof?.officerName || 'Er. Rakesh Kumar'}
                        </span>
                        <span className="text-xs text-[#2a14b4] font-medium">
                          {ticket.resolutionProof?.officerRole || 'Senior Network Administrator, IT Infrastructure Cell'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-[#777586]">Intervention Timestamp</span>
                      <span className="font-mono text-xs font-bold text-[#0b1c30]">
                        {ticket.resolutionProof?.interventionTimestamp || '24 Oct 2024, 11:38 AM IST'}
                      </span>
                    </div>
                  </div>

                  {/* Corrective Action Implemented */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#464554]">
                      Corrective Action Implemented
                    </span>
                    <div className="bg-[#f8f9ff] p-3.5 rounded-lg text-[#0b1c30] text-xs leading-relaxed border border-[#e2e8f0]">
                      {ticket.resolutionProof?.actionTaken || (
                        <>
                          Replaced faulty <span className="font-semibold text-[#2a14b4] font-mono">Cisco AP-502</span> access point with high-density dual-band enterprise <span className="font-semibold text-[#2a14b4] font-mono">Aruba AP-515</span>. Re-terminated RJ45 patch cable on switch rack 2, port 18 to eliminate CRC transmission errors. Signal strength surveyed and calibrated at <span className="font-mono font-bold text-[#005c54]">-52 dBm</span> across all 45 operational terminals. Bandwidth provisioned and confirmed at <span className="font-mono font-bold text-[#005c54]">112 Mbps symmetric</span> with prioritized educational QoS packets.
                        </>
                      )}
                    </div>
                  </div>

                  {/* Evidence Gallery: Photo + Telemetry SVG Chart */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-[#464554]">
                        Verified Photographic &amp; Telemetry Evidence
                      </span>
                      <span className="font-mono text-[11px] text-[#005c54] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span> SHA-256 Hash Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Proof 1: Hardware Photo */}
                      <div className="rounded-xl bg-[#eff4ff] overflow-hidden border border-[#e2e8f0] flex flex-col">
                        <div className="relative h-44 w-full bg-[#cbdbf5] overflow-hidden">
                          <img
                            alt="Hardware replacement"
                            src={ticket.resolutionProof?.photoProofUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFXK7AHK_zU87UjPXOqa8_y-dnqS6zH1s4K8PZUdj-T_tby0a8Ef7eoFOpIp6QhrepPXuXEHi2qt-5HMIdE6LwRJlpcS4OVN9WDuextcH9Zx6mB8_28D9qCGFHZZueWkoCo0FX09OuazMF-JMYDHEVznVcpjEg8Mp9M0rYZO7LTlGSJXRR1_sLboebFvYKTwvd-uZXNiMNZqQ4CvWuFckub3BhceIrLdQXumkbmR-zlEUKmvGpykU'}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-[#0b1c30]/85 text-white font-mono text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#89f5e7]">sensors</span>
                            CAM-PROOF-01
                          </div>
                          <button
                            onClick={() => window.open(ticket.resolutionProof?.photoProofUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFXK7AHK_zU87UjPXOqa8_y-dnqS6zH1s4K8PZUdj-T_tby0a8Ef7eoFOpIp6QhrepPXuXEHi2qt-5HMIdE6LwRJlpcS4OVN9WDuextcH9Zx6mB8_28D9qCGFHZZueWkoCo0FX09OuazMF-JMYDHEVznVcpjEg8Mp9M0rYZO7LTlGSJXRR1_sLboebFvYKTwvd-uZXNiMNZqQ4CvWuFckub3BhceIrLdQXumkbmR-zlEUKmvGpykU', '_blank')}
                            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-[#0b1c30] text-[11px] font-semibold px-2 py-1 rounded shadow-xs flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                            <span>View Full Resolution</span>
                          </button>
                        </div>
                        <div className="p-3 flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#0b1c30]">
                            Installed Aruba AP-515 ceiling mount in Lab 204
                          </span>
                          <span className="text-[11px] text-[#464554]">
                            Active Gigabit Link verified via Rack-02 PoE+ switch port 18.
                          </span>
                          <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#777586]">
                            <span>GPS: 28.6732° N, 77.4411° E</span>
                            <span className="text-[#005c54] font-semibold">✓ Geofence Matched</span>
                          </div>
                        </div>
                      </div>

                      {/* Proof 2: Speedtest Telemetry SVG Benchmark */}
                      <div className="rounded-xl bg-[#213145] overflow-hidden border border-[#0b1c30] flex flex-col p-3.5 text-[#eaf1ff] justify-between">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-[#89f5e7]">speed</span>
                            <span className="font-mono text-xs font-bold text-[#89f5e7]">
                              Iperf3 &amp; Ookla Telemetry Benchmark
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-white/60">LAB-CS-CLIENT-42</span>
                        </div>

                        {/* Inline Throughput Sparkline SVG */}
                        <div className="relative w-full h-24 my-2 flex flex-col justify-end">
                          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 80">
                            <defs>
                              <linearGradient id="modalGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#89f5e7" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#89f5e7" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <line stroke="#464554" strokeDasharray="2 2" strokeOpacity="0.5" x1="0" x2="300" y1="20" y2="20" />
                            <line stroke="#464554" strokeDasharray="2 2" strokeOpacity="0.5" x1="0" x2="300" y1="50" y2="50" />
                            <path d="M0,75 L20,70 L40,68 L60,45 L80,25 L100,22 L140,20 L180,24 L220,18 L260,20 L300,19 L300,80 L0,80 Z" fill="url(#modalGradient)" />
                            <path d="M0,75 L20,70 L40,68 L60,45 L80,25 L100,22 L140,20 L180,24 L220,18 L260,20 L300,19" fill="none" stroke="#6bd8cb" strokeLinecap="round" strokeWidth="2.5" />
                            <circle cx="220" cy="18" fill="#ffffff" r="4" stroke="#005c54" strokeWidth="2" />
                          </svg>
                          <div className="flex justify-between items-center text-[10px] font-mono text-white/60 mt-1">
                            <span>00:00 (Pre-Fix 4Mbps)</span>
                            <span className="text-[#89f5e7] font-bold">112.4 Mbps (Post Replacement)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-white/10">
                          <span className="text-[#89f5e7]">Packet Loss: 0.00%</span>
                          <span className="text-white/80">Jitter: 0.8ms</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attached Diagnostics Files */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-[#e2e8f0]">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#464554]">
                      Attached Technical Diagnostics &amp; Audit Logs
                    </span>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => alert('Downloading AP_diagnostics_oct24.pdf (1.2 MB)')}
                        className="flex items-center gap-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] px-3 py-2 rounded-lg text-[#0b1c30] transition-colors border border-[#e2e8f0] text-left"
                      >
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">picture_as_pdf</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold">AP_diagnostics_oct24.pdf</span>
                          <span className="text-[10px] text-[#777586]">1.2 MB • Aruba OS Log Export</span>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-[#777586] ml-2">download</span>
                      </button>

                      <button
                        onClick={() => alert('Downloading ping_test_lab204.csv (42 KB)')}
                        className="flex items-center gap-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] px-3 py-2 rounded-lg text-[#0b1c30] transition-colors border border-[#e2e8f0] text-left"
                      >
                        <span className="material-symbols-outlined text-[#005c54] text-[20px]">table_view</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold">ping_test_lab204.csv</span>
                          <span className="text-[10px] text-[#777586]">42 KB • 1,500 ICMP Samples</span>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-[#777586] ml-2">download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. COMPLAINANT VERIFICATION & CERTIFICATION PANEL */}
              <section className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#2a14b4] text-[24px]">
                      assignment_turned_in
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#0b1c30]">
                        Student Verification &amp; Docket Certification
                      </h2>
                      <span className="text-xs text-[#464554]">
                        Statutory AICTE Step 5/6: Mandatory complainant concurrence
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] bg-[#dce1ff] text-[#071747] font-bold px-2 py-0.5 rounded">
                    {studentName} ({rollNumber})
                  </span>
                </div>

                {isResolved ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-[24px]">verified</span>
                    <div>
                      <strong className="block text-sm">Grievance Formally Certified &amp; Closed</strong>
                      <span>Verified by complainant with {rating}-star rating. Audit archived into institutional ledger.</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Prompt & Rating */}
                    <div className="bg-[#eff4ff] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#e2e8f0]">
                      <div>
                        <label className="text-sm font-bold text-[#0b1c30] block">
                          Has your grievance been satisfactorily resolved in Lab 204?
                        </label>
                        <span className="text-xs text-[#464554]">
                          Your certification formally archives this complaint in the institutional registry.
                        </span>
                      </div>

                      {/* 5-Star Rating */}
                      <div className="flex flex-col items-start md:items-end gap-1">
                        <span className="text-[11px] font-bold text-[#464554] uppercase">
                          Intervention Quality Rating
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="text-amber-500 hover:scale-110 transition-transform p-0.5"
                            >
                              <span
                                className="material-symbols-outlined text-[26px]"
                                style={{ fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                star
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Concurrence Checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={concurrence}
                        onChange={(e) => setConcurrence(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#4338ca] rounded focus:ring-[#4338ca] accent-[#4338ca]"
                      />
                      <span className="text-xs text-[#0b1c30] leading-relaxed">
                        I confirm that the service disruption in Lab 204 has been physically resolved, and I have tested network connectivity on campus terminal systems.
                      </span>
                    </label>

                    {/* Student Feedback Textarea */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#0b1c30]">
                        Student Closure Comments (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide feedback on promptness or resolution quality..."
                        className="w-full bg-[#eff4ff]/40 p-2.5 rounded-lg text-xs text-[#0b1c30] border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleEscalate}
                        disabled={isRejecting}
                        className="px-4 py-2 rounded-lg bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#ba1a1a]/20"
                      >
                        <span className="material-symbols-outlined text-[16px]">priority_high</span>
                        <span>Reject &amp; Escalate to HOD</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCertify}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-[#005c54] hover:bg-[#00423c] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                            <span>Certifying Docket...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            <span>Certify &amp; Formally Close Ticket</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column (4 cols): Chronology & Audit Chain */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Chronology & Audit Chain */}
              <div className="rounded-xl bg-white p-5 shadow-xs border border-[#e2e8f0] flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#e2e8f0]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">account_tree</span>
                    <h3 className="text-sm font-bold text-[#0b1c30]">Redressal Chronology</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#eff4ff] text-[#2a14b4] px-2 py-0.5 rounded">
                    AICTE Trace
                  </span>
                </div>

                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#d3e4fe]">
                  {/* Step 1 */}
                  <div className="relative flex flex-col gap-0.5">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#16a34a] ring-4 ring-emerald-100 flex items-center justify-center text-white text-[8px]">
                      ✓
                    </span>
                    <span className="text-xs font-bold text-[#0b1c30]">Grievance Lodged</span>
                    <span className="font-mono text-[10px] text-[#777586]">24 Oct, 09:42 AM • Digital Sign</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex flex-col gap-0.5">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#16a34a] ring-4 ring-emerald-100 flex items-center justify-center text-white text-[8px]">
                      ✓
                    </span>
                    <span className="text-xs font-bold text-[#0b1c30]">Automated Triaging &amp; Dispatch</span>
                    <span className="font-mono text-[10px] text-[#777586]">24 Oct, 09:43 AM • IT Cell Cell</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex flex-col gap-0.5">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#16a34a] ring-4 ring-emerald-100 flex items-center justify-center text-white text-[8px]">
                      ✓
                    </span>
                    <span className="text-xs font-bold text-[#0b1c30]">On-Site Intervention Commenced</span>
                    <span className="font-mono text-[10px] text-[#777586]">24 Oct, 10:15 AM • Er. Rakesh Kumar</span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex flex-col gap-0.5">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#4338ca] ring-4 ring-[#e3dfff]"></span>
                    <span className="text-xs font-bold text-[#2a14b4]">Resolution Docket Uploaded</span>
                    <span className="font-mono text-[10px] text-[#777586]">24 Oct, 11:38 AM • Proof Hash OK</span>
                  </div>

                  {/* Step 5 */}
                  <div className="relative flex flex-col gap-0.5 opacity-60">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#c7c4d7] ring-4 ring-[#eff4ff]"></span>
                    <span className="text-xs font-semibold text-[#0b1c30]">Complainant Final Concurrence</span>
                    <span className="font-mono text-[10px] text-[#777586]">Pending Student Sign-off</span>
                  </div>
                </div>
              </div>

              {/* SLA Guarantee Card */}
              <div className="rounded-xl bg-[#eff4ff] p-4 border border-[#e2e8f0] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">24-Hour Resolution Guarantee</span>
                  <span className="font-mono text-[11px] font-bold text-[#005c54]">ON TRACK</span>
                </div>
                <div className="w-full bg-[#d3e4fe] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4338ca] h-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-[11px] text-[#464554] mt-0.5">
                  Elapsed: <strong className="text-[#0b1c30]">18.2 Hours</strong> of 24.0 Allowed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

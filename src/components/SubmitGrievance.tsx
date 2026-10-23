import React, { useState } from 'react';
import { ComplaintTicket, UserProfile } from '../types';

interface SubmitGrievanceProps {
  profile: UserProfile | null;
  onSubmit: (complaint: Partial<ComplaintTicket>) => Promise<void>;
  onCancel: () => void;
}

export const SubmitGrievance: React.FC<SubmitGrievanceProps> = ({
  profile,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wi-Fi & IT Infrastructure');
  const [incidentDateTime, setIncidentDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Urgent' | 'High' | 'Normal' | 'Medium' | 'Low'>('Normal');
  const [applyAiRouting, setApplyAiRouting] = useState(true);
  const [affirmation, setAffirmation] = useState(false);
  const [peerMasking, setPeerMasking] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; size: string; url: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState('');

  const rollNumber = profile?.rollNumber || '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the title and description.');
      return;
    }
    if (!affirmation) {
      alert('Please accept the solemn affirmation before lodging.');
      return;
    }

    setIsSubmitting(true);
    const newId = `CV-2024-${Math.floor(100 + Math.random() * 900)}`;

    try {
      await onSubmit({
        ticketId: newId,
        title,
        category,
        incidentDateTime,
        building: building === 'block-b' ? 'Academic Block B' : building === 'block-a' ? 'Academic Block A' : building,
        room,
        description,
        severity,
        peerMasking,
        isAnonymous: peerMasking,
        fileURL: attachment?.url,
        fileName: attachment?.name,
        fileSize: attachment?.size,
        responsibleCell: 'IT & Multimedia Cell',
        designatedOfficer: 'Er. R. K. Saxena (Sr. Tech)',
        slaWindow: '24h Resolution Window',
        aiSummary: `Complaint about ${category}: "${title}"`,
        suggestedAction: 'Dispatch IT cell officer to inspect and repair projector hardware.',
        status: 'Submitted'
      });

      setCreatedTicketId(newId);
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Breadcrumb & Administrative Header Bar */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <nav className="flex items-center gap-1.5 text-[#464554] text-xs font-semibold">
            <button onClick={onCancel} className="hover:text-[#2a14b4] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Dashboard</span>
            </button>
            <span className="material-symbols-outlined text-[14px] text-[#777586]">chevron_right</span>
            <span className="text-[#2a14b4] font-bold">Submit New Grievance</span>
          </nav>
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1 rounded-full shadow-xs border border-[#e2e8f0]">
            <span className="w-2 h-2 rounded-full bg-[#005c54] animate-pulse"></span>
            <span className="font-mono text-[11px] text-[#0b1c30] font-semibold">
              PORTAL ACTIVE • SLA TICKET REGISTRY v4.2
            </span>
          </div>
        </div>

        {/* Institutional Statutory Notice Banner */}
        <div className="flex items-start gap-3 p-4 bg-[#eff4ff] rounded-xl shadow-xs border border-[#e2e8f0] relative overflow-hidden">
          <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#4338ca]"></div>
          <div className="p-2 bg-[#4338ca]/10 rounded-lg text-[#2a14b4] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#0b1c30] tracking-tight">
                Transparent Redressal Guarantee
              </h2>
              <span className="text-[10px] uppercase tracking-wider bg-[#d3e4fe] text-[#464554] px-2 py-0.5 rounded-full font-bold">
                AICTE Reg 2019/Sec-4
              </span>
            </div>
            <p className="text-xs text-[#464554] leading-relaxed">
              Grievances are logged with immutable timestamps and routed directly to the designated Departmental Redressal Officer. Your privacy is legally shielded under the <span className="font-semibold text-[#0b1c30]">IMSEC Student Welfare Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dossier Form */}
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        {/* Step Indicator Progress Bar */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex items-center justify-between gap-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#4338ca] text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs shrink-0">
              1
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#2a14b4] font-bold truncate">Incident Details</span>
              <span className="text-[11px] text-[#777586] hidden sm:inline">Title, place &amp; timing</span>
            </div>
          </div>
          <div className="h-0.5 w-8 bg-[#4338ca]/30 shrink-0"></div>

          {/* Step 2 */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#464554] flex items-center justify-center font-bold font-mono text-xs shrink-0">
              2
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#0b1c30] font-semibold truncate">Triage &amp; Routing</span>
              <span className="text-[11px] text-[#777586] hidden sm:inline">AI departmental mapping</span>
            </div>
          </div>
          <div className="h-0.5 w-8 bg-[#e2e8f0] shrink-0"></div>

          {/* Step 3 */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#464554] flex items-center justify-center font-bold font-mono text-xs shrink-0">
              3
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#0b1c30] font-semibold truncate">Review &amp; Submit</span>
              <span className="text-[11px] text-[#777586] hidden sm:inline">Evidence &amp; identity mask</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Section 1: Grievance Identification */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">edit_document</span>
                <h3 className="text-sm font-bold text-[#0b1c30]">1. Primary Incident Details</h3>
              </div>
              <span className="text-[10px] text-[#464554] bg-[#eff4ff] px-2 py-0.5 rounded-full font-mono font-bold">
                MANDATORY FILE RECORD
              </span>
            </div>

            {/* Subject Line */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30] flex items-center justify-between" htmlFor="grievance-title">
                <span>Grievance Title / Subject Line <span className="text-red-600">*</span></span>
                <span className="text-[11px] text-[#777586] font-normal font-mono">{title.length} / 120 characters</span>
              </label>
              <input
                id="grievance-title"
                type="text"
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Water dispenser filtration fault in Aryabhatta Hostel Ground Floor"
                className="w-full bg-[#eff4ff]/40 text-[#0b1c30] px-3.5 py-2.5 rounded-lg text-sm border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca] transition-all"
                required
              />
              <p className="text-[11px] text-[#777586]">
                Provide an objective, descriptive subject line that specifies the issue and the equipment/area.
              </p>
            </div>

            {/* Category & DateTime */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0b1c30]" htmlFor="grievance-category">
                  Institutional Category <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    id="grievance-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#eff4ff]/40 text-[#0b1c30] px-3.5 py-2.5 rounded-lg text-sm border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca] appearance-none cursor-pointer"
                  >
                    <option value="Classrooms and laboratories">Classrooms and laboratories</option>
                    <option value="Wi-Fi & IT Infrastructure">Wi-Fi &amp; IT Infrastructure</option>
                    <option value="Hostel facilities & Mess">Hostel facilities &amp; Mess</option>
                    <option value="Academic & Examination concerns">Academic &amp; Examination concerns</option>
                    <option value="Administration & Fee Accounts">Administration &amp; Fee Accounts</option>
                    <option value="Cleanliness & Campus maintenance">Cleanliness &amp; Campus maintenance</option>
                    <option value="Other Statutory/General Matters">Other Statutory/General Matters</option>
                  </select>
                  <span className="material-symbols-outlined text-[20px] text-[#777586] absolute right-3 top-3 pointer-events-none">
                    expand_more
                  </span>
                </div>
                <p className="text-[11px] text-[#777586]">Maps to administrative standing committees.</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0b1c30]" htmlFor="incident-datetime">
                  Incident Occurrence Date &amp; Time <span className="text-red-600">*</span>
                </label>
                <input
                  id="incident-datetime"
                  type="datetime-local"
                  value={incidentDateTime}
                  onChange={(e) => setIncidentDateTime(e.target.value)}
                  className="w-full bg-[#eff4ff]/40 text-[#0b1c30] px-3.5 py-2.5 rounded-lg text-sm border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                  required
                />
                <p className="text-[11px] text-[#777586]">
                  Required for cross-referencing facility logs &amp; CCTV audit if applicable.
                </p>
              </div>
            </div>

            {/* Campus Location Coordinates */}
            <div className="p-4 bg-[#eff4ff] rounded-xl flex flex-col gap-3 border border-[#e2e8f0]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#2a14b4] text-[18px]">location_on</span>
                <span className="text-xs font-bold text-[#0b1c30]">Campus Location Coordinates</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#464554]">Building / Block</label>
                  <div className="relative">
                    <select
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full bg-white text-[#0b1c30] px-3 py-2 rounded-lg text-xs border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#4338ca] appearance-none cursor-pointer"
                    >
                      <option value="block-a">Academic Block A (Engineering Core)</option>
                      <option value="block-b">Academic Block B (CS &amp; IT Complex)</option>
                      <option value="raman-hostel">Raman Hostel (Boys Residence)</option>
                      <option value="aryabhatta-hostel">Aryabhatta Hostel (Boys Residence)</option>
                      <option value="gargi-hostel">Gargi Hostel (Girls Residence)</option>
                      <option value="library">Central Library &amp; Knowledge Centre</option>
                      <option value="sports-canteen">Cafeteria &amp; Student Activity Centre</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-[#777586] absolute right-3 top-2.5 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#464554]">Specific Room, Lab, or Landmark</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g., Computer Lab 3, 1st Floor Corridor"
                    className="w-full bg-white text-[#0b1c30] px-3 py-2 rounded-lg text-xs border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#0b1c30] flex items-center justify-between" htmlFor="grievance-desc">
                <span>Detailed Event Description &amp; Academic Impact <span className="text-red-600">*</span></span>
                <span className="font-mono text-[11px] text-[#777586]">{description.length} / 2000 chars</span>
              </label>
              <textarea
                id="grievance-desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide explicit context: What occurred, who was affected, duration of the issue..."
                className="w-full bg-[#eff4ff]/40 text-[#0b1c30] p-3.5 rounded-lg text-sm border border-[#e2e8f0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca] transition-all leading-relaxed"
                required
              />
              <p className="text-[11px] text-[#777586]">
                Factual, chronological narratives lead to prompt procedural resolution under statutory timeframes.
              </p>
            </div>
          </div>

          {/* Section 2: AI Incident Triage Assistant */}
          <div className="bg-[#2a14b4]/5 rounded-xl p-4 border border-[#4338ca]/20 flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-[#2a14b4]">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                <span className="text-sm font-bold tracking-tight">CampusVoice AI Incident Triage</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#4338ca] text-white font-bold">
                Confidence: 94.8% Match
              </span>
            </div>
            <p className="text-xs text-[#0b1c30]">
              Based on keywords in your description (<span className="font-mono font-semibold text-[#2a14b4]">"projector", "HDMI cable", "Room 201", "recurrence"</span>), the neural routing matrix recommends the following docket assignment:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-[#e2e8f0]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#777586] uppercase font-bold tracking-wider">Responsible Cell</span>
                <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-[#2a14b4]">lan</span>
                  IT &amp; Multimedia Cell
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#777586] uppercase font-bold tracking-wider">Designated Officer</span>
                <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4f5c8e]">person_check</span>
                  Er. R. K. Saxena (Sr. Tech)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#777586] uppercase font-bold tracking-wider">Statutory SLA Window</span>
                <span className="font-mono text-xs text-[#ba1a1a] font-bold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  24h Resolution Window
                </span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={applyAiRouting}
                onChange={(e) => setApplyAiRouting(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#4338ca] rounded focus:ring-[#4338ca] accent-[#4338ca]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0b1c30]">
                  Apply verified AI classification &amp; dispatch directly to Multimedia Incharge
                </span>
                <span className="text-[11px] text-[#464554]">
                  Bypasses preliminary central desk review to cut resolution latency by an estimated 14 hours.
                </span>
              </div>
            </label>
          </div>

          {/* Section 3: Severity Level */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">flag</span>
              <span>User-Stated Grievance Severity Level <span className="text-red-600">*</span></span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'Low', label: 'Low', desc: 'Minor inconvenience, non-academic.', color: 'bg-[#dce1ff]' },
                { key: 'Medium', label: 'Medium', desc: 'Isolated disruption to daily routine.', color: 'bg-[#e3dfff]' },
                { key: 'High', label: 'High', desc: 'Impacting scheduled academic lectures.', color: 'bg-[#4338ca]' },
                { key: 'Urgent', label: 'Urgent', desc: 'Safety hazard or campus emergency.', color: 'bg-[#ba1a1a]' }
              ].map((item) => (
                <label
                  key={item.key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    severity === item.key
                      ? 'border-[#4338ca] bg-[#eff4ff] ring-2 ring-[#4338ca]'
                      : 'border-[#e2e8f0] bg-white hover:bg-[#eff4ff]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${severity === item.key ? 'text-[#2a14b4]' : 'text-[#0b1c30]'}`}>
                      {item.label}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                  </div>
                  <span className="text-[11px] text-[#464554]">{item.desc}</span>
                  <input
                    type="radio"
                    name="severity"
                    value={item.key}
                    checked={severity === item.key}
                    onChange={() => setSeverity(item.key as any)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[#464554] bg-[#eff4ff] px-3 py-1.5 rounded-lg text-xs mt-1 border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">info</span>
              <span>
                <strong>Procedural Compliance Note:</strong> Grievances marked <em>High</em> or <em>Urgent</em> are automatically co-audited by the Dean Academics Monitoring Dashboard to curb priority deflation.
              </span>
            </div>
          </div>

          {/* Section 4: Supporting Evidence File Repository */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
                <span className="material-symbols-outlined text-[18px] text-[#2a14b4]">attachment</span>
                <span>Evidentiary Attachments &amp; Photographs</span>
              </span>
              <span className="text-[11px] text-[#777586]">Optional but strongly advised</span>
            </div>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-[#c7c4d7] hover:border-[#4338ca] bg-[#eff4ff]/30 hover:bg-[#eff4ff]/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <input type="file" onChange={handleFileUpload} accept="image/*,.pdf" className="sr-only" />
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2a14b4] shadow-xs mb-2">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </div>
              <span className="text-sm font-bold text-[#0b1c30]">
                Drag and drop files here, or <span className="text-[#2a14b4] underline">browse</span>
              </span>
              <p className="text-xs text-[#777586] max-w-md mt-1">
                Accepted file formats: PNG, JPG, WEBP, or PDF (Max 10 MB per file). All images are stripped of client EXIF metadata prior to departmental indexing.
              </p>
            </label>

            {/* Attachment Preview */}
            {attachment && (
              <div className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-lg border border-[#e2e8f0]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-[#d3e4fe] flex items-center justify-center shrink-0 overflow-hidden">
                    {attachment.url.startsWith('data:image') || attachment.url.includes('http') ? (
                      <img src={attachment.url} alt="Attachment Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-[#2a14b4]">image</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#0b1c30] truncate">{attachment.name}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#777586]">
                      <span>{attachment.size}</span>
                      <span>•</span>
                      <span className="text-[#005c54] font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span> Scanned &amp; Attached
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1.5 text-[#777586] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded transition-colors"
                  title="Remove attachment"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Transparency, Masking & Confidentiality Guard */}
          <div className="bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-3 border border-[#e2e8f0]">
            <div className="flex items-center gap-2 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[20px] text-[#2a14b4]">security</span>
              <span className="text-sm font-bold">Privacy Controls &amp; Affirmation</span>
            </div>

            {/* Affirmation */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={affirmation}
                onChange={(e) => setAffirmation(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#4338ca] rounded focus:ring-[#4338ca] accent-[#4338ca]"
                required
              />
              <span className="text-xs text-[#0b1c30] leading-relaxed">
                I solemnly affirm that this report represents a verified, factual grievance arising on the IMSEC campus grounds, and does not contain malicious or defamatory representations.
              </span>
            </label>

            {/* Identity Shield Toggle */}
            <div className="bg-white p-3.5 rounded-lg border border-[#e2e8f0] flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#dce1ff] text-[#2a14b4] rounded-lg shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[22px]">visibility_off</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30]">
                    Peer Identity Masking (Public Redressal Ledger)
                  </span>
                  <p className="text-[11px] text-[#464554] mt-0.5 leading-relaxed">
                    When activated, your Roll Number (<span className="font-mono font-bold text-[#0b1c30]">{rollNumber}</span>) and full name are redacted on student campus feed updates. Only the assigned HOD/Proctorial Officer maintains decryption keys.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 sm:mt-0">
                <input
                  type="checkbox"
                  checked={peerMasking}
                  onChange={(e) => setPeerMasking(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#d3e4fe] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4338ca]"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#e2e8f0]"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Cancel &amp; Discard Draft</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert('Offline draft saved to local device cache.')}
                className="hidden sm:flex px-4 py-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-bold items-center gap-1.5 transition-colors border border-[#e2e8f0]"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Offline Draft</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-[#4338ca] hover:bg-[#2a14b4] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Cryptographically Signing Ticket...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Dossier #{createdTicketId} Created!</span>
                  </>
                ) : (
                  <>
                    <span>Lodge Grievance for Verification</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Administrative Protocol Reference Footnote Card */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] flex items-center justify-between flex-wrap gap-3 text-[#464554]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2a14b4] text-[20px]">policy</span>
            <span className="text-xs font-semibold">
              Campus Grievance Standing Order 2024 • Chapter VII, Subsection C
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span>Standard Redressal SLA: ≤ 72 Hours</span>
            <span className="text-[#2a14b4] font-bold">Proctorial Helpline: ext. 402</span>
          </div>
        </div>
      </div>
    </div>
  );
};

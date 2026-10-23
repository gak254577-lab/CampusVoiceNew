/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'admin';
  rollNumber?: string;
  branch?: string;
  year?: string;
  hostelBlock?: string;
  phone?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface StatusHistoryLog {
  status: 'Submitted' | 'In Review' | 'In Progress' | 'Resolution Submitted' | 'Resolved' | 'Rejected' | 'Escalated';
  updatedBy: string;
  updatedAt: number; // timestamp
  changeSummary: string;
}

export interface ResolutionProof {
  logId?: string;
  officerName: string;
  officerRole: string;
  interventionTimestamp: string;
  actionTaken: string;
  photoProofUrl?: string;
  photoProofLabel?: string;
  photoProofGps?: string;
  speedtestBefore?: string;
  speedtestAfter?: string;
  packetLoss?: string;
  jitter?: string;
  studentRating?: number;
  studentFeedback?: string;
  verifiedAt?: number;
  concurrenceConfirmed?: boolean;
}

export interface ComplaintTicket {
  id: string; // Firestore document ID
  ticketId: string; // format CV-2024-XXXXX or CV-2026-XXXXX
  studentId: string;
  studentEmail: string;
  studentName?: string;
  studentPhoto?: string;
  studentRoll?: string;
  studentBranch?: string;
  isAnonymous: boolean;
  peerMasking?: boolean; // Peer Identity Masking (Public Redressal Ledger)
  category: string;
  title: string;
  description: string;
  building?: string;
  room?: string;
  incidentDateTime?: string;
  fileURL?: string; // photo data URL or standard base64 URL
  fileName?: string;
  fileSize?: string;
  severity: 'Urgent' | 'High' | 'Normal' | 'Medium' | 'Low';
  aiSummary: string;
  suggestedAction: string;
  aiConfidence?: string;
  responsibleCell?: string;
  designatedOfficer?: string;
  slaWindow?: string;
  status: 'Submitted' | 'In Review' | 'In Progress' | 'Resolution Submitted' | 'Resolved' | 'Rejected' | 'Escalated';
  assignedTo?: string; // admin email or name
  adminNote?: string;
  escalated: boolean;
  createdAt: number;
  updatedAt: number;
  slaHoursRemaining?: number;
  statusHistory: StatusHistoryLog[];
  resolutionProof?: ResolutionProof;
}

export interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  ticketId?: string;
  duration?: number;
}

export interface PushNotificationMessage {
  id: string;
  title: string;
  body: string;
  ticketId?: string;
  createdAt: number;
  read: boolean;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

import { auth, db, googleProvider, isMockFirebase, OperationType, handleFirestoreError } from './firebase';
import { UserProfile, ComplaintTicket, NotificationToast, PushNotificationMessage } from './types';

import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { SubmitGrievance } from './components/SubmitGrievance';
import { MyTickets } from './components/MyTickets';
import { TicketDetailsModal } from './components/TicketDetailsModal';
import { StaffResolutionDashboard } from './components/StaffResolutionDashboard';
import { CampusInsights } from './components/CampusInsights';
import { StudentProfileModal } from './components/StudentProfileModal';
import { RedressalSopModal } from './components/RedressalSopModal';
import NotificationToastContainer from './components/NotificationToast';

// Hardcoded Admin Emails list for bootstrapping
const ADMIN_EMAILS = [
  "gak254577@gmail.com",
  "admin@imsec.ac.in",
  "director@imsec.ac.in",
  "registrar@imsec.ac.in",
  "warden@imsec.ac.in"
];

// Initial default complaints from the Stitch Export
const INITIAL_STITCH_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'ticket-cv-2024-089',
    ticketId: 'CV-2024-089',
    studentId: 'student_aanya',
    studentEmail: 'aanya.sharma@imsec.ac.in',
    studentName: 'Aanya Sharma',
    studentRoll: '2101430100042',
    studentBranch: 'Computer Science & Engineering',
    studentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCFTI8WrD3h4N_jIV1xAZB1YSbIZUebduORRKOf9MeiPWBfAl9SWIIcPPOQRN9XTNyVMX_m77qlbRaXr2vYhUXkyllWUCbgK6bfaHP01RV0S57PB4GW8xMZod9d_iZguTXnVMcCbE2h1OD0rEnglZg3Ch5LfPdCq9oNYMqk9cogJsLvuay_JWtYSdbyliuBOypIttS80rkcKAJFzLySz5KckR9g5TQ49K-pEm2bCtKProEbkzZxdv',
    isAnonymous: false,
    peerMasking: true,
    category: 'Wi-Fi & IT Infrastructure',
    building: 'Academic Block A',
    room: 'CS Lab 204, 2nd Floor',
    title: 'Wi-Fi signal drops frequently & gateway packet loss during practical hours in CS Lab 204',
    description: 'Gateway packet loss exceeding 40% during afternoon lab sessions, disrupting 45 terminal systems. Terminal connections drop every 5 minutes during practical sessions.',
    severity: 'Urgent',
    status: 'Resolution Submitted',
    responsibleCell: 'IT & Multimedia Cell',
    designatedOfficer: 'Er. Rakesh Kumar',
    slaWindow: '24h Resolution Window',
    aiSummary: 'Critical wireless packet drops in CS Lab 204 affecting multiple lab terminals.',
    suggestedAction: 'Deploy network technician to inspect ceiling-mounted AP and switch port.',
    assignedTo: 'Er. Rakesh Kumar',
    adminNote: 'Intervention completed. Replaced Cisco AP with Aruba AP-515. Throughput calibrated at 112 Mbps.',
    escalated: false,
    createdAt: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
    updatedAt: Date.now() - (2 * 60 * 60 * 1000),
    statusHistory: [
      { status: 'Submitted', updatedBy: 'Complainant', updatedAt: Date.now() - (24 * 60 * 60 * 1000), changeSummary: 'Grievance lodged with digital affirmation.' },
      { status: 'In Review', updatedBy: 'IT Cell', updatedAt: Date.now() - (22 * 60 * 60 * 1000), changeSummary: 'Assigned to Nodal Officer Er. Rakesh Kumar.' },
      { status: 'In Progress', updatedBy: 'Er. Rakesh Kumar', updatedAt: Date.now() - (18 * 60 * 60 * 1000), changeSummary: 'Hardware replacement dispatched to Lab 204.' },
      { status: 'Resolution Submitted', updatedBy: 'Er. Rakesh Kumar', updatedAt: Date.now() - (2 * 60 * 60 * 1000), changeSummary: 'Resolution evidence uploaded. Complainant verification requested.' }
    ],
    resolutionProof: {
      logId: 'RES-2024-8841-A',
      officerName: 'Er. Rakesh Kumar',
      officerRole: 'Senior Network Administrator, IT Infrastructure Cell',
      interventionTimestamp: '24 Oct 2024, 11:38 AM IST',
      actionTaken: 'Replaced faulty Cisco AP-502 access point with high-density dual-band enterprise Aruba AP-515. Re-terminated RJ45 patch cable on switch rack 2, port 18 to eliminate CRC transmission errors. Signal strength surveyed and calibrated at -52 dBm across all 45 operational terminals. Bandwidth provisioned and confirmed at 112 Mbps symmetric with prioritized educational QoS packets.',
      photoProofUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFXK7AHK_zU87UjPXOqa8_y-dnqS6zH1s4K8PZUdj-T_tby0a8Ef7eoFOpIp6QhrepPXuXEHi2qt-5HMIdE6LwRJlpcS4OVN9WDuextcH9Zx6mB8_28D9qCGFHZZueWkoCo0FX09OuazMF-JMYDHEVznVcpjEg8Mp9M0rYZO7LTlGSJXRR1_sLboebFvYKTwvd-uZXNiMNZqQ4CvWuFckub3BhceIrLdQXumkbmR-zlEUKmvGpykU',
      speedtestBefore: '4 Mbps',
      speedtestAfter: '112.4 Mbps',
      packetLoss: '0.00%',
      jitter: '0.8ms'
    }
  },
  {
    id: 'ticket-cv-2024-074',
    ticketId: 'CV-2024-074',
    studentId: 'student_aanya',
    studentEmail: 'aanya.sharma@imsec.ac.in',
    studentName: 'Aanya Sharma',
    studentRoll: '2101430100042',
    isAnonymous: false,
    category: 'Hostel facilities & Mess',
    building: 'Raman Boys Hostel',
    room: '2nd Floor Corridor',
    title: 'Water purifier cooler not working on 2nd Floor Raman Hostel',
    description: 'The cold water compressor on the 2nd floor drinking unit has been non-functional. Students have to walk down 2 flights of stairs for drinking water.',
    severity: 'Medium',
    status: 'In Progress',
    responsibleCell: 'Estate & Hostel Welfare Cell',
    designatedOfficer: 'Estate Officer',
    slaWindow: '48h Resolution Window',
    aiSummary: 'Drinking water cooling unit failure on 2nd floor Raman Hostel.',
    suggestedAction: 'Dispatch plumbing and refrigeration technician for compressor repair.',
    assignedTo: 'Estate Officer',
    escalated: false,
    createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
    updatedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
    statusHistory: [
      { status: 'Submitted', updatedBy: 'Complainant', updatedAt: Date.now() - (4 * 24 * 60 * 60 * 1000), changeSummary: 'Grievance lodged.' },
      { status: 'In Progress', updatedBy: 'Estate Office', updatedAt: Date.now() - (1 * 24 * 60 * 60 * 1000), changeSummary: 'Assigned plumbing & compressor engineer.' }
    ]
  },
  {
    id: 'ticket-cv-2024-062',
    ticketId: 'CV-2024-062',
    studentId: 'student_aanya',
    studentEmail: 'aanya.sharma@imsec.ac.in',
    studentName: 'Aanya Sharma',
    studentRoll: '2101430100042',
    isAnonymous: false,
    category: 'Classrooms and laboratories',
    building: 'Academic Block B',
    room: 'Lecture Hall 102',
    title: 'Overhead projector bulb flickering in Block B Lecture Hall 102',
    description: 'During morning lectures the projector light dims and flickers continuously, making slide diagrams unreadable from the back rows.',
    severity: 'Low',
    status: 'Resolved',
    responsibleCell: 'Multimedia & AV Cell',
    designatedOfficer: 'AV Incharge',
    slaWindow: '72h Resolution Window',
    aiSummary: 'Projector lamp degradation in Lecture Hall 102.',
    suggestedAction: 'Replace projector lamp module with new genuine bulb unit.',
    assignedTo: 'AV Incharge',
    escalated: false,
    createdAt: Date.now() - (12 * 24 * 60 * 60 * 1000),
    updatedAt: Date.now() - (10 * 24 * 60 * 60 * 1000),
    statusHistory: [
      { status: 'Submitted', updatedBy: 'Complainant', updatedAt: Date.now() - (12 * 24 * 60 * 60 * 1000), changeSummary: 'Logged under classroom maintenance.' },
      { status: 'Resolved', updatedBy: 'AV Incharge', updatedAt: Date.now() - (10 * 24 * 60 * 60 * 1000), changeSummary: 'New projector lamp installed and verified.' }
    ]
  }
];

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // App Navigation Tabs
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isForcedAdmin, setIsForcedAdmin] = useState(false);

  // Modals
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSopModal, setShowSopModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data Collections
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_STITCH_COMPLAINTS);
  const [notifications, setNotifications] = useState<PushNotificationMessage[]>([]);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Toast Dispatcher Helper
  const addToast = (title: string, message: string, type: NotificationToast['type'] = 'info', ticketId?: string) => {
    const newToast: NotificationToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      ticketId,
      duration: 5000
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);

      // Check localStorage for simulated mock user session
      const storedMockUser = localStorage.getItem('mock_user_session');
      if (storedMockUser && !user) {
        try {
          const mockUser = JSON.parse(storedMockUser);
          setCurrentUser(mockUser);
          setAuthError(null);

          const storedProfile = localStorage.getItem(`profile_${mockUser.uid}`);
          if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
          } else {
            const defaultProfile: UserProfile = {
              uid: mockUser.uid,
              name: mockUser.displayName || 'Aanya Sharma',
              email: mockUser.email || 'aanya.sharma@imsec.ac.in',
              rollNumber: mockUser.email === 'admin@imsec.ac.in' ? 'EMP-IT-088' : '2101430100042',
              branch: 'Computer Science & Engineering',
              year: '4th Year',
              hostelBlock: 'Block C (Girls)',
              photoURL: mockUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCFTI8WrD3h4N_jIV1xAZB1YSbIZUebduORRKOf9MeiPWBfAl9SWIIcPPOQRN9XTNyVMX_m77qlbRaXr2vYhUXkyllWUCbgK6bfaHP01RV0S57PB4GW8xMZod9d_iZguTXnVMcCbE2h1OD0rEnglZg3Ch5LfPdCq9oNYMqk9cogJsLvuay_JWtYSdbyliuBOypIttS80rkcKAJFzLySz5KckR9g5TQ49K-pEm2bCtKProEbkzZxdv',
              role: mockUser.email === 'admin@imsec.ac.in' ? 'admin' : 'student',
              createdAt: Date.now()
            };
            localStorage.setItem(`profile_${mockUser.uid}`, JSON.stringify(defaultProfile));
            setProfile(defaultProfile);
          }
          setAuthLoading(false);
          return;
        } catch (e) {
          console.warn("Restoring mock session failed:", e);
        }
      }

      if (user) {
        const testEmail = user.email || '';
        const isImsec = testEmail.endsWith('@imsec.ac.in') || testEmail === 'gak254577@gmail.com';
        if (!isImsec) {
          setAuthError("Access denied. Only @imsec.ac.in college accounts are allowed.");
          await signOut(auth);
          setCurrentUser(null);
          setProfile(null);
          setAuthLoading(false);
          return;
        }

        setCurrentUser(user);
        setAuthError(null);

        // Fetch user profile from Firestore or local storage
        try {
          if (isMockFirebase || localStorage.getItem('use_mock_auth') === 'true') {
            const stored = localStorage.getItem(`profile_${user.uid}`);
            if (stored) {
              setProfile(JSON.parse(stored));
            }
          } else {
            const profSnap = await getDoc(doc(db, 'users', user.uid));
            if (profSnap.exists()) {
              setProfile(profSnap.data() as UserProfile);
            }
          }
        } catch (err) {
          console.error("Firestore user profile loading failed:", err);
        }
      } else {
        // If not logged in and no mock user, activate default Aanya Sharma session for seamless first-glance presentation
        const defaultAanya: UserProfile = {
          uid: 'student_aanya_demo',
          name: 'Aanya Sharma',
          email: 'aanya.sharma@imsec.ac.in',
          rollNumber: '2101430100042',
          branch: 'Computer Science & Engineering',
          year: '4th Year',
          hostelBlock: 'Block C (Girls)',
          photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCFTI8WrD3h4N_jIV1xAZB1YSbIZUebduORRKOf9MeiPWBfAl9SWIIcPPOQRN9XTNyVMX_m77qlbRaXr2vYhUXkyllWUCbgK6bfaHP01RV0S57PB4GW8xMZod9d_iZguTXnVMcCbE2h1OD0rEnglZg3Ch5LfPdCq9oNYMqk9cogJsLvuay_JWtYSdbyliuBOypIttS80rkcKAJFzLySz5KckR9g5TQ49K-pEm2bCtKProEbkzZxdv',
          role: 'student',
          createdAt: Date.now()
        };
        setCurrentUser({
          uid: 'student_aanya_demo',
          displayName: 'Aanya Sharma',
          email: 'aanya.sharma@imsec.ac.in',
          photoURL: defaultAanya.photoURL,
        } as any);
        setProfile(defaultAanya);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Hydrate complaints from Firestore or localStorage
  useEffect(() => {
    const fetchComplaints = async () => {
      if (isMockFirebase || localStorage.getItem('use_mock_auth') === 'true') {
        const stored = localStorage.getItem('stitch_complaints');
        if (stored) {
          setComplaints(JSON.parse(stored));
        } else {
          localStorage.setItem('stitch_complaints', JSON.stringify(INITIAL_STITCH_COMPLAINTS));
          setComplaints(INITIAL_STITCH_COMPLAINTS);
        }
      } else {
        try {
          const cRef = collection(db, 'complaints');
          const qSnap = await getDocs(cRef);
          if (!qSnap.empty) {
            const list: ComplaintTicket[] = [];
            qSnap.forEach(d => {
              list.push({ id: d.id, ...(d.data() as any) } as ComplaintTicket);
            });
            list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setComplaints(list);
          } else {
            // Seed initial Stitch tickets into Firestore
            for (const ticket of INITIAL_STITCH_COMPLAINTS) {
              await setDoc(doc(db, 'complaints', ticket.id), ticket);
            }
            setComplaints(INITIAL_STITCH_COMPLAINTS);
          }
        } catch (err) {
          console.warn("Firestore fetch deferred. Using initial Stitch repository.", err);
          const stored = localStorage.getItem('stitch_complaints');
          if (stored) {
            setComplaints(JSON.parse(stored));
          } else {
            setComplaints(INITIAL_STITCH_COMPLAINTS);
          }
        }
      }
    };

    fetchComplaints();
  }, [currentUser]);

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Google sign-in was interrupted.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Mock Login Switch
  const handleMockLogin = (role: 'student' | 'admin') => {
    const mockUser = {
      uid: role === 'admin' ? 'admin_rakesh' : 'student_aanya',
      displayName: role === 'admin' ? 'Er. Rakesh Kumar' : 'Aanya Sharma',
      email: role === 'admin' ? 'rakesh.kumar@imsec.ac.in' : 'aanya.sharma@imsec.ac.in',
      photoURL: role === 'admin' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKBKwcRNbY5mXmYzxiqGxAm-YwcP_xyeW5YBJDH6YSYHyHJlGH2pDkqfiPQJrAsu5-6BhdjN7LwEkUDi4qpbEHv1mB8VF3rC0kWc3cXmWNSCouarv2qq4KGqizW0ibgpF7476L6_C6YQorumL9RUyYi-oh0lSLoqaGpDAGTBiQ6YenJFO_8AP7wCvLDYoUQfGlQnMEFoAS78BeWxHlDaFOouOIMU_QpIZVVEobdfVFwZtYsGbi03gC'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCFTI8WrD3h4N_jIV1xAZB1YSbIZUebduORRKOf9MeiPWBfAl9SWIIcPPOQRN9XTNyVMX_m77qlbRaXr2vYhUXkyllWUCbgK6bfaHP01RV0S57PB4GW8xMZod9d_iZguTXnVMcCbE2h1OD0rEnglZg3Ch5LfPdCq9oNYMqk9cogJsLvuay_JWtYSdbyliuBOypIttS80rkcKAJFzLySz5KckR9g5TQ49K-pEm2bCtKProEbkzZxdv'
    };

    const mockProfile: UserProfile = {
      uid: mockUser.uid,
      name: mockUser.displayName,
      email: mockUser.email,
      rollNumber: role === 'admin' ? 'EMP-IT-088' : '2101430100042',
      branch: 'Information Technology',
      year: role === 'admin' ? 'Senior Nodal Officer' : '4th Year',
      hostelBlock: role === 'admin' ? 'Proctorial Board' : 'Block C (Girls)',
      photoURL: mockUser.photoURL,
      role: role,
      createdAt: Date.now()
    };

    localStorage.setItem('mock_user_session', JSON.stringify(mockUser));
    localStorage.setItem(`profile_${mockUser.uid}`, JSON.stringify(mockProfile));
    setCurrentUser(mockUser as any);
    setProfile(mockProfile);
    setIsForcedAdmin(role === 'admin');
    if (role === 'admin') {
      setCurrentTab('staff-resolution-portal');
    } else {
      setCurrentTab('dashboard');
    }
    addToast('Authenticated', `Active Session: ${mockUser.displayName}`, 'success');
  };

  const handleLogout = async () => {
    localStorage.removeItem('mock_user_session');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    setProfile(null);
    addToast('Signed Out', 'You have been disconnected from the portal.', 'info');
  };

  // Submit New Grievance
  const handleSubmitNewComplaint = async (newTicketData: Partial<ComplaintTicket>) => {
    const fullTicket: ComplaintTicket = {
      id: `ticket-${Date.now()}`,
      ticketId: newTicketData.ticketId || `CV-2024-${Math.floor(100 + Math.random() * 900)}`,
      studentId: currentUser?.uid || 'student_aanya',
      studentEmail: currentUser?.email || 'aanya.sharma@imsec.ac.in',
      studentName: profile?.name || 'Aanya Sharma',
      studentRoll: profile?.rollNumber || '2101430100042',
      studentBranch: profile?.branch || 'Computer Science',
      isAnonymous: Boolean(newTicketData.isAnonymous),
      peerMasking: Boolean(newTicketData.peerMasking),
      category: newTicketData.category || 'Classrooms and laboratories',
      title: newTicketData.title || 'Untitled Grievance',
      description: newTicketData.description || '',
      building: newTicketData.building || 'Academic Block B',
      room: newTicketData.room || 'Room 201',
      incidentDateTime: newTicketData.incidentDateTime || new Date().toISOString(),
      fileURL: newTicketData.fileURL,
      fileName: newTicketData.fileName,
      fileSize: newTicketData.fileSize,
      severity: newTicketData.severity || 'High',
      responsibleCell: newTicketData.responsibleCell || 'IT & Multimedia Cell',
      designatedOfficer: newTicketData.designatedOfficer || 'Er. R. K. Saxena (Sr. Tech)',
      slaWindow: newTicketData.slaWindow || '24h Resolution Window',
      aiSummary: newTicketData.aiSummary || 'Student grievance recorded under institutional tracking.',
      suggestedAction: newTicketData.suggestedAction || 'Assign to standing redressal committee.',
      status: 'Submitted',
      escalated: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: 'Complainant',
          updatedAt: Date.now(),
          changeSummary: 'Grievance lodged with statutory digital affirmation.'
        }
      ]
    };

    // Update in memory & storage
    const updatedList = [fullTicket, ...complaints];
    setComplaints(updatedList);
    localStorage.setItem('stitch_complaints', JSON.stringify(updatedList));

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, 'complaints', fullTicket.id), fullTicket);
      } catch (err) {
        console.warn("Firestore save deferred:", err);
      }
    }

    addToast('Grievance Lodged', `Dossier #${fullTicket.ticketId} successfully created.`, 'success');
    setCurrentTab('my-tickets');
  };

  // Staff Submit Resolution
  const handleStaffResolution = async (
    ticketId: string,
    actionTaken: string,
    photoUrl?: string,
    speedtest?: string
  ) => {
    const updated = complaints.map(t => {
      if (t.id === ticketId || t.ticketId === ticketId) {
        return {
          ...t,
          status: 'Resolution Submitted' as const,
          updatedAt: Date.now(),
          resolutionProof: {
            logId: `RES-2024-${Math.floor(1000 + Math.random() * 9000)}`,
            officerName: 'Er. Rakesh Kumar',
            officerRole: 'Senior Network Administrator, IT Infrastructure Cell',
            interventionTimestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
            actionTaken,
            photoProofUrl: photoUrl || t.resolutionProof?.photoProofUrl,
            speedtestAfter: speedtest || '112.4 Mbps',
            packetLoss: '0.00%',
            jitter: '0.8ms'
          },
          statusHistory: [
            ...(t.statusHistory || []),
            {
              status: 'Resolution Submitted' as const,
              updatedBy: 'Er. Rakesh Kumar',
              updatedAt: Date.now(),
              changeSummary: 'Technical intervention completed and proof uploaded.'
            }
          ]
        };
      }
      return t;
    });

    setComplaints(updated);
    localStorage.setItem('stitch_complaints', JSON.stringify(updated));

    addToast('Resolution Submitted', `Docket #${ticketId} submitted for student verification.`, 'success');
  };

  // Student Verify and Close
  const handleVerifyClose = async (ticketId: string, rating: number, feedback: string) => {
    const updated = complaints.map(t => {
      if (t.id === ticketId || t.ticketId === ticketId) {
        return {
          ...t,
          status: 'Resolved' as const,
          updatedAt: Date.now(),
          resolutionProof: {
            ...(t.resolutionProof || {
              officerName: 'Er. Rakesh Kumar',
              officerRole: 'Network Administrator',
              interventionTimestamp: new Date().toLocaleDateString(),
              actionTaken: 'Intervention completed.'
            }),
            studentRating: rating,
            studentFeedback: feedback,
            verifiedAt: Date.now(),
            concurrenceConfirmed: true
          },
          statusHistory: [
            ...(t.statusHistory || []),
            {
              status: 'Resolved' as const,
              updatedBy: profile?.name || 'Aanya Sharma',
              updatedAt: Date.now(),
              changeSummary: `Complainant verified resolution with ${rating}-star rating.`
            }
          ]
        };
      }
      return t;
    });

    setComplaints(updated);
    localStorage.setItem('stitch_complaints', JSON.stringify(updated));
    setSelectedTicket(null);
    addToast('Ticket Certified', 'Grievance certified and officially archived into institutional ledger.', 'success');
  };

  // Student Reject and Escalate to HOD
  const handleRejectEscalate = async (ticketId: string, reason: string) => {
    const updated = complaints.map(t => {
      if (t.id === ticketId || t.ticketId === ticketId) {
        return {
          ...t,
          status: 'Escalated' as const,
          escalated: true,
          adminNote: `Escalated by student: "${reason}"`,
          updatedAt: Date.now(),
          statusHistory: [
            ...(t.statusHistory || []),
            {
              status: 'Escalated' as const,
              updatedBy: profile?.name || 'Aanya Sharma',
              updatedAt: Date.now(),
              changeSummary: `Resolution rejected by student. Escalated to HOD: ${reason}`
            }
          ]
        };
      }
      return t;
    });

    setComplaints(updated);
    localStorage.setItem('stitch_complaints', JSON.stringify(updated));
    setSelectedTicket(null);
    addToast('Ticket Escalated', 'Grievance elevated to Level 2 (Head of Department) review.', 'warning');
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (profile) {
      const newProf = { ...profile, ...updated, updatedAt: Date.now() };
      setProfile(newProf);
      localStorage.setItem(`profile_${newProf.uid}`, JSON.stringify(newProf));
      addToast('Profile Updated', 'Student credentials successfully updated.', 'success');
    }
  };

  const activeTicketsCount = complaints.filter(
    c => c.status === 'Submitted' || c.status === 'In Review' || c.status === 'In Progress' || c.status === 'Resolution Submitted'
  ).length;

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* Toast Alert System */}
      <NotificationToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Institutional Top Masthead */}
      <Header
        profile={profile}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        onClearNotifications={() => setNotifications([])}
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={handleLogout}
        isForcedAdmin={isForcedAdmin}
        onToggleAdmin={() => {
          const next = !isForcedAdmin;
          setIsForcedAdmin(next);
          if (next) {
            handleMockLogin('admin');
          } else {
            handleMockLogin('student');
          }
        }}
      />

      {/* Institutional Left Sidebar Rail */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeTicketsCount={activeTicketsCount}
      />

      {/* Main Workspace Canvas (pl-64 on desktop) */}
      <div className="md:pl-64">
        <main className="relative pt-16 min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'dashboard' && (
            <StudentDashboard
              profile={profile}
              complaints={complaints}
              onSelectTicket={ticket => setSelectedTicket(ticket)}
              onSubmitGrievance={() => setCurrentTab('submit-grievance')}
              onOpenSop={() => setShowSopModal(true)}
              onOpenCharter={() => setShowSopModal(true)}
            />
          )}

          {currentTab === 'submit-grievance' && (
            <SubmitGrievance
              profile={profile}
              onSubmit={handleSubmitNewComplaint}
              onCancel={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'my-tickets' && (
            <MyTickets
              complaints={complaints}
              onSelectTicket={ticket => setSelectedTicket(ticket)}
              onOpenSop={() => setShowSopModal(true)}
            />
          )}

          {currentTab === 'campus-insights' && <CampusInsights />}

          {currentTab === 'student-profile' && (
            <div className="flex flex-col gap-4">
              <div className="p-6 bg-white rounded-xl shadow-xs border border-[#e2e8f0]">
                <h2 className="text-xl font-bold text-[#0b1c30] mb-2">Student Institutional Profile</h2>
                <p className="text-sm text-[#464554] mb-4">
                  Verified statutory credentials under IMSEC Academic Grievance Charter.
                </p>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 bg-[#4338ca] text-white rounded-lg text-xs font-bold hover:bg-[#2a14b4] transition-colors"
                >
                  Edit Student Dossier Details
                </button>
              </div>
            </div>
          )}

          {currentTab === 'staff-resolution-portal' && (
            <StaffResolutionDashboard
              profile={profile}
              complaints={complaints}
              onSelectTicket={ticket => setSelectedTicket(ticket)}
              onSubmitStaffResolution={handleStaffResolution}
              onExportAuditDossier={() => {
                alert('Exporting complete audit dossier to encrypted PDF/CSV format...');
              }}
            />
          )}
        </main>
      </div>

      {/* Ticket Details & Resolution Proof Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          profile={profile}
          onClose={() => setSelectedTicket(null)}
          onVerifyClose={handleVerifyClose}
          onRejectEscalate={handleRejectEscalate}
        />
      )}

      {/* Student Profile Modal */}
      {showProfileModal && (
        <StudentProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={handleUpdateProfile}
          onSignOut={handleLogout}
        />
      )}

      {/* Redressal SOP & SLAs Modal */}
      {showSopModal && (
        <RedressalSopModal onClose={() => setShowSopModal(false)} />
      )}
    </div>
  );
}

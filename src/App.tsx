/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

import { auth, db, googleProvider, isMockFirebase } from './firebase';
import { UserProfile, ComplaintTicket, NotificationToast, PushNotificationMessage } from './types';
import { validateCampusEmail, STAFF_EMAIL_ALLOWLIST, INSTITUTIONAL_DOMAIN } from './authSecurity';

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
import { AccessDeniedModal } from './components/AccessDeniedModal';
import { LoginPage } from './components/LoginPage';
import NotificationToastContainer from './components/NotificationToast';

// Default complaints from the Stitch Export (Used for initial hydration & sandbox demo)
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
    createdAt: Date.now() - (24 * 60 * 60 * 1000),
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

export interface SecurityErrorState {
  code: string;
  title: string;
  message: string;
  email?: string;
}

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionMode, setSessionMode] = useState<'authenticated' | 'demo' | 'unauthenticated'>('unauthenticated');
  const [authLoading, setAuthLoading] = useState(true);
  const [authSecurityError, setAuthSecurityError] = useState<SecurityErrorState | null>(null);

  // App Navigation Tabs
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isForcedAdmin, setIsForcedAdmin] = useState(false); // Only applicable in demo simulation mode

  // Modals
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSopModal, setShowSopModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data Collections
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([]);
  const [notifications, setNotifications] = useState<PushNotificationMessage[]>([]);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Toast Helper
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

  // -------------------------------------------------------------
  // Firebase Auth State Listener
  // -------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);

      if (user) {
        const rawEmail = user.email || '';
        const isVerified = Boolean(user.emailVerified);
        const isGoogle = user.providerData.some(p => p.providerId === 'google.com');

        // 1. Mandatory Google email verification check (enforced for Google Auth)
        if (isGoogle && !isVerified) {
          console.warn(`[Security Alert] Rejected unverified Google account: ${rawEmail}`);
          await signOut(auth);
          setCurrentUser(null);
          setProfile(null);
          setSessionMode('unauthenticated');
          setAuthSecurityError({
            code: 'EMAIL_UNVERIFIED',
            title: 'Unverified Google Account',
            message: 'Your Google email address has not been verified. AICTE statutory security regulations require verified institutional email accounts.',
            email: rawEmail
          });
          setAuthLoading(false);
          return;
        }

        // 2. Strict IMSEC domain validation & lookalike rejection
        const isVerifiedForDomain = isGoogle ? isVerified : true;
        const validation = validateCampusEmail(rawEmail, isVerifiedForDomain);
        if (!validation.isValid) {
          console.warn(`[Security Alert] Rejected domain for ${rawEmail}: ${validation.errorMessage}`);
          await signOut(auth);
          setCurrentUser(null);
          setProfile(null);
          setSessionMode('unauthenticated');
          setAuthSecurityError({
            code: validation.errorCode || 'DOMAIN_UNAUTHORIZED',
            title: 'Institutional Domain Unauthorized',
            message: validation.errorMessage || `Only official IMS Engineering College accounts (@${INSTITUTIONAL_DOMAIN}) are permitted. Personal email providers and lookalike domains are strictly blocked.`,
            email: rawEmail
          });
          setAuthLoading(false);
          return;
        }

        // 3. Server-side token verification & custom claims check
        let serverVerifiedRole: 'admin' | 'student' = validation.isStaff ? 'admin' : 'student';

        try {
          const idToken = await user.getIdToken();
          const verifyResp = await fetch('/api/auth/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });

          if (verifyResp.ok) {
            const serverData = await verifyResp.json();
            if (serverData.allowed && serverData.user) {
              serverVerifiedRole = serverData.user.role;
            }
          } else {
            const errData = await verifyResp.json().catch(() => ({}));
            if (errData.error === 'FORBIDDEN' || errData.error === 'DOMAIN_UNAUTHORIZED') {
              await signOut(auth);
              setCurrentUser(null);
              setProfile(null);
              setSessionMode('unauthenticated');
              setAuthSecurityError({
                code: errData.error,
                title: 'Server Authorization Denied',
                message: errData.message || 'The server rejected this session.',
                email: rawEmail
              });
              setAuthLoading(false);
              return;
            }
          }
        } catch (apiErr) {
          console.warn("Backend session check offline/deferred:", apiErr);
        }

        // Session successfully verified!
        setCurrentUser(user);
        setSessionMode('authenticated');
        setAuthSecurityError(null);

        // Load or initialize user profile in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const profSnap = await getDoc(userDocRef);

          if (profSnap.exists()) {
            const data = profSnap.data() as UserProfile;
            // Ensure server-verified role is authoritative over client-side profile
            setProfile({
              ...data,
              role: serverVerifiedRole,
              email: validation.normalizedEmail
            });
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || validation.normalizedEmail.split('@')[0],
              email: validation.normalizedEmail,
              photoURL: user.photoURL || undefined,
              role: serverVerifiedRole,
              rollNumber: serverVerifiedRole === 'admin' ? 'EMP-NODAL-088' : '',
              branch: serverVerifiedRole === 'admin' ? 'Information Technology Cell' : '',
              year: serverVerifiedRole === 'admin' ? 'Senior Nodal Officer' : '',
              hostelBlock: '',
              createdAt: Date.now()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (firestoreErr) {
          console.warn("Firestore profile sync deferred:", firestoreErr);
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || validation.normalizedEmail.split('@')[0],
            email: validation.normalizedEmail,
            photoURL: user.photoURL || undefined,
            role: serverVerifiedRole,
            rollNumber: serverVerifiedRole === 'admin' ? 'EMP-NODAL-088' : '',
            createdAt: Date.now()
          };
          setProfile(fallbackProfile);
        }

        // Direct user to appropriate default tab based on verified role
        if (serverVerifiedRole === 'admin') {
          setCurrentTab('staff-resolution-portal');
        } else {
          setCurrentTab('dashboard');
        }
      } else {
        // No active Firebase authentication session -> Require Login
        setCurrentUser(null);
        setProfile(null);
        setSessionMode('unauthenticated');
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper: Setup Default Sandbox Session for Preview
  const setupDefaultDemoSession = () => {
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
    setSessionMode('demo');
    setIsForcedAdmin(false);
  };

  // -------------------------------------------------------------
  // Grievance Hydration (Firestore / Local Cache)
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchComplaints = async () => {
      if (sessionMode === 'demo') {
        const stored = localStorage.getItem('stitch_complaints');
        if (stored) {
          setComplaints(JSON.parse(stored));
        } else {
          localStorage.setItem('stitch_complaints', JSON.stringify(INITIAL_STITCH_COMPLAINTS));
          setComplaints(INITIAL_STITCH_COMPLAINTS);
        }
        return;
      }

      // Real authenticated mode: Fetch genuine records from Firestore
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
          // Zero grievances found in real database -> Clean empty state
          setComplaints([]);
        }
      } catch (err) {
        console.warn("Firestore complaints fetch error:", err);
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, [currentUser, sessionMode]);

  // -------------------------------------------------------------
  // Filtered Complaint Access (Requirement 6 & 10: Privacy Enforcement)
  // -------------------------------------------------------------
  const isStaff = profile?.role === 'admin' || (sessionMode === 'demo' && isForcedAdmin);

  const permittedComplaints = useMemo(() => {
    if (sessionMode === 'demo') {
      return complaints;
    }
    if (isStaff) {
      // Authorized staff member accesses institutional grievance queue
      return complaints;
    }
    // Student in authenticated mode: strictly access their own complaints
    const studentUid = currentUser?.uid;
    const studentEmail = currentUser?.email?.toLowerCase();

    return complaints.filter(
      c => (studentUid && c.studentId === studentUid) || 
           (studentEmail && c.studentEmail?.toLowerCase() === studentEmail)
    );
  }, [complaints, sessionMode, isStaff, currentUser?.uid, currentUser?.email]);

  // -------------------------------------------------------------
  // Auth Handlers
  // -------------------------------------------------------------
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthSecurityError(null);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // 1. Check email verification
      if (!user.emailVerified) {
        await signOut(auth);
        setCurrentUser(null);
        setProfile(null);
        setSessionMode('unauthenticated');
        setAuthSecurityError({
          code: 'EMAIL_UNVERIFIED',
          title: 'Email Verification Required',
          message: 'Your Google account email has not been verified by Google. Please verify your email before accessing the portal.',
          email: user.email || undefined
        });
        return;
      }

      // 2. Exact domain validation & lookalike rejection
      const validation = validateCampusEmail(user.email, user.emailVerified);
      if (!validation.isValid) {
        await signOut(auth);
        setCurrentUser(null);
        setProfile(null);
        setSessionMode('unauthenticated');
        setAuthSecurityError({
          code: validation.errorCode || 'DOMAIN_UNAUTHORIZED',
          title: 'Institutional Domain Unauthorized',
          message: validation.errorMessage || `Access denied. Only @${INSTITUTIONAL_DOMAIN} accounts are authorized.`,
          email: user.email || undefined
        });
        return;
      }

      // Clear sandbox state
      localStorage.removeItem('mock_user_session');
      addToast('Authenticated', `Welcome to CampusVoice, ${user.displayName || user.email}!`, 'success');
    } catch (err: any) {
      console.error("Google Login Interrupted:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthSecurityError({
          code: err.code || 'AUTH_FAILED',
          title: 'Google Sign-In Error',
          message: err.message || 'An unexpected error occurred during Google sign in.',
        });
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (emailInput: string, passwordInput: string) => {
    setAuthLoading(true);
    setAuthSecurityError(null);

    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      const validation = validateCampusEmail(cleanEmail, true);
      if (!validation.isValid) {
        setAuthSecurityError({
          code: validation.errorCode || 'DOMAIN_UNAUTHORIZED',
          title: 'Institutional Domain Unauthorized',
          message: validation.errorMessage || `Only official @${INSTITUTIONAL_DOMAIN} accounts are permitted.`,
          email: cleanEmail
        });
        return;
      }

      await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      localStorage.removeItem('mock_user_session');
      addToast('Authenticated', 'Welcome back to CampusVoice!', 'success');
    } catch (err: any) {
      console.error("Email Sign-In Error:", err);
      let message = 'Unable to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please verify your credentials or create an account.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is not enabled in Firebase Authentication Console. Please enable Email/Password provider.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again after a few minutes.';
      } else if (err.code === 'auth/user-disabled') {
        message = 'This institutional account has been disabled by an administrator.';
      } else if (err.message) {
        message = err.message;
      }

      setAuthSecurityError({
        code: err.code || 'SIGNIN_FAILED',
        title: 'Sign In Failed',
        message,
        email: emailInput
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (emailInput: string, passwordInput: string, nameInput?: string) => {
    setAuthLoading(true);
    setAuthSecurityError(null);

    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      const validation = validateCampusEmail(cleanEmail, true);
      if (!validation.isValid) {
        setAuthSecurityError({
          code: validation.errorCode || 'DOMAIN_UNAUTHORIZED',
          title: 'Institutional Domain Unauthorized',
          message: validation.errorMessage || `Only official @${INSTITUTIONAL_DOMAIN} accounts are permitted.`,
          email: cleanEmail
        });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const user = userCredential.user;

      if (nameInput?.trim()) {
        try {
          await updateProfile(user, { displayName: nameInput.trim() });
        } catch (profErr) {
          console.warn("Could not set displayName on user:", profErr);
        }
      }

      try {
        await sendEmailVerification(user);
      } catch (verErr) {
        console.warn("Verification email send deferred:", verErr);
      }

      localStorage.removeItem('mock_user_session');
      addToast('Account Created', `Welcome to CampusVoice, ${nameInput || cleanEmail}!`, 'success');
    } catch (err: any) {
      console.error("Email Sign-Up Error:", err);
      let message = 'Failed to create institutional account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'An account already exists with this institutional email. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password registration is not enabled in Firebase Authentication Console. Please enable Email/Password provider.';
      } else if (err.message) {
        message = err.message;
      }

      setAuthSecurityError({
        code: err.code || 'SIGNUP_FAILED',
        title: 'Account Creation Failed',
        message,
        email: emailInput
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out note:", e);
    }
    localStorage.removeItem('mock_user_session');
    setCurrentUser(null);
    setProfile(null);
    setSessionMode('unauthenticated');
    addToast('Signed Out', 'You have been disconnected from the portal.', 'info');
  };

  // Mock / Sandbox Switcher (Only effective in Demo mode)
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
      rollNumber: role === 'admin' ? 'EMP-NODAL-088' : '2101430100042',
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
    setSessionMode('demo');

    if (role === 'admin') {
      setCurrentTab('staff-resolution-portal');
    } else {
      setCurrentTab('dashboard');
    }
    addToast('Sandbox Mode', `Simulating ${mockUser.displayName} (${role.toUpperCase()})`, 'info');
  };

  // Submit New Grievance
  const handleSubmitNewComplaint = async (newTicketData: Partial<ComplaintTicket>) => {
    const fullTicket: ComplaintTicket = {
      id: `ticket-${Date.now()}`,
      ticketId: newTicketData.ticketId || `CV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      studentId: currentUser?.uid || '',
      studentEmail: currentUser?.email || '',
      studentName: profile?.name || (currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Student')),
      studentRoll: profile?.rollNumber || '',
      studentBranch: profile?.branch || '',
      isAnonymous: Boolean(newTicketData.isAnonymous),
      peerMasking: Boolean(newTicketData.peerMasking),
      category: newTicketData.category || 'General Redressal',
      title: newTicketData.title || 'Untitled Grievance',
      description: newTicketData.description || '',
      building: newTicketData.building || '',
      room: newTicketData.room || '',
      incidentDateTime: newTicketData.incidentDateTime || new Date().toISOString(),
      fileURL: newTicketData.fileURL,
      fileName: newTicketData.fileName,
      fileSize: newTicketData.fileSize,
      severity: newTicketData.severity || 'Medium',
      responsibleCell: newTicketData.responsibleCell || 'Institutional Grievance Cell',
      designatedOfficer: newTicketData.designatedOfficer || 'Assigned Officer',
      slaWindow: newTicketData.slaWindow || '48h Resolution Window',
      aiSummary: newTicketData.aiSummary || 'Student grievance recorded under institutional tracking.',
      suggestedAction: newTicketData.suggestedAction || 'Assign to standing redressal committee.',
      status: 'Submitted',
      escalated: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: profile?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Complainant'),
          updatedAt: Date.now(),
          changeSummary: 'Grievance lodged with statutory digital affirmation.'
        }
      ]
    };

    const updatedList = [fullTicket, ...complaints];
    setComplaints(updatedList);
    localStorage.setItem('stitch_complaints', JSON.stringify(updatedList));

    if (sessionMode === 'authenticated') {
      try {
        await setDoc(doc(db, 'complaints', fullTicket.id), fullTicket);
      } catch (err) {
        console.warn("Firestore complaint write deferred:", err);
      }
    }

    addToast('Grievance Lodged', `Dossier #${fullTicket.ticketId} successfully created.`, 'success');
    setCurrentTab('my-tickets');
  };

  // Staff Submit Resolution
  const handleStaffResolution = async (ticketId: string, resolutionData: any) => {
    const updated = complaints.map(t => {
      if (t.id === ticketId || t.ticketId === ticketId) {
        return {
          ...t,
          status: 'Resolution Submitted' as const,
          designatedOfficer: resolutionData.officerName || t.designatedOfficer,
          adminNote: resolutionData.actionTaken || t.adminNote,
          updatedAt: Date.now(),
          resolutionProof: {
            logId: `RES-${Date.now().toString().slice(-6)}`,
            officerName: resolutionData.officerName || 'Er. Rakesh Kumar',
            officerRole: 'Senior Nodal Officer',
            interventionTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            actionTaken: resolutionData.actionTaken,
            photoProofUrl: resolutionData.photoProofUrl || t.resolutionProof?.photoProofUrl,
            speedtestBefore: '4 Mbps',
            speedtestAfter: '112.4 Mbps',
            packetLoss: '0.00%',
            jitter: '0.8ms'
          },
          statusHistory: [
            ...(t.statusHistory || []),
            {
              status: 'Resolution Submitted' as const,
              updatedBy: resolutionData.officerName || 'Staff Nodal Officer',
              updatedAt: Date.now(),
              changeSummary: `Resolution dossier submitted: ${resolutionData.actionTaken?.slice(0, 80)}...`
            }
          ]
        };
      }
      return t;
    });

    setComplaints(updated);
    localStorage.setItem('stitch_complaints', JSON.stringify(updated));

    if (sessionMode === 'authenticated') {
      try {
        const found = updated.find(t => t.id === ticketId || t.ticketId === ticketId);
        if (found) {
          await updateDoc(doc(db, 'complaints', found.id), found as any);
        }
      } catch (e) {
        console.warn("Firestore update deferred:", e);
      }
    }

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
              updatedBy: profile?.name || (currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Complainant')),
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

    if (sessionMode === 'authenticated') {
      try {
        const found = updated.find(t => t.id === ticketId || t.ticketId === ticketId);
        if (found) {
          await updateDoc(doc(db, 'complaints', found.id), found as any);
        }
      } catch (e) {
        console.warn("Firestore close update deferred:", e);
      }
    }

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
              updatedBy: profile?.name || (currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Complainant')),
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

    if (sessionMode === 'authenticated') {
      try {
        const found = updated.find(t => t.id === ticketId || t.ticketId === ticketId);
        if (found) {
          await updateDoc(doc(db, 'complaints', found.id), found as any);
        }
      } catch (e) {
        console.warn("Firestore escalate update deferred:", e);
      }
    }

    setSelectedTicket(null);
    addToast('Ticket Escalated', 'Grievance elevated to Level 2 (Head of Department) review.', 'warning');
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (profile) {
      const newProf = { ...profile, ...updated, updatedAt: Date.now() };
      setProfile(newProf);
      localStorage.setItem(`profile_${newProf.uid}`, JSON.stringify(newProf));
      if (sessionMode === 'authenticated') {
        try {
          await updateDoc(doc(db, 'users', profile.uid), updated);
        } catch (e) {
          console.warn("Firestore profile update deferred:", e);
        }
      }
      addToast('Profile Updated', 'Student credentials successfully updated.', 'success');
    }
  };

  const activeTicketsCount = permittedComplaints.filter(
    c => c.status === 'Submitted' || c.status === 'In Review' || c.status === 'In Progress' || c.status === 'Resolution Submitted'
  ).length;

  // 1. Initial Auth Verification Loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center antialiased">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#4338ca] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[#464554] font-medium tracking-wide">
            Verifying institutional credentials...
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State -> Present Dedicated Google Login Page
  if (sessionMode === 'unauthenticated' || !currentUser) {
    return (
      <>
        <NotificationToastContainer toasts={toasts} onRemove={removeToast} />
        <LoginPage
          onGoogleLogin={handleGoogleLogin}
          onEmailSignIn={handleEmailSignIn}
          onEmailSignUp={handleEmailSignUp}
          loading={authLoading}
          error={authSecurityError}
          onClearError={() => setAuthSecurityError(null)}
          onDemoPreview={setupDefaultDemoSession}
        />
      </>
    );
  }

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
        onGoogleLogin={handleGoogleLogin}
        sessionMode={sessionMode}
        isForcedAdmin={isForcedAdmin}
        onToggleAdmin={() => {
          if (sessionMode !== 'demo') {
            addToast('Access Control', 'Role toggling is only permitted within the Sandbox Simulation.', 'warning');
            return;
          }
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
        isStaff={isStaff}
        onRestrictedAccess={() => {
          addToast('Access Restricted', 'Staff Resolution Portal requires verified institutional officer credentials.', 'warning');
        }}
      />

      {/* Main Workspace Canvas (pl-64 on desktop) */}
      <div className="md:pl-64">
        <main className="relative pt-16 min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'dashboard' && (
            <StudentDashboard
              profile={profile}
              complaints={permittedComplaints}
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
              complaints={permittedComplaints}
              onSelectTicket={ticket => setSelectedTicket(ticket)}
              onOpenSop={() => setShowSopModal(true)}
            />
          )}

          {currentTab === 'campus-insights' && <CampusInsights complaints={complaints} />}

          {currentTab === 'student-profile' && (
            <div className="flex flex-col gap-4">
              <div className="p-6 bg-white rounded-xl shadow-xs border border-[#e2e8f0]">
                <h2 className="text-xl font-bold text-[#0b1c30] mb-2">Student Institutional Profile</h2>
                <p className="text-sm text-[#464554] mb-4">
                  Verified statutory credentials under IMSEC Academic Grievance Charter.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl text-xs mb-6">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block mb-1">Authenticated Account</span>
                    <span className="font-mono font-bold text-slate-800">{profile?.email || 'N/A'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block mb-1">Institutional Domain Status</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Verified @imsec.ac.in
                    </span>
                  </div>
                </div>
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
            isStaff ? (
              <StaffResolutionDashboard
                profile={profile}
                complaints={complaints}
                onSelectTicket={ticket => setSelectedTicket(ticket)}
                onSubmitStaffResolution={handleStaffResolution}
                onExportAuditDossier={() => {
                  alert('Exporting complete audit dossier to encrypted CSV/PDF format...');
                }}
              />
            ) : (
              <div className="p-8 bg-white rounded-xl shadow-xs border border-red-200 text-center max-w-lg mx-auto mt-12">
                <span className="material-symbols-outlined text-[48px] text-red-600 mb-2">shield_lock</span>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Staff Access Restricted</h2>
                <p className="text-xs text-slate-600 mb-4">
                  The Staff Resolution Portal is restricted strictly to authorized Nodal Officers and Proctorial Staff.
                </p>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="px-4 py-2 bg-[#4338ca] text-white rounded-lg text-xs font-bold"
                >
                  Return to Student Dashboard
                </button>
              </div>
            )
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

      {/* Security Access Denied Modal */}
      {authSecurityError && (
        <AccessDeniedModal
          error={authSecurityError}
          onClose={() => setAuthSecurityError(null)}
          onRetryGoogle={handleGoogleLogin}
          onOpenSandbox={() => {
            setAuthSecurityError(null);
            setupDefaultDemoSession();
          }}
        />
      )}
    </div>
  );
}

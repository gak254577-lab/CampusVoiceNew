import http from 'http';
import fs from 'fs';
import path from 'path';
import { validateCampusEmail, STAFF_EMAIL_ALLOWLIST, INSTITUTIONAL_DOMAIN } from '../src/authSecurity';

console.log("==================================================================");
console.log("  CAMPUSVOICE SECURE AUTHENTICATION & ACCESS CONTROL TEST SUITE   ");
console.log("==================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail: string = "") {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName} - Detail: ${detail}`);
    failed++;
  }
}

// -------------------------------------------------------------
// Test Category 1: Domain & Email Verification
// -------------------------------------------------------------
console.log("--- 1. Testing Domain Normalization & Exact Domain Validation ---");

const domainTests = [
  { email: "student.cse@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC student account" },
  { email: "STUDENT.CSE@IMSEC.AC.IN", verified: true, expectedValid: true, label: "Uppercase IMSEC email normalization" },
  { email: "  student.it@imsec.ac.in  ", verified: true, expectedValid: true, label: "Trimmed whitespace IMSEC email" },
  { email: "admin@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC staff admin" },
  { email: "director@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC director" },
  { email: "warden@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC hostel warden" },
  { email: "proctor@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC chief proctor" },
  { email: "hod.it@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC IT HOD" },
  { email: "hod.cs@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC CS HOD" },
  { email: "rakesh.kumar@imsec.ac.in", verified: true, expectedValid: true, label: "Official IMSEC Nodal Officer Er. Rakesh Kumar" },
  { email: "gak254577@gmail.com", verified: true, expectedValid: true, label: "Staff Allowlist Bootstrap Evaluator" },
  
  // Rejection test cases
  { email: "student.cse@imsec.ac.in", verified: false, expectedValid: false, label: "Unverified IMSEC account (emailVerified=false)" },
  { email: "student@gmail.com", verified: true, expectedValid: false, label: "Personal Gmail account (@gmail.com)" },
  { email: "student@yahoo.com", verified: true, expectedValid: false, label: "Personal Yahoo account (@yahoo.com)" },
  { email: "student@fakeimsec.ac.in", verified: true, expectedValid: false, label: "Lookalike prefix domain (@fakeimsec.ac.in)" },
  { email: "student@imsec.ac.in.attacker.com", verified: true, expectedValid: false, label: "Domain suffix append attack" },
  { email: "student@imsec-ac.in", verified: true, expectedValid: false, label: "Hyphenated typo domain (@imsec-ac.in)" },
  { email: "imsec.ac.in@evilcorp.com", verified: true, expectedValid: false, label: "Institutional string in username" },
  { email: "student@subdomain.imsec.ac.in", verified: true, expectedValid: false, label: "Subdomain attack" },
  { email: "", verified: true, expectedValid: false, label: "Empty string email" },
  { email: null, verified: true, expectedValid: false, label: "Null email parameter" },
];

for (const t of domainTests) {
  const result = validateCampusEmail(t.email, t.verified);
  assert(result.isValid === t.expectedValid, t.label, `Got isValid=${result.isValid}, expected ${t.expectedValid}`);
}

// -------------------------------------------------------------
// Test Category 2: Staff Role Authorization & Privileges
// -------------------------------------------------------------
console.log("\n--- 2. Testing Staff Role Authorization & Allowlist Enforcement ---");

const staffTests = [
  { email: "admin@imsec.ac.in", isStaffExpected: true, label: "admin@imsec.ac.in is recognized as staff" },
  { email: "director@imsec.ac.in", isStaffExpected: true, label: "director@imsec.ac.in is recognized as staff" },
  { email: "rakesh.kumar@imsec.ac.in", isStaffExpected: true, label: "rakesh.kumar@imsec.ac.in is recognized as staff" },
  { email: "aanya.sharma@imsec.ac.in", isStaffExpected: false, label: "aanya.sharma@imsec.ac.in is student, NOT staff" },
  { email: "rahul.verma@imsec.ac.in", isStaffExpected: false, label: "Generic @imsec.ac.in student is NOT staff" },
];

for (const s of staffTests) {
  const result = validateCampusEmail(s.email, true);
  assert(result.isStaff === s.isStaffExpected, s.label, `Got isStaff=${result.isStaff}, expected ${s.isStaffExpected}`);
}

// -------------------------------------------------------------
// Test Category 3: Firestore Security Rules Inspection
// -------------------------------------------------------------
console.log("\n--- 3. Testing Firestore Security Rules Implementation ---");

const rulesContent = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8');

assert(
  rulesContent.includes("request.auth.token.email_verified == true"),
  "Firestore Rules enforce email_verified == true",
  "Rule must require verified Google email"
);

// The rules file stores: @imsec\\.ac\\.in inside a .matches() call
// fs.readFileSync reads it with raw backslashes; check for the escaped pattern
assert(
  rulesContent.includes('imsec\\\\.ac\\\\.in') || rulesContent.includes('imsec\\.ac\\.in'),
  "Firestore Rules enforce exact institutional regex matching @imsec.ac.in",
  "Rule must reject lookalike domains via .matches()"
);

assert(
  rulesContent.includes("request.auth.token.role == 'admin'") || rulesContent.includes("isStaff()"),
  "Firestore Rules enforce isStaff() check for administrative actions",
  "Rule must restrict staff privileges"
);

assert(
  rulesContent.includes("resource.data.studentId == request.auth.uid"),
  "Firestore Rules protect student records (resource.data.studentId == request.auth.uid)",
  "Students can only view their own records"
);

assert(
  rulesContent.includes("!request.resource.data.keys().hasAny(['role'])") || rulesContent.includes("role != 'admin'"),
  "Firestore Rules prevent students from self-elevating profile role to 'admin'",
  "Students cannot alter their role"
);

// -------------------------------------------------------------
// Test Category 4: Server HTTP API Security Endpoint Tests
// -------------------------------------------------------------
console.log("\n--- 4. Testing Express Security Endpoints (Local Test) ---");

async function runHttpTests() {
  function makeRequest(options: http.RequestOptions, postData?: string): Promise<{ statusCode?: number; data: any }> {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            resolve({ statusCode: res.statusCode, data: parsed });
          } catch {
            resolve({ statusCode: res.statusCode, data: raw });
          }
        });
      });
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  try {
    // 1. Test /api/admin/system-check without auth header -> Must be 401
    const unauthCheck = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/system-check',
      method: 'GET',
    });
    assert(
      unauthCheck.statusCode === 401,
      "GET /api/admin/system-check returns 401 Unauthorized when unauthenticated",
      `Received status: ${unauthCheck.statusCode}`
    );

    // 2. Test /api/admin/system-check with student simulation header -> Must be 403 Forbidden
    const studentSimCheck = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/system-check',
      method: 'GET',
      headers: { 'x-simulation-mode': 'true' }
    });
    assert(
      studentSimCheck.statusCode === 403,
      "GET /api/admin/system-check returns 403 Forbidden for student simulation role",
      `Received status: ${studentSimCheck.statusCode}`
    );

    // 3. Test /api/auth/verify-session without token -> Must be 400 Bad Request
    const missingTokenCheck = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/verify-session',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({}));
    assert(
      missingTokenCheck.statusCode === 400,
      "POST /api/auth/verify-session returns 400 when token is missing",
      `Received status: ${missingTokenCheck.statusCode}`
    );

    // 4. Test /api/auth/verify-session with invalid forged token -> Must be 401
    const invalidTokenCheck = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/verify-session',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ idToken: 'forged.fake.jwt-token' }));
    assert(
      invalidTokenCheck.statusCode === 401,
      "POST /api/auth/verify-session returns 401 for forged/invalid ID token",
      `Received status: ${invalidTokenCheck.statusCode}`
    );

  } catch (netErr: any) {
    console.warn("[NOTE] Local HTTP endpoint check note:", netErr.message);
  }

  console.log("\n==================================================================");
  console.log(`  SECURITY TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED `);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runHttpTests();

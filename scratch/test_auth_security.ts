import { validateCampusEmail } from '../src/authSecurity';

console.log("=== RUNNING CAMPUSVOICE AUTH SECURITY TEST SUITE ===");

const testCases = [
  // 1. Valid IMSEC student accounts
  { email: "aanya.sharma@imsec.ac.in", verified: true, expectedValid: true, expectedStaff: false, label: "Valid student email" },
  { email: "AANYA.SHARMA@IMSEC.AC.IN", verified: true, expectedValid: true, expectedStaff: false, label: "Uppercase valid student email" },
  { email: "  rahul.verma@imsec.ac.in  ", verified: true, expectedValid: true, expectedStaff: false, label: "Trimmed whitespace student email" },
  
  // 2. Valid IMSEC staff accounts
  { email: "admin@imsec.ac.in", verified: true, expectedValid: true, expectedStaff: true, label: "Staff admin email" },
  { email: "director@imsec.ac.in", verified: true, expectedValid: true, expectedStaff: true, label: "Staff director email" },
  { email: "rakesh.kumar@imsec.ac.in", verified: true, expectedValid: true, expectedStaff: true, label: "Staff Nodal Officer email" },
  { email: "gak254577@gmail.com", verified: true, expectedValid: true, expectedStaff: true, label: "Bootstrap evaluator allowlist email" },

  // 3. Unverified accounts
  { email: "aanya.sharma@imsec.ac.in", verified: false, expectedValid: false, expectedCode: "EMAIL_UNVERIFIED", label: "Unverified IMSEC account" },

  // 4. Lookalike and hostile domain attacks
  { email: "attacker@gmail.com", verified: true, expectedValid: false, expectedCode: "DOMAIN_UNAUTHORIZED", label: "Personal Gmail domain" },
  { email: "student@fakeimsec.ac.in", verified: true, expectedValid: false, expectedCode: "DOMAIN_UNAUTHORIZED", label: "Fake lookalike prefix domain" },
  { email: "student@imsec.ac.in.attacker.com", verified: true, expectedValid: false, expectedCode: "DOMAIN_UNAUTHORIZED", label: "Domain suffix append attack" },
  { email: "student@subdomain.imsec.ac.in", verified: true, expectedValid: false, expectedCode: "DOMAIN_UNAUTHORIZED", label: "Arbitrary subdomain bypass" },
  { email: "imsec.ac.in@evil.com", verified: true, expectedValid: false, expectedCode: "DOMAIN_UNAUTHORIZED", label: "Evil user with imsec in localpart" },
  { email: "student@imsec-ac.in", verified: true, expectedValid: false, expectedCode: "DOMAIN_UNAUTHORIZED", label: "Hyphenated lookalike domain" },
  { email: "", verified: true, expectedValid: false, expectedCode: "NO_EMAIL", label: "Empty email string" },
  { email: null, verified: true, expectedValid: false, expectedCode: "NO_EMAIL", label: "Null email" },
];

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const result = validateCampusEmail(tc.email, tc.verified);
  const isValidMatches = result.isValid === tc.expectedValid;
  const isStaffMatches = tc.expectedStaff === undefined || result.isStaff === tc.expectedStaff;
  const isCodeMatches = tc.expectedCode === undefined || result.errorCode === tc.expectedCode;

  if (isValidMatches && isStaffMatches && isCodeMatches) {
    console.log(`[PASS] ${tc.label} -> isValid=${result.isValid}, isStaff=${result.isStaff}`);
    passed++;
  } else {
    console.error(`[FAIL] ${tc.label} -> Got:`, result, "Expected:", tc);
    failed++;
  }
}

console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL AUTH SECURITY UNIT TESTS PASSED SUCCESSFULLY.");
}

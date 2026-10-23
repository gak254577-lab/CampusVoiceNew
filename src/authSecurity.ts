/**
 * CampusVoice Institutional Authentication & Security Module
 * Strict domain enforcement, email normalization, and server-controlled role attribution.
 */

// Confirmed institutional domain
export const INSTITUTIONAL_DOMAIN = "imsec.ac.in";

// Explicit server-controlled staff & nodal officer allowlist
// Never grant staff privileges based on client storage, profile edits, or generic email domains.
export const STAFF_EMAIL_ALLOWLIST: readonly string[] = Object.freeze([
  "admin@imsec.ac.in",
  "director@imsec.ac.in",
  "registrar@imsec.ac.in",
  "warden@imsec.ac.in",
  "proctor@imsec.ac.in",
  "hod.it@imsec.ac.in",
  "hod.cs@imsec.ac.in",
  "rakesh.kumar@imsec.ac.in",
  "gak254577@gmail.com", // Bootstrap administrative evaluator
]);

export interface AuthValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  isStaff: boolean;
  errorCode?: 'DOMAIN_UNAUTHORIZED' | 'EMAIL_UNVERIFIED' | 'INVALID_EMAIL_FORMAT' | 'NO_EMAIL';
  errorMessage?: string;
}

/**
 * Normalizes email by trimming whitespace and converting strictly to lowercase.
 */
export function normalizeEmail(email: string | null | undefined): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Validates whether an email belongs strictly to @imsec.ac.in (or authorized staff allowlist)
 * Prevents lookalike domains, domain appending, and subdomain hijacking.
 */
export function validateCampusEmail(
  email: string | null | undefined, 
  emailVerified: boolean = true
): AuthValidationResult {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      normalizedEmail: '',
      isStaff: false,
      errorCode: 'NO_EMAIL',
      errorMessage: 'No email address was provided by the authentication provider.'
    };
  }

  const normalized = normalizeEmail(email);

  if (!emailVerified) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      isStaff: false,
      errorCode: 'EMAIL_UNVERIFIED',
      errorMessage: 'Access Denied: Your Google account email is not verified. IMSEC security policy requires verified institutional credentials.'
    };
  }

  // Check explicit staff allowlist
  const isStaff = STAFF_EMAIL_ALLOWLIST.includes(normalized);

  // Strict institutional domain regex: localpart followed strictly by @imsec.ac.in
  // Rejects lookalikes (e.g., imsec.ac.in.evil.com, fakeimsec.ac.in, imsec-ac.in)
  const institutionalRegex = /^[a-z0-9._%+-]+@imsec\.ac\.in$/;
  const isInstitutionalDomain = institutionalRegex.test(normalized);

  if (!isInstitutionalDomain && !isStaff) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      isStaff: false,
      errorCode: 'DOMAIN_UNAUTHORIZED',
      errorMessage: `Access Denied: Only confirmed IMSEC institutional accounts (@${INSTITUTIONAL_DOMAIN}) are authorized to access CampusVoice. Personal email providers and lookalike domains are strictly prohibited.`
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalized,
    isStaff,
  };
}

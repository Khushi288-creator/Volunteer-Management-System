/**
 * Shared validation helpers — used across Signup, VolunteerForm, Profile.
 */

/**
 * Validates a phone number string.
 * Rule: exactly 10 numeric digits (strips all non-digits first, then checks length).
 * Returns null if valid, or an error string if invalid.
 */
export function validatePhone(value) {
  if (!value || value.trim() === "") return "Phone number is required";

  const digits = value.replace(/\D/g, "");

  if (digits.length < 10) return "Phone number must be exactly 10 digits";
  if (digits.length > 10) return "Phone number must be exactly 10 digits";

  return null; // valid
}

/**
 * Strips non-numeric characters from a phone input value and caps at 10 digits.
 * Use this in onChange handlers to enforce numeric-only, max-10 input.
 */
export function sanitizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

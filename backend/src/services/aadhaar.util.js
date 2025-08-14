import bcrypt from "bcryptjs";
import crypto from "crypto";

export function normalizeAadhaar(input) {
  return String(input || "").replace(/\s+/g, "");
}

// Crypto-safe SHA-256 for stable key (use bcrypt only for secrets you need to verify later)
export function aadhaarKey(aadhaar) {
  const clean = normalizeAadhaar(aadhaar);
  return crypto.createHash("sha256").update(clean).digest("hex");
}

export function last4(aadhaar) {
  const clean = normalizeAadhaar(aadhaar);
  return clean.slice(-4);
}

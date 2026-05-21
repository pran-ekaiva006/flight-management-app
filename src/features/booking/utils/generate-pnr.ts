/**
 * ─── PNR Code Generator ────────────────────────────────
 * Generates a 6-character alphanumeric PNR code (e.g., "SA4K7M").
 * Prefix "SA" for Source Asia branding.
 */
export function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SA';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

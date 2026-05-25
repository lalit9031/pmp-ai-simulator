/**
 * Admin user detection utility.
 *
 * Uses a hardcoded admin email to identify admin users.
 * The admin email can also be set via NEXT_PUBLIC_ADMIN_EMAIL env var
 * (which takes precedence if present).
 */

const HARDCODED_ADMIN_EMAIL = "wildhogs99@gmail.com";

export function getAdminEmail(): string {
  return (
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? HARDCODED_ADMIN_EMAIL
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === getAdminEmail().toLowerCase().trim();
}

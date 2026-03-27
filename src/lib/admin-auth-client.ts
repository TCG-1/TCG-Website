export const ADMIN_USER_KEY = "tcg_admin_user";
export const ADMIN_SESSION_KEY = "tcg_admin_session";

export type AdminUser = {
  name: string;
  email: string;
  password: string;
};

type AdminAuthResult = { ok: true } | { ok: false; message: string };

const DEFAULT_ADMIN_USER: AdminUser = {
  name: "Tacklers Admin",
  email: "hello@tacklersconsulting.com",
  password: "Hello@123",
};

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_USER_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : DEFAULT_ADMIN_USER;
}

export function storeAdminUser(user: AdminUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function createAdminSession(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ email, loggedInAt: Date.now() }),
  );
}

export function getAdminSession(): { email: string; loggedInAt: number } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
  return raw ? (JSON.parse(raw) as { email: string; loggedInAt: number }) : null;
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function signInAdmin(email: string, password: string): AdminAuthResult {
  const user = getStoredAdminUser();
  if (!user) {
    return { ok: false, message: "No admin account found. Please sign up first." };
  }

  if (user.email.toLowerCase() !== email.toLowerCase() || user.password !== password) {
    return { ok: false, message: "Invalid email or password." };
  }

  createAdminSession(user.email);
  return { ok: true };
}

export function signUpAdmin(user: AdminUser): { ok: true } {
  storeAdminUser(user);
  createAdminSession(user.email);
  return { ok: true };
}

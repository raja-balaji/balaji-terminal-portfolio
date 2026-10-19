// Client-side gate only: it hides the editor UI, it does not protect data.
// Only the SHA-256 of "username:password" is kept in the source, not the plaintext.
const CREDENTIAL_HASH = "c395de6eb4121db386efb90aa252d4b270bf61eef2063e595caca0d31bbbd63d";
const SESSION_KEY = "portfolio-admin";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function checkCredentials(username: string, password: string) {
  if (!globalThis.crypto?.subtle) return false;
  return (await sha256(`${username.trim()}:${password}`)) === CREDENTIAL_HASH;
}

export function isAdminSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAdminSession(on: boolean) {
  try {
    if (on) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

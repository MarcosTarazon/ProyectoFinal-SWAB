const ENV_BASE = import.meta.env.VITE_API_BASE;

// Puertos típicos (ajusta si usas otros)
const CANDIDATES = [
  ENV_BASE,
  "https://localhost:7292",
  "http://localhost:5107",
  "https://localhost:5107",
  "http://localhost:7292",
].filter(Boolean);

let cachedBase = null;

function normalizeBase(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function probe(url, timeoutMs = 1200) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Probamos un endpoint real
    const res = await fetch(`${url}/api/Servicios`, {
      method: "GET",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

async function resolveBase() {
  if (cachedBase) return cachedBase;

  for (const candidate of CANDIDATES) {
    const base = normalizeBase(candidate);
    const ok = await probe(base);
    if (ok) {
      cachedBase = base;
      return cachedBase;
    }
  }

  throw new Error(
    `No se pudo conectar al backend. Probé: ${CANDIDATES.map(normalizeBase).join(", ")}`
  );
}

async function request(path, options = {}) {
  const base = await resolveBase();

  const res = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
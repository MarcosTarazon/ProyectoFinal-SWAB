const API_BASE = import.meta.env.VITE_API_BASE;

// Normaliza por si viene con slash al final
const base = API_BASE?.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;

async function request(path, options = {}) {
  if (!base) {
    throw new Error("Falta VITE_API_BASE en .env.local");
  }

  const res = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Si no es 2xx, levantamos error con texto útil
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  // Para 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
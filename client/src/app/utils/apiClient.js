const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
}

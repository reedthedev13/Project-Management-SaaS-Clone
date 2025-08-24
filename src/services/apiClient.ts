export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  // Handle 204 (No Content)
  if (res.status === 204) return {} as T;

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // ignore body parse errors for empty/no-json responses
  }

  if (!res.ok) {
    // server error handler returns { error, issues? }
    const message = data?.error || `Request failed: ${res.status}`;
    const details = data?.issues ? `: ${JSON.stringify(data.issues)}` : "";
    throw new Error(message + details);
  }

  return data as T;
}

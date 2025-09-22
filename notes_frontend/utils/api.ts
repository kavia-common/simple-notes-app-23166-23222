export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Options = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

// PUBLIC_INTERFACE
export function useApiBase() {
  /** Returns the configured public API base URL. Defaults to /api. */
  const config = useRuntimeConfig();
  return (config.public?.apiBase || '/api') as string;
}

// PUBLIC_INTERFACE
export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  /** Performs a fetch to the backend API with JSON defaults and error handling. */
  const base = useApiBase();
  const url = `${base}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data = await res.json() as any;
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

interface LoginResponse {
  token: string;
  user: any;
}

interface RegisterResponse {
  token: string;
  user: any;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }
  return res.json();
}

export const authApi = {
  login: (identifier: string, password: string) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),
  register: (body: any) =>
    request<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyToken: (token: string) =>
    request<{ user: any }>("/api/auth/verify-token", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
};

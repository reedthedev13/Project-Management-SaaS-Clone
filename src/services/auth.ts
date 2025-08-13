// src/services/auth.ts
export interface User {
  id: number;
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data: LoginResponse = await response.json();

  // Store token for authenticated requests
  localStorage.setItem("token", data.token);

  // Return user info for your app state
  return data.user;
}

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiLogin = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Login failed");
    }
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-12">
      <div className="bg-white rounded-3xl shadow-lg mx-auto p-10 max-w-md w-full">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400
                         transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400
                         transition duration-300"
            />
          </div>

          {error && (
            <p
              className="text-sm text-red-600 text-center font-semibold"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-semibold rounded-lg
                       shadow-md hover:shadow-lg transition duration-300"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

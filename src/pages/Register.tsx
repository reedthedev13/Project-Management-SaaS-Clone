import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const Register: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      const data = await res.json(); // expecting { user, token }

      login(data.user, data.token); // update auth context to logged in
      // Optionally redirect to dashboard here
    } catch (err: any) {
      setApiError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-7">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-lg
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500
                         transition duration-300"
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-5 py-3 border border-gray-300 rounded-lg
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500
                         transition duration-300"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-5 py-3 border border-gray-300 rounded-lg
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500
                         transition duration-300"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors.password}
              </p>
            )}
          </div>

          {apiError && (
            <p
              className="text-sm text-red-600 text-center font-semibold"
              role="alert"
            >
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-semibold rounded-lg
                       shadow-md hover:shadow-lg transition duration-300"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;

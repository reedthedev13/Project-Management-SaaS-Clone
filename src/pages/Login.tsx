import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AnimatedWrapper from "../components/AnimatedWrapper";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops page reload
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login error caught:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedWrapper>
      <div className="max-w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-6 md:px-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg mx-auto p-6 sm:p-8 md:p-10 max-w-sm sm:max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-10 md:mb-12 tracking-tight">
            Welcome Back
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 md:space-y-10"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 text-sm sm:text-base"
              />
            </div>

            {/* ✅ Error message now shows immediately */}
            {error && (
              <p
                className="text-xs sm:text-sm text-red-600 text-center font-semibold"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition duration-300 text-sm sm:text-base"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default Login;

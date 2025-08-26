import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import AnimatedWrapper from "../components/AnimatedWrapper";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
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

    // --- Frontend validation ---
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      await register(email, password, name);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Registration error caught:", err);

      let message = "Registration failed. Please try again.";
      const anyErr = err as any;
      const serverMessage =
        anyErr?.response?.data?.error ||
        anyErr?.response?.data?.message ||
        (Array.isArray(anyErr?.response?.data?.errors)
          ? anyErr.response.data.errors.join(", ")
          : undefined);

      if (serverMessage) message = serverMessage;

      const lower = message.toLowerCase();
      if (lower.includes("unique") || lower.includes("already")) {
        message = "This email is already registered.";
      } else if (lower.includes("password")) {
        message = "Password is invalid or does not meet requirements.";
      }

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full">
          <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
            Create Account
          </h1>
          <form onSubmit={handleSubmit} noValidate className="space-y-7">
            <Input
              id="name"
              label="Name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors.name}
              </p>
            )}

            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors.email}
              </p>
            )}

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors.password}
              </p>
            )}

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
    </AnimatedWrapper>
  );
};

export default Register;

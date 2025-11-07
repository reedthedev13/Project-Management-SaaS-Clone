import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import * as auth from "../services/auth";

export interface User {
  id: number;
  name?: string;
  email?: string;
}

type AuthCtx = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const profile = await auth.me();
        setUser(profile);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await auth.login(email, password);
      if (!res?.token) throw new Error("Invalid login response from server");

      localStorage.setItem("token", res.token);
      setToken(res.token);

      const u = await auth.me();
      setUser(u);
    } catch (err: any) {
      console.error("Login failed:", err);

      // Extract proper error message
      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Invalid email or password";

      // Normalize common cases
      if (message.toLowerCase().includes("invalid"))
        message = "Invalid email or password";
      if (message.toLowerCase().includes("unauthorized"))
        message = "Invalid credentials";

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await auth.register(name, email, password);
      if (!res?.token) throw new Error("Invalid register response from server");

      localStorage.setItem("token", res.token);
      setToken(res.token);

      const u = await auth.me();
      setUser(u);
    } catch (err: any) {
      console.error("Registration failed:", err);
      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Registration failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

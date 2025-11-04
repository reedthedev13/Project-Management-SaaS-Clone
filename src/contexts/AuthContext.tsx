import { createContext, useState, useContext, useEffect } from "react";
import * as auth from "../services/auth";
import { User } from "../contexts/UserContext";

type AuthCtx = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from token or force logout if invalid
  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const u = await auth.me();
        if (!ignore) setUser(u);
      } catch (err) {
        console.warn("Token invalid/expired, logging out.");
        localStorage.removeItem("token");
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await auth.login(email, password); // returns { token, user }
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("token", res.token);
    } catch (err: any) {
      console.error("Login failed:", err);
      // Clear any partial token
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw new Error(err?.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await auth.register(name, email, password); // returns { token, user }
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("token", res.token);
    } catch (err: any) {
      console.error("Registration failed:", err);
      // Clear any partial token
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw new Error(err?.message || "Registration failed");
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

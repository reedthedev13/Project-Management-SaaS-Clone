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

  // Hydrate user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const profile = await auth.me();
        setUser(profile);
      } catch (err) {
        console.warn("Token invalid/expired, logging out.");
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
      localStorage.setItem("token", res.token);
      setToken(res.token);

      const u = await auth.me();
      setUser(u);
    } catch (err: any) {
      console.error("Login failed:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await auth.register(name, email, password);
      localStorage.setItem("token", res.token);
      setToken(res.token);

      const u = await auth.me();
      setUser(u);
    } catch (err: any) {
      console.error("Registration failed:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw err;
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

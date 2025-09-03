import { createContext, useState, useContext, useEffect } from "react";
import * as auth from "../services/auth";
import { apiRequest } from "../services/apiClient";
import { User } from "../contexts/UserContext";

type AuthCtx = {
  token: string | null;
  user: auth.AuthUser | null;
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
  const [user, setUser] = useState<auth.AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from token
  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const u = await auth.me();
        if (!ignore) setUser(u);
      } catch (err) {
        localStorage.removeItem("token");
        if (!ignore) {
          setToken(null);
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
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const data = await apiRequest<{ token: string; user: User }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err?.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await auth.register(name, email, password);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
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

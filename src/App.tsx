import React from "react";
import type { JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  // const { user } = useAuth();

  // Optional: show nothing or a spinner while auth state is loading
  // if (user === undefined) return null; // temporary comment out to allow easy access to other components

  /* if (!user) {
    return <Navigate to="/auth" replace />;
  }
*/
  return children;
};

const RequireAuthRedirect: React.FC = () => {
  const { user } = useAuth();

  // Optional: wait while loading auth state
  if (user === undefined) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/auth" replace />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<RequireAuthRedirect />} />
          <Route
            path="*"
            element={<p className="text-center mt-20">404 - Page Not Found</p>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

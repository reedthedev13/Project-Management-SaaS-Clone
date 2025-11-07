import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

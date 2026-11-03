import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./adminCredentials";

const AuthContext = createContext(null);
const SESSION_KEY = "snapbuy-auth-session";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readSession = () => {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (
      session &&
      ["admin", "customer"].includes(session.role) &&
      typeof session.email === "string"
    ) {
      return { role: session.role, email: session.email };
    }
  } catch {
    // Ignore malformed temporary session data.
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSession);

  const login = useCallback((emailInput, password) => {
    const email = emailInput.trim();
    const normalizedEmail = email.toLowerCase();
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();
    let role;

    if (normalizedEmail === adminEmail) {
      if (password !== ADMIN_PASSWORD) {
        return { success: false, error: "Invalid email or password." };
      }
      role = "admin";
    } else if (EMAIL_PATTERN.test(email) && password.trim()) {
      role = "customer";
    } else {
      return { success: false, error: "Enter a valid email and password." };
    }

    const nextUser = { role, email };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return { success: true, role };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

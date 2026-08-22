import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerCompany,
  logoutUser,
  fetchCurrentUser,
} from "../services/authService.js";

const AuthContext = createContext(null);

// Wrap the app once (in main.jsx) so any page can read the logged-in
// user with useAuth() and call login/register/logout.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for a saved session

  // On first load, check localStorage for a saved token and, if one
  // exists, ask the backend who it belongs to. This is what makes
  // "persistent login" work after a page refresh.
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("dayflow_token");
      const savedUser = localStorage.getItem("dayflow_user");

      if (!token || !savedUser) {
        setLoading(false);
        return;
      }

      try {
        setUser(JSON.parse(savedUser));
        const { user: freshUser } = await fetchCurrentUser();
        setUser(freshUser);
        localStorage.setItem("dayflow_user", JSON.stringify(freshUser));
      } catch {
        // Token is invalid/expired — clear the stale session.
        localStorage.removeItem("dayflow_token");
        localStorage.removeItem("dayflow_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  function persistSession(token, user) {
    localStorage.setItem("dayflow_token", token);
    localStorage.setItem("dayflow_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(loginId, password) {
    const { token, user } = await loginUser({ loginId, password });
    persistSession(token, user);
    return user;
  }

  async function register(formData) {
    const { token, user } = await registerCompany(formData);
    persistSession(token, user);
    return user;
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("dayflow_token");
      localStorage.removeItem("dayflow_user");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so pages write `const { user, login } = useAuth();`
// instead of importing useContext + AuthContext everywhere.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}

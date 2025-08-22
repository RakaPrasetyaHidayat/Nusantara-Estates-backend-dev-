import React, { createContext, useState, useEffect, useContext } from "react";

import {
  BrowserRouter as Router,  Routes, Route, useNavigate, Navigate
} from "react-router-dom";

// Pages
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import AdminPage from "./Pages/adminpage/AdminPage";
import ScrollToTop from "./Components/ScrollOnTop";
import InputData from "./Components/inputData/InputData";
import DetailRumah from "./Components/detailRumah/DetailRumah";
import Navbar from "./Components/navbar/navbar"
import AdminNavbar from "./Components/navbar/AdminNavbar";
// ===== Auth Context =====
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function ProtectedRoute({ children, adminOnly = false }) {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/LoginForm" replace />;
  }
  if (adminOnly && !authState.user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user) {
      setAuthState({ token, user, isAuthenticated: true });
    }
    setLoading(false);
  }, []);

  const login = async (credentials, navigate) => {
    const API_URL = "http://localhost:5174";
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.success) {
      setAuthState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect sesuai role
      if (data.user.isAdmin) {
        navigate("/AdminPage");
      } else {
        navigate("/");
      }
      return data;
    }
    throw new Error(data.message || "Login gagal");
  };

  const logout = () => {
    setAuthState({ token: null, user: null, isAuthenticated: false });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ===== Layout Wrapper (Navbar berbeda) =====
function Layout({ children }) {
  const { authState } = useAuth();
  const isAdmin = authState.user?.isAdmin;

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      {children}
    </>
  );
}

// ===== App =====
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route path="/LoginForm" element={<LoginPage />} />

          {/* Detail Rumah (akses user & admin) */}
          <Route
            path="/DetailRumah/:id"
            element={
              <Layout>
                <DetailRumah />
              </Layout>
            }
          />

          {/* Admin */}
          <Route
            path="/AdminPage"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/InputData"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <InputData />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/InputData/:id"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <InputData />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

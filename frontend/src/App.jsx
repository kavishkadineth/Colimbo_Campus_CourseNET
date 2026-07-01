import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminPanel from "./pages/AdminPanel";
import CourseDetails from "./pages/CourseDetails";
import UserCourses from "./pages/UserCourses";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PublicLayout from "./components/PublicLayout";
import { apiClient, clearAuthToken, getAuthToken } from "./lib/auth";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(Boolean(getAuthToken()));

  useEffect(() => {
    if (!getAuthToken()) {
      return;
    }

    apiClient
      .get("/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        clearAuthToken();
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  const logout = () => {
    apiClient
      .post("/logout")
      .finally(() => {
        clearAuthToken();
        setUser(null);
      });
  };

  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span className="loading-text">Authenticating…</span>
      </div>
    );
  }

  const isSystemAdmin = user?.role === "system_admin";
  const isLectureAdmin = user?.role === "lecture_admin";
  const isAdmin = isSystemAdmin || isLectureAdmin;
  const adminHome = isSystemAdmin ? "/admin/users" : "/admin";

  return (
    <BrowserRouter>
      <div className="bg-mesh" />
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminPanel
              user={user}
              onLogin={setUser}
              onLogout={logout}
            />
          }
        />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        
        {/* Public Routes with Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<UserCourses />} />
          <Route path="/courses/:id" element={<CourseDetails backTo="/courses" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

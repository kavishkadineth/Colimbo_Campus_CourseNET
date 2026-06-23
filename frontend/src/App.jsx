import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminPanel from "./pages/AdminPanel";
import CourseDetails from "./pages/CourseDetails";
import UserCourses from "./pages/UserCourses";
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
    return <div className="container mt-5">Checking login...</div>;
  }

  const isSystemAdmin = user?.role === "system_admin";
  const isLectureAdmin = user?.role === "lecture_admin";
  const isAdmin = isSystemAdmin || isLectureAdmin;
  const adminHome = isSystemAdmin ? "/admin/users" : "/admin";

  return (
    <BrowserRouter>
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={isAdmin ? <Navigate to={adminHome} replace /> : <UserCourses />}
          />
          <Route
            path="/courses/:id"
            element={
              isAdmin
                ? <Navigate to={adminHome} replace />
                : <CourseDetails backTo="/" />
            }
          />
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
          <Route path="/course-catalog" element={<Navigate to="/" replace />} />
          <Route path="/course-catalog/:id" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

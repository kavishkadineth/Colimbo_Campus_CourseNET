import { Link, Navigate, Route, Routes } from "react-router-dom";

import AdminUsers from "./AdminUsers";
import CourseDetails from "./CourseDetails";
import Courses from "./Courses";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Organizations from "./Organizations";

function AdminPanel({ user, onLogin, onLogout, basePath = "/admin" }) {
  const isSystemAdmin = user?.role === "system_admin";
  const isLectureAdmin = user?.role === "lecture_admin";
  const isAdmin = isSystemAdmin || isLectureAdmin;
  const roleLabel = isSystemAdmin ? "System Admin" : "Lecture Admin";
  const pathFor = (path = "") => `${basePath}${path}` || "/";
  const adminHome = isSystemAdmin ? pathFor("/users") : pathFor();
  const loginPath = pathFor("/login");

  if (user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const adminHeader = user && (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0">Admin Panel</h1>

        <div className="d-flex align-items-center gap-3">
          <span>{user.name} ({roleLabel})</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <nav className="mb-3">
        {isLectureAdmin && (
          <Link to={pathFor()} className="btn btn-success me-2">
            Dashboard
          </Link>
        )}

        {isLectureAdmin && (
          <Link to={pathFor("/organizations")} className="btn btn-secondary me-2">
            Organizations
          </Link>
        )}

        {isLectureAdmin && (
          <Link to={pathFor("/courses")} className="btn btn-dark">
            Courses
          </Link>
        )}

        {isSystemAdmin && (
          <Link to={pathFor("/users")} className="btn btn-primary">
            Users
          </Link>
        )}
      </nav>
    </>
  );

  return (
    <Routes>
      <Route
        path="login"
        element={user ? <Navigate to={adminHome} replace /> : <Login onLogin={onLogin} />}
      />
      <Route
        index
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isLectureAdmin
              ? <>{adminHeader}<Dashboard /></>
              : <Navigate to={pathFor("/users")} replace />
        }
      />
      <Route
        path="organizations"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isLectureAdmin
              ? <>{adminHeader}<Organizations /></>
              : <Navigate to={adminHome} replace />
        }
      />
      <Route
        path="courses"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isLectureAdmin
              ? <>{adminHeader}<Courses /></>
              : <Navigate to={adminHome} replace />
        }
      />
      <Route
        path="courses/:id"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isLectureAdmin
              ? <>{adminHeader}<CourseDetails backTo={pathFor("/courses")} /></>
              : <Navigate to={adminHome} replace />
        }
      />
      <Route
        path="users"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isSystemAdmin
              ? <>{adminHeader}<AdminUsers /></>
              : <Navigate to={adminHome} replace />
        }
      />
      <Route path="*" element={<Navigate to={user ? adminHome : loginPath} replace />} />
    </Routes>
  );
}

export default AdminPanel;

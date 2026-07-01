import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

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
  const adminHome = pathFor();
  const loginPath = pathFor("/login");

  const location = useLocation();

  if (user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    ...(isAdmin ? [
      {
        to: pathFor(),
        label: "Dashboard",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        ),
      },
      {
        to: pathFor("/organizations"),
        label: "Organizations",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ),
      },
      {
        to: pathFor("/courses"),
        label: "Courses",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        ),
      },
    ] : []),
    ...(isSystemAdmin ? [
      {
        to: pathFor("/users"),
        label: "Admin Users",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
    ] : []),
  ];

  const isActive = (path) => {
    if (path === pathFor()) {
      return location.pathname === path || location.pathname === path + "/";
    }
    return location.pathname.startsWith(path);
  };

  const adminSidebar = user && (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-icon">C</div>
        <span className="admin-sidebar-logo-text">CourseNET</span>
      </div>

      {/* Nav */}
      <nav className="admin-sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${isActive(item.to) ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="user-avatar">
            {user.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="admin-user-details">
            <div className="admin-user-name">{user.name}</div>
            <div className="admin-user-role">{roleLabel}</div>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "6px",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--rose-light)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
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
            : isAdmin
              ? (
                <div className="admin-layout">
                  {adminSidebar}
                  <main className="admin-content">
                    <div className="admin-page">
                      <Dashboard />
                    </div>
                  </main>
                </div>
              )
              : <Navigate to={pathFor("/users")} replace />
        }
      />
      <Route
        path="organizations"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isAdmin
              ? (
                <div className="admin-layout">
                  {adminSidebar}
                  <main className="admin-content">
                    <div className="admin-page">
                      <Organizations />
                    </div>
                  </main>
                </div>
              )
              : <Navigate to={adminHome} replace />
        }
      />
      <Route
        path="courses"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isAdmin
              ? (
                <div className="admin-layout">
                  {adminSidebar}
                  <main className="admin-content">
                    <div className="admin-page">
                      <Courses />
                    </div>
                  </main>
                </div>
              )
              : <Navigate to={adminHome} replace />
        }
      />
      <Route
        path="courses/:id"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isAdmin
              ? (
                <div className="admin-layout">
                  {adminSidebar}
                  <main className="admin-content">
                    <CourseDetails backTo={pathFor("/courses")} />
                  </main>
                </div>
              )
              : <Navigate to={adminHome} replace />
        }
      />
      <Route
        path="users"
        element={
          !user
            ? <Navigate to={loginPath} replace />
            : isSystemAdmin
              ? (
                <div className="admin-layout">
                  {adminSidebar}
                  <main className="admin-content">
                    <div className="admin-page">
                      <AdminUsers />
                    </div>
                  </main>
                </div>
              )
              : <Navigate to={adminHome} replace />
        }
      />
      <Route path="*" element={<Navigate to={user ? adminHome : loginPath} replace />} />
    </Routes>
  );
}

export default AdminPanel;

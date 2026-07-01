import { useEffect, useState } from "react";
import { apiClient } from "../lib/auth";

function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState([]);
  
  // Add User State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lecture_admin");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  
  // Edit User State
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("lecture_admin");
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordConfirmation, setEditPasswordConfirmation] = useState("");
  
  // UI State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const roleLabels = {
    system_admin: "System Admin",
    lecture_admin: "Lecture Admin",
    user: "User",
  };

  const roleColors = {
    system_admin: "var(--amber-light)",
    lecture_admin: "var(--accent-light)",
    user: "var(--emerald-light)",
  };

  const fetchAdminUsers = () => {
    apiClient
      .get("/admin-users")
      .then((response) => {
        setAdminUsers(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to load admin users.");
      });
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const addAdminUser = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    apiClient
      .post("/admin-users", {
        name,
        email,
        role,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then(() => {
        setName("");
        setEmail("");
        setRole("lecture_admin");
        setPassword("");
        setPasswordConfirmation("");
        setSuccess("User created successfully.");
        setIsAddModalOpen(false);
        fetchAdminUsers();
      })
      .catch((error) => {
        const errors = error.response?.data?.errors;
        const firstError = errors && Object.values(errors).flat()[0];
        setError(firstError || error.response?.data?.message || "Unable to create user.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startEdit = (adminUser) => {
    setEditId(adminUser.id);
    setEditName(adminUser.name);
    setEditEmail(adminUser.email);
    setEditRole(adminUser.role);
    setEditPassword("");
    setEditPasswordConfirmation("");
    setError("");
    setSuccess("");
    setIsEditModalOpen(true);
  };

  const updateAdminUser = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setEditLoading(true);

    apiClient
      .put(`/admin-users/${editId}`, {
        name: editName,
        email: editEmail,
        role: editRole,
        password: editPassword,
        password_confirmation: editPasswordConfirmation,
      })
      .then(() => {
        setEditId(null);
        setSuccess("User updated successfully.");
        setIsEditModalOpen(false);
        fetchAdminUsers();
      })
      .catch((error) => {
        const errors = error.response?.data?.errors;
        const firstError = errors && Object.values(errors).flat()[0];
        setError(firstError || error.response?.data?.message || "Unable to update user.");
      })
      .finally(() => {
        setEditLoading(false);
      });
  };

  const deleteAdminUser = (adminUser) => {
    if (!window.confirm(`Are you sure you want to delete ${adminUser.name}?`)) {
      return;
    }

    setError("");
    setSuccess("");

    apiClient
      .delete(`/admin-users/${adminUser.id}`)
      .then(() => {
        if (editId === adminUser.id) {
          setIsEditModalOpen(false);
        }
        setSuccess("User deleted.");
        fetchAdminUsers();
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to delete user.");
      });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ paddingTop: "0" }}>
        <div className="page-header-inner">
          <div>
            <h1 className="page-title">Admin Users</h1>
            <p className="page-subtitle">Manage system and lecture administrators</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => { setError(""); setSuccess(""); setIsAddModalOpen(true); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Add Admin User
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" style={{ marginBottom: "24px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {success}
        </div>
      )}

      {/* List */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Current Administrators
          </h3>
          <span className="badge badge-gray">{adminUsers.length} Users</span>
        </div>

        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((adminUser) => (
                <tr key={adminUser.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>#{adminUser.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        className="user-avatar"
                        style={{ width: "26px", height: "26px", fontSize: "11px", background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                      >
                        {adminUser.name.charAt(0).toUpperCase()}
                      </div>
                      <strong>{adminUser.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{adminUser.email}</td>
                  <td>
                    <span 
                      className={`badge badge-${adminUser.role === 'system_admin' ? 'amber' : 'accent'}`}
                    >
                      {roleLabels[adminUser.role] || adminUser.role}
                    </span>
                  </td>
                  <td>{new Date(adminUser.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="action-row" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Edit"
                        onClick={() => startEdit(adminUser)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Delete"
                        style={{ color: "var(--rose-light)" }}
                        onClick={() => deleteAdminUser(adminUser)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {adminUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px 24px" }}>
                    <div className="empty-state" style={{ padding: 0 }}>
                      <div className="empty-state-icon" style={{ fontSize: "24px", width: "48px", height: "48px" }}>👥</div>
                      <h3 style={{ fontSize: "16px" }}>No admin users found</h3>
                      <p>Get started by adding your first admin user.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h3>Add Admin User</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={addAdminUser}>
              <div className="modal-body">
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Admin Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    required
                  >
                    <option value="system_admin">System Admin</option>
                    <option value="lecture_admin">Lecture Admin</option>
                  </select>
                </div>

                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength="8"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={passwordConfirmation}
                      onChange={(event) => setPasswordConfirmation(event.target.value)}
                      minLength="8"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsEditModalOpen(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amber-light)" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Admin User
              </h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            <form onSubmit={updateAdminUser}>
              <div className="modal-body">
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editEmail}
                      onChange={(event) => setEditEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Role</label>
                  <select
                    className="form-select"
                    value={editRole}
                    onChange={(event) => setEditRole(event.target.value)}
                    required
                  >
                    <option value="system_admin">System Admin</option>
                    <option value="lecture_admin">Lecture Admin</option>
                  </select>
                </div>

                <div className="divider"></div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "-12px", marginBottom: "8px" }}>
                  Leave password fields empty to keep the current password.
                </p>

                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Leave blank to ignore"
                      value={editPassword}
                      onChange={(event) => setEditPassword(event.target.value)}
                      minLength="8"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Leave blank to ignore"
                      value={editPasswordConfirmation}
                      onChange={(event) => setEditPasswordConfirmation(event.target.value)}
                      minLength="8"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

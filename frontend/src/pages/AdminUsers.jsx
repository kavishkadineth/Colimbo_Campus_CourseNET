import { useEffect, useState } from "react";
import { apiClient } from "../lib/auth";

function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lecture_admin");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("lecture_admin");
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordConfirmation, setEditPasswordConfirmation] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const roleLabels = {
    system_admin: "System Admin",
    lecture_admin: "Lecture Admin",
    user: "User",
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

  const startEdit = (adminUser) => {
    setEditId(adminUser.id);
    setEditName(adminUser.name);
    setEditEmail(adminUser.email);
    setEditRole(adminUser.role);
    setEditPassword("");
    setEditPasswordConfirmation("");
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
    setEditRole("lecture_admin");
    setEditPassword("");
    setEditPasswordConfirmation("");
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
        cancelEdit();
        setSuccess("User updated.");
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
    if (!window.confirm(`Delete ${adminUser.name}?`)) {
      return;
    }

    setError("");
    setSuccess("");

    apiClient
      .delete(`/admin-users/${adminUser.id}`)
      .then(() => {
        if (editId === adminUser.id) {
          cancelEdit();
        }

        setSuccess("User deleted.");
        fetchAdminUsers();
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to delete user.");
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
        setSuccess("User created.");
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Users</h2>

      <div className="card shadow mb-4">
        <div className="card-header">
          <h4 className="mb-0">Add Admin</h4>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={addAdminUser}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength="8"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  minLength="8"
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>
      </div>

      {editId && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning">
            <h4 className="mb-0">Edit Admin</h4>
          </div>

          <div className="card-body">
            <form onSubmit={updateAdminUser}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
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

                <div className="col-md-6 mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={editPassword}
                    onChange={(event) => setEditPassword(event.target.value)}
                    minLength="8"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm New Password"
                    value={editPasswordConfirmation}
                    onChange={(event) => setEditPasswordConfirmation(event.target.value)}
                    minLength="8"
                  />
                </div>
              </div>

              <button className="btn btn-success me-2" disabled={editLoading}>
                {editLoading ? "Updating..." : "Update Admin"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow">
        <div className="card-header">
          <h4 className="mb-0">Current Admins</h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th width="180">Actions</th>
                </tr>
              </thead>

              <tbody>
                {adminUsers.map((adminUser) => (
                  <tr key={adminUser.id}>
                    <td>{adminUser.id}</td>
                    <td>{adminUser.name}</td>
                    <td>{adminUser.email}</td>
                    <td>
                      {roleLabels[adminUser.role] || adminUser.role}
                    </td>
                    <td>{new Date(adminUser.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(adminUser)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteAdminUser(adminUser)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {adminUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;

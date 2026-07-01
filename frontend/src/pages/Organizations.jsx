import { useEffect, useState } from "react";
import { apiClient } from "../lib/auth";

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [department, setDepartment] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOrganizations = () => {
    apiClient
      .get("/organizations")
      .then((response) => {
        setOrganizations(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const addOrganization = (e) => {
    e.preventDefault();
    apiClient
      .post("/organizations", { name, type, department })
      .then(() => {
        setName("");
        setType("");
        setDepartment("");
        setIsAddModalOpen(false);
        fetchOrganizations();
      })
      .catch((error) => console.error(error));
  };

  const deleteOrganization = (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) {
      return;
    }

    apiClient
      .delete(`/organizations/${id}`)
      .then(() => {
        fetchOrganizations();
      })
      .catch((error) => console.error(error));
  };

  const startEdit = (org) => {
    setEditId(org.id);
    setEditName(org.name);
    setEditType(org.type);
    setEditDepartment(org.department || "");
    setIsEditModalOpen(true);
  };

  const updateOrganization = (e) => {
    e.preventDefault();
    apiClient
      .put(`/organizations/${editId}`, {
        name: editName,
        type: editType,
        department: editDepartment,
      })
      .then(() => {
        setEditId(null);
        setEditName("");
        setEditType("");
        setEditDepartment("");
        setIsEditModalOpen(false);
        fetchOrganizations();
      })
      .catch((error) => console.error(error));
  };

  const getOrgInitial = (orgName) => (orgName ? orgName.charAt(0).toUpperCase() : "?");

  const orgColors = [
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
    "linear-gradient(135deg,#10b981,#059669)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#0ea5e9,#6366f1)",
    "linear-gradient(135deg,#f43f5e,#8b5cf6)",
  ];

  const getOrgColor = (orgName) => {
    if (!orgName) return orgColors[0];
    const idx = orgName.charCodeAt(0) % orgColors.length;
    return orgColors[idx];
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ paddingTop: "0" }}>
        <div className="page-header-inner">
          <div>
            <h1 className="page-title">Organizations</h1>
            <p className="page-subtitle">Manage universities and institutions</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Organization
          </button>
        </div>
      </div>

      {/* List */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            All Organizations
          </h3>
          <span className="badge badge-gray">{organizations.length} Total</span>
        </div>

        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Organization Name</th>
                <th>Type</th>
                <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>#{org.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        className="org-avatar"
                        style={{ background: getOrgColor(org.name), width: "28px", height: "28px", fontSize: "11px" }}
                      >
                        {getOrgInitial(org.name)}
                      </div>
                      <strong>{org.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span className="badge badge-gray">{org.type}</span>
                      {org.department && (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Dept: {org.department}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="action-row" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Edit"
                        onClick={() => startEdit(org)}
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
                        onClick={() => deleteOrganization(org.id)}
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

              {organizations.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "48px 24px" }}>
                    <div className="empty-state" style={{ padding: 0 }}>
                      <div className="empty-state-icon" style={{ fontSize: "24px", width: "48px", height: "48px" }}>🏢</div>
                      <h3 style={{ fontSize: "16px" }}>No organizations found</h3>
                      <p>Get started by adding your first organization.</p>
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
              <h3>Add Organization</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={addOrganization}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Stanford University"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization Type</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. University, Institute, Corporate"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Organization</button>
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
                Edit Organization
              </h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            <form onSubmit={updateOrganization}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Organizations;

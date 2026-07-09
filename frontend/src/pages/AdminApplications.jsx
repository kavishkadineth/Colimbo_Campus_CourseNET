import { useEffect, useState } from "react";
import { apiClient, getBaseUrl } from "../lib/auth";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchApplications = () => {
    setLoading(true);
    let url = "/applications?";
    if (filterCourse !== "all") url += `course_id=${filterCourse}&`;
    if (filterStatus !== "all") url += `status=${filterStatus}&`;

    apiClient
      .get(url)
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load applications");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, [filterCourse, filterStatus]);

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/applications/${id}/status`, { status: newStatus });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await apiClient.delete(`/applications/${id}`);
      setApplications(applications.filter(app => app.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete application");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-badge-green';
      case 'rejected': return 'status-badge-red';
      case 'reviewing': return 'status-badge-blue';
      default: return 'status-badge-gray';
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h2>Applications</h2>
          <p>Review and manage student applications</p>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}

        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", background: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>Filter by Status</label>
            <select 
              className="form-control" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: "200px" }}>
            <div className="spinner"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>No applications found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {applications.map((app) => (
              <div key={app.id} style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${app.status === 'accepted' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : app.status === 'reviewing' ? '#3b82f6' : '#94a3b8'}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>{app.full_name}</h3>
                    <div style={{ color: "#64748b", fontSize: "14px" }}>
                      Applying for: <strong style={{ color: "#334155" }}>{app.course?.course_name || "Unknown Course"}</strong>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span className={`status-badge ${getStatusBadgeClass(app.status)}`} style={{ textTransform: "capitalize", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                      {app.status}
                    </span>
                    <select 
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <button 
                      onClick={() => deleteApplication(app.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}
                      title="Delete Application"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div>
                    <h4 style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>Contact Info</h4>
                    <div style={{ fontSize: "14px", color: "#334155" }}>
                      <p style={{ margin: "4px 0" }}>📧 {app.email}</p>
                      <p style={{ margin: "4px 0" }}>📱 {app.phone}</p>
                      <p style={{ margin: "4px 0" }}>📍 {app.address}</p>
                      <p style={{ margin: "4px 0" }}>🪪 ID: {app.id_number}</p>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>Academic Info</h4>
                    <div style={{ fontSize: "14px", color: "#334155" }}>
                      <p style={{ margin: "4px 0" }}><strong>A/L Index:</strong> {app.al_index_number}</p>
                      <div style={{ marginTop: "8px", background: "white", padding: "8px", borderRadius: "4px", border: "1px solid #e2e8f0", whiteSpace: "pre-wrap", fontSize: "13px" }}>
                        {app.al_results}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    Submitted on: {new Date(app.created_at).toLocaleString()}
                  </div>
                  {app.payment_sheet && (
                    <a 
                      href={`${getBaseUrl()}${app.payment_sheet}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-public-submit"
                      style={{ padding: "8px 16px", fontSize: "13px", textDecoration: "none", display: "inline-block" }}
                    >
                      📎 View Payment Sheet
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;

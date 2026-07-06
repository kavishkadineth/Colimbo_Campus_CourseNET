import { useEffect, useState } from "react";
import { apiClient } from "../lib/auth";

function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchInquiries = () => {
    setLoading(true);
    apiClient
      .get("/inquiries")
      .then((res) => setInquiries(res.data))
      .catch(() => setError("Failed to load inquiries."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openDetail = (inquiry) => {
    if (inquiry.status === "new") {
      setDetailLoading(true);
      apiClient
        .get(`/inquiries/${inquiry.id}`)
        .then((res) => {
          setSelected(res.data);
          // Update in list too
          setInquiries((prev) =>
            prev.map((i) => (i.id === res.data.id ? { ...i, status: "read" } : i))
          );
        })
        .finally(() => setDetailLoading(false));
    } else {
      setSelected(inquiry);
    }
  };

  const deleteInquiry = (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    setError("");
    setSuccess("");
    apiClient
      .delete(`/inquiries/${id}`)
      .then(() => {
        setSuccess("Inquiry deleted.");
        setSelected(null);
        fetchInquiries();
      })
      .catch(() => setError("Failed to delete inquiry."));
  };

  const filtered = inquiries.filter((i) => {
    if (filterStatus === "new") return i.status === "new";
    if (filterStatus === "read") return i.status === "read";
    return true;
  });

  const newCount = inquiries.filter((i) => i.status === "new").length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ paddingTop: "0" }}>
        <div className="page-header-inner">
          <div>
            <h1 className="page-title">Inquiries</h1>
            <p className="page-subtitle">Messages submitted via the public Contact form</p>
          </div>
          {newCount > 0 && (
            <div style={{ background: "var(--rose-light)", color: "white", padding: "8px 18px", borderRadius: "20px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {newCount} New
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger" style={{ marginBottom: "24px" }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ marginBottom: "24px" }}>{success}</div>}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["all", "new", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: filterStatus === f ? "var(--accent-light)" : "var(--border)",
              background: filterStatus === f ? "var(--accent-light)" : "transparent",
              color: filterStatus === f ? "white" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}
          >
            {f === "all" ? `All (${inquiries.length})` : f === "new" ? `New (${inquiries.filter(i=>i.status==="new").length})` : `Read (${inquiries.filter(i=>i.status==="read").length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div className="spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Received</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    style={{ cursor: "pointer", fontWeight: inq.status === "new" ? 700 : 400 }}
                    onClick={() => openDetail(inq)}
                  >
                    <td>
                      {inq.status === "new" ? (
                        <span className="badge badge-rose" style={{ display: "flex", alignItems: "center", gap: "5px", width: "fit-content" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
                          New
                        </span>
                      ) : (
                        <span className="badge badge-gray">Read</span>
                      )}
                    </td>
                    <td><strong>{inq.name}</strong></td>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{inq.email}</td>
                    <td>{inq.subject}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{formatDate(inq.created_at)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Delete"
                        style={{ color: "var(--rose-light)" }}
                        onClick={(e) => { e.stopPropagation(); deleteInquiry(inq.id); }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "48px 24px" }}>
                      <div className="empty-state" style={{ padding: 0 }}>
                        <div className="empty-state-icon" style={{ fontSize: "24px", width: "48px", height: "48px" }}>📬</div>
                        <h3 style={{ fontSize: "16px" }}>No inquiries found</h3>
                        <p>When users submit the contact form, their messages will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="modal modal-wide" style={{ maxWidth: "620px" }}>
            <div className="modal-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Inquiry Detail
              </h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              {detailLoading ? (
                <div style={{ textAlign: "center", padding: "40px" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Sender Info */}
                  <div style={{ background: "var(--surface-2)", borderRadius: "10px", padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>From</div>
                      <div style={{ fontWeight: 700 }}>{selected.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Email</div>
                      <a href={`mailto:${selected.email}`} style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}>{selected.email}</a>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Subject</div>
                      <div style={{ fontWeight: 600 }}>{selected.subject}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Received</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>{formatDate(selected.created_at)}</div>
                    </div>
                  </div>
                  {/* Message */}
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Message</div>
                    <div style={{ background: "var(--surface-2)", borderRadius: "10px", padding: "18px 20px", lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-line" }}>
                      {selected.message}
                    </div>
                  </div>
                  {/* Reply Button */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                      className="btn btn-primary"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Reply via Email
                    </a>
                    <button
                      className="btn btn-ghost"
                      style={{ color: "var(--rose-light)" }}
                      onClick={() => deleteInquiry(selected.id)}
                    >
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inquiries;

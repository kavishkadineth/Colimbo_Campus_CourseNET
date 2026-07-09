import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/auth";

function PublicOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiClient
      .get("/organizations")
      .then((response) => {
        setOrganizations(response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Unable to load organizations.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.type && org.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.department && org.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="public-page">
      <div className="public-page-header">
        <h1>Partner Organizations</h1>
        <p>Explore top-ranking universities and educational institutions hosting our programmes</p>
      </div>

      <div className="public-container">
        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", marginTop: "20px" }}>
          <div style={{ color: "#64748b", fontWeight: 600, fontSize: "15px" }}>
            Showing {loading ? "..." : filteredOrgs.length} institutions
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "10px 14px", fontSize: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", background: "white", width: "260px" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "24px" }}>
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card skeleton" style={{ height: "260px" }}>
                <div style={{ padding: "24px" }}>
                  <div className="skeleton-text" style={{ width: "40%", background: "rgba(0,0,0,0.1)" }}></div>
                  <div className="skeleton-text" style={{ width: "80%", height: "20px", background: "rgba(0,0,0,0.1)", marginTop: "12px" }}></div>
                  <div className="skeleton-text" style={{ width: "100%", height: "80px", background: "rgba(0,0,0,0.1)", marginTop: "16px" }}></div>
                </div>
              </div>
            ))
          ) : filteredOrgs.map((org) => (
            <div 
              key={org.id} 
              style={{ 
                background: "white", 
                borderRadius: "12px", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)", 
                padding: "28px", 
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ background: "#00b14f", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>
                    {org.type || "Institution"}
                  </span>
                  {org.department && (
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                      📍 {org.department}
                    </span>
                  )}
                </div>

                <h3 style={{ color: "#0b1f42", fontSize: "22px", margin: "8px 0 16px 0", fontWeight: "800", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {org.name}
                </h3>

                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "14px", marginTop: "14px" }}>
                  <h4 style={{ color: "#4b5563", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "700", marginBottom: "8px" }}>
                    Offered Programmes ({org.courses?.length || 0})
                  </h4>
                  {org.courses && org.courses.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {org.courses.slice(0, 3).map((course) => (
                        <Link 
                          key={course.id} 
                          to={`/courses/${course.id}`} 
                          style={{ color: "#00b14f", textDecoration: "none", fontSize: "14px", fontWeight: "600", display: "inline-block" }}
                          onMouseEnter={(e) => e.target.style.color = "#059669"}
                          onMouseLeave={(e) => e.target.style.color = "#00b14f"}
                        >
                          📚 {course.course_name}
                        </Link>
                      ))}
                      {org.courses.length > 3 && (
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginTop: "4px" }}>
                          and {org.courses.length - 3} more programmes...
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>
                      No programmes currently offered.
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <Link 
                  to={`/courses?org_id=${org.id}&org_name=${encodeURIComponent(org.name)}`}
                  style={{ 
                    display: "block", 
                    textAlign: "center", 
                    background: "#0b1f42", 
                    color: "white", 
                    padding: "10px 16px", 
                    borderRadius: "6px", 
                    fontSize: "14px", 
                    fontWeight: "700",
                    textDecoration: "none",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#152c55"}
                  onMouseLeave={(e) => e.target.style.background = "#0b1f42"}
                >
                  View All Offered Courses
                </Link>
              </div>
            </div>
          ))}

          {!loading && filteredOrgs.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 40px", background: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ color: "#0b1f42", fontSize: "24px", marginBottom: "8px" }}>No institutions found</h3>
              <p style={{ color: "#64748b", fontSize: "16px" }}>We couldn't find any institutions matching your search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicOrganizations;

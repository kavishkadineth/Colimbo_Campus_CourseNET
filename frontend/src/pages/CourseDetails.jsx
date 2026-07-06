import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient, getBaseUrl } from "../lib/auth";

function CourseDetails({ backTo = "/courses" }) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "50vh", background: "transparent" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="public-page">
        <div className="public-container" style={{ marginTop: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <h3 style={{ color: "#0b1f42" }}>Course not found</h3>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>This course may have been removed or doesn't exist.</p>
          <Link to={backTo} className="btn-view-all">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    if (!status) return <span className="course-card-badge" style={{ background: "#64748b", position: "relative", top: 0, right: 0 }}>Unknown</span>;
    const s = status.toLowerCase();
    if (s.includes("open") || s.includes("active"))
      return <span className="course-card-badge" style={{ position: "relative", top: 0, right: 0 }}>{status}</span>;
    if (s.includes("closed") || s.includes("ended"))
      return <span className="course-card-badge" style={{ background: "#e91e63", position: "relative", top: 0, right: 0 }}>{status}</span>;
    if (s.includes("upcoming") || s.includes("soon"))
      return <span className="course-card-badge" style={{ background: "#f59e0b", position: "relative", top: 0, right: 0 }}>{status}</span>;
    return <span className="course-card-badge" style={{ background: "#64748b", position: "relative", top: 0, right: 0 }}>{status}</span>;
  };

  return (
    <div className="public-page">
      <div 
        className="public-page-header" 
        style={{ 
          padding: "60px 24px", 
          textAlign: "left",
          background: course.flyer ? `linear-gradient(to right, rgba(11,31,66,0.95) 0%, rgba(11,31,66,0.7) 100%), url(${getBaseUrl()}${course.flyer}) center/cover no-repeat` : undefined
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Link to={backTo} style={{ color: "#cbd5e1", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontWeight: "600" }}>
            ← Back to Courses
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            {getStatusBadge(course.status)}
            {course.intake && <span className="course-card-badge" style={{ background: "#0ea5e9", position: "relative", top: 0, right: 0 }}>{course.intake}</span>}
          </div>
          <h1 style={{ fontSize: "42px", margin: "0 0 16px 0", lineHeight: "1.2" }}>{course.course_name}</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "16px" }}>
            <span>🏢</span>
            <strong>{course.organization?.name || "Organization N/A"}</strong>
            {course.organization?.type && <span>· {course.organization.type}</span>}
          </div>
        </div>
      </div>

      <div className="public-container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px", marginTop: "32px" }}>
          
          {/* Main Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {course.description && (
              <div style={{ background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <h3 style={{ color: "#0b1f42", fontSize: "20px", marginBottom: "16px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
                  Course Overview
                </h3>
                <p style={{ color: "#4b5563", lineHeight: "1.8", fontSize: "16px", whiteSpace: "pre-line" }}>
                  {course.description}
                </p>
              </div>
            )}

            {course.requirements && (
              <div style={{ background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <h3 style={{ color: "#0b1f42", fontSize: "20px", marginBottom: "16px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
                  Entry Requirements
                </h3>
                <p style={{ color: "#4b5563", lineHeight: "1.8", fontSize: "16px", whiteSpace: "pre-line" }}>
                  {course.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Action Card */}
            <div style={{ background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Course Fee</div>
                <div style={{ fontSize: "32px", fontWeight: "800", color: "#00b14f" }}>
                  {course.course_fee ? `LKR ${Number(course.course_fee).toLocaleString()}` : "TBA"}
                </div>
              </div>

              {course.application_fee && (
                <div style={{ marginBottom: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Application Fee</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#f59e0b" }}>
                    LKR {Number(course.application_fee).toLocaleString()}
                  </div>
                </div>
              )}

              {course.more_details_link ? (
                <a
                  href={course.more_details_link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-public-submit"
                  style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                  id={`course-apply-${course.id}`}
                >
                  Apply / More Details
                </a>
              ) : (
                <button disabled className="btn-public-submit" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  Details Unavailable
                </button>
              )}
            </div>

            {/* Dates Card */}
            <div style={{ background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <h3 style={{ color: "#0b1f42", fontSize: "18px", marginBottom: "16px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>Important Dates</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "App. Opens", value: course.application_start_date, icon: "📅" },
                  { label: "App. Deadline", value: course.application_end_date, icon: "⏰" },
                  { label: "Starts", value: course.program_start_date, icon: "🚀" },
                  { label: "Ends", value: course.program_end_date, icon: "🏁" },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "20px" }}>{icon}</span>
                    <span style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
                    <strong style={{ color: value ? "#0f172a" : "#94a3b8", fontSize: "14px" }}>{value || "TBA"}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;

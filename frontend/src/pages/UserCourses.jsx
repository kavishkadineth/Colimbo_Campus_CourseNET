import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/auth";

function UserCourses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to load courses.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchText = [
      course.course_name,
      course.organization?.name,
      course.status,
      course.intake,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "50vh", background: "transparent" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="public-page-header">
        <h1>All Programmes</h1>
        <p>Browse our comprehensive catalog of degrees and courses</p>
      </div>

      <div className="public-container">
        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "40px" }}>
          <input
            id="course-search"
            type="text"
            placeholder="Search by course name, organization, or intake..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }}
          />
        </div>

        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="public-course-card">
              <div 
                className="course-card-image"
                style={course.flyer ? { 
                  backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL?.replace('/api','') || 'http://127.0.0.1:8000'}${course.flyer})`
                } : {}}
              >
                {course.flyer && <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />}
                <div className="course-card-badge">{course.intake || "Upcoming"}</div>
              </div>
              <div className="course-card-content">
                <div className="course-org">{course.organization?.name || "CourseNET"}</div>
                <h3 className="course-title">{course.course_name}</h3>
                
                <div style={{ margin: "16px 0", fontSize: "14px", color: "#64748b" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Status:</strong> {course.status || "Open"}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Program Starts:</strong> {course.program_start_date || "TBA"}
                  </div>
                  <div>
                    <strong>App. Ends:</strong> {course.application_end_date || "TBA"}
                  </div>
                </div>

                <div className="course-card-footer">
                  <span className="course-fee">
                    {course.course_fee ? `LKR ${Number(course.course_fee).toLocaleString()}` : "TBA"}
                  </span>
                  <Link to={`/courses/${course.id}`} className="btn-read-more">View Details →</Link>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ color: "#0b1f42" }}>No courses found</h3>
              <p style={{ color: "#64748b" }}>Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCourses;

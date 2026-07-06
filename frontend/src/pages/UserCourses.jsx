import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient, getBaseUrl } from "../lib/auth";

function UserCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  
  // Initialize state from URL params if present
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState("all");
  
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

  // Sync searchTerm to URL when it changes, but debounce or just update on type
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  const filteredCourses = courses.filter((course) => {
    // Search text filter
    const searchText = [
      course.course_name,
      course.organization?.name,
      course.status,
      course.intake,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
      (course.status && course.status.toLowerCase().includes(statusFilter));

    return matchesSearch && matchesStatus;
  });

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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", marginTop: "20px" }}>
          <div style={{ color: "#64748b", fontWeight: 600, fontSize: "15px" }}>
            Showing {loading ? "..." : filteredCourses.length} results
          </div>
        </div>

        <div className="courses-layout">
          
          {/* Sidebar Filter */}
          <div className="filter-sidebar" style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: "100px" }}>
            <h3 style={{ marginBottom: "20px", color: "#0b1f42", fontSize: "18px" }}>Filter Results</h3>
            
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563", fontSize: "14px" }}>Search</label>
              <input
                type="text"
                placeholder="Keywords..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", background: "#f8fafc" }}
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563", fontSize: "14px" }}>Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", background: "#f8fafc", cursor: "pointer" }}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Main Grid */}
          <div>
            <div className="courses-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {loading ? (
                /* Skeleton Loaders */
                [1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="skeleton-card skeleton">
                    <div className="skeleton-img"></div>
                    <div style={{ padding: "24px" }}>
                      <div className="skeleton-text" style={{ width: "40%", background: "rgba(0,0,0,0.1)" }}></div>
                      <div className="skeleton-text" style={{ width: "90%", height: "24px", background: "rgba(0,0,0,0.1)", marginTop: "12px" }}></div>
                      <div className="skeleton-text" style={{ width: "70%", height: "24px", background: "rgba(0,0,0,0.1)" }}></div>
                      <div className="skeleton-text" style={{ width: "100%", marginTop: "24px", background: "rgba(0,0,0,0.1)" }}></div>
                      <div className="skeleton-text" style={{ width: "80%", background: "rgba(0,0,0,0.1)" }}></div>
                    </div>
                  </div>
                ))
              ) : filteredCourses.map((course) => (
                <div key={course.id} className="public-course-card">
                  <div 
                    className="course-card-image"
                    style={course.flyer ? { 
                      backgroundImage: `url(${getBaseUrl()}${course.flyer})`
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

              {!loading && filteredCourses.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 40px", background: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                  <h3 style={{ color: "#0b1f42", fontSize: "24px", marginBottom: "8px" }}>No courses found</h3>
                  <p style={{ color: "#64748b", fontSize: "16px" }}>We couldn't find any courses matching your criteria. Try adjusting your filters.</p>
                  <button 
                    onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                    className="btn-view-all"
                    style={{ marginTop: "24px" }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCourses;

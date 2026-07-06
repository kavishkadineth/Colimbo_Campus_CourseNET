import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/auth";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [organizationsCount, setOrganizationsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [inquiriesCount, setInquiriesCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/organizations"),
      apiClient.get("/courses"),
      apiClient.get("/inquiries/unread-count").catch(() => ({ data: { count: null } }))
    ]).then(([orgsRes, coursesRes, inqRes]) => {
      setOrganizationsCount(orgsRes.data.length);
      setCoursesCount(coursesRes.data.length);
      setCourses(coursesRes.data);
      if (inqRes.data && inqRes.data.count !== null) {
        setInquiriesCount(inqRes.data.count);
      }
    }).catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openCourses = courses.filter(c => c.status?.toLowerCase().includes("open")).length;
  const closedCourses = courses.filter(c => c.status?.toLowerCase().includes("closed")).length;

  const pieData = {
    labels: ["Organizations", "Open Courses", "Other Courses"],
    datasets: [
      {
        data: [organizationsCount, openCourses, Math.max(0, coursesCount - openCourses)],
        backgroundColor: [
          "rgba(99,102,241,0.85)",
          "rgba(16,185,129,0.85)",
          "rgba(148,163,184,0.5)",
        ],
        borderColor: [
          "rgba(99,102,241,1)",
          "rgba(16,185,129,1)",
          "rgba(148,163,184,0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
          font: { family: "Inter", size: 13 },
          padding: 20,
        },
      },
    },
  };

  const recentCourses = [...courses].slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your CourseNET platform</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card accent">
          <div className="stat-icon accent">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="stat-value">{loading ? "—" : organizationsCount}</div>
          <div className="stat-label">Total Organizations</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-icon emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div className="stat-value">{loading ? "—" : coursesCount}</div>
          <div className="stat-label">Total Courses</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-value">{loading ? "—" : openCourses}</div>
          <div className="stat-label">Open Courses</div>
        </div>

        <div className="stat-card sky">
          <div className="stat-icon sky">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-value">{loading ? "—" : closedCourses}</div>
          <div className="stat-label">Closed Courses</div>
        </div>
        
        {inquiriesCount !== null && (
          <Link to="/admin/inquiries" style={{ textDecoration: "none" }}>
            <div className="stat-card rose" style={{ cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="stat-icon rose">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="stat-value">{loading ? "—" : inquiriesCount}</div>
              <div className="stat-label">New Inquiries</div>
            </div>
          </Link>
        )}
      </div>

      {/* Charts + Recent Courses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", marginBottom: "32px" }}>
        {/* Recent Courses Table */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Recent Courses
            </h3>
            <Link to="/admin/courses" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong>{course.course_name}</strong>
                    </td>
                    <td>{course.organization?.name || "—"}</td>
                    <td>
                      {course.status ? (
                        <span className={`badge ${
                          course.status.toLowerCase().includes("open") ? "badge-emerald" :
                          course.status.toLowerCase().includes("closed") ? "badge-rose" :
                          "badge-gray"
                        }`}>{course.status}</span>
                      ) : "—"}
                    </td>
                    <td style={{ color: "var(--emerald-light)", fontWeight: 600 }}>
                      {course.course_fee ? `LKR ${Number(course.course_fee).toLocaleString()}` : "—"}
                    </td>
                    <td>
                      <Link to={`/admin/courses/${course.id}`} className="btn btn-ghost btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentCourses.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Distribution</h3>
          </div>
          <div className="card-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* All Courses Table */}
      <div className="card section">
        <div className="card-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            All Course Details
          </h3>
        </div>
        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th>Description</th>
                <th>Course Fee</th>
                <th>App. Fee</th>
                <th>App. Start</th>
                <th>App. End</th>
                <th>Program Start</th>
                <th>Requirements</th>
                <th>Organization</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>#{course.id}</td>
                  <td><strong>{course.course_name}</strong></td>
                  <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {course.description || "—"}
                  </td>
                  <td style={{ color: "var(--emerald-light)", fontWeight: 600 }}>
                    {course.course_fee ? `LKR ${Number(course.course_fee).toLocaleString()}` : "—"}
                  </td>
                  <td>{course.application_fee ? `LKR ${Number(course.application_fee).toLocaleString()}` : "—"}</td>
                  <td>{course.application_start_date || "—"}</td>
                  <td>{course.application_end_date || "—"}</td>
                  <td>{course.program_start_date || "—"}</td>
                  <td style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {course.requirements || "—"}
                  </td>
                  <td>
                    {course.organization
                      ? <><strong>{course.organization.name}</strong> <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>· {course.organization.type}</span></>
                      : "—"}
                  </td>
                  <td>
                    <Link to={`/admin/courses/${course.id}`} className="btn btn-ghost btn-sm">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && !loading && (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

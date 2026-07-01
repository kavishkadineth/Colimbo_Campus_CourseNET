import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/auth";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  // Form State
  const [organizationId, setOrganizationId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [applicationFee, setApplicationFee] = useState("");
  const [applicationStartDate, setApplicationStartDate] = useState("");
  const [applicationEndDate, setApplicationEndDate] = useState("");
  const [programStartDate, setProgramStartDate] = useState("");
  const [programEndDate, setProgramEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [intake, setIntake] = useState("");
  const [requirements, setRequirements] = useState("");
  const [moreDetailsLink, setMoreDetailsLink] = useState("");
  const [flyer, setFlyer] = useState(null);

  // Edit State
  const [editId, setEditId] = useState(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCourses = () => {
    apiClient
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => console.error(error));
  };

  const fetchOrganizations = () => {
    apiClient
      .get("/organizations")
      .then((response) => {
        setOrganizations(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchCourses();
    fetchOrganizations();
  }, []);

  const resetForm = () => {
    setOrganizationId("");
    setCourseName("");
    setDescription("");
    setCourseFee("");
    setApplicationFee("");
    setApplicationStartDate("");
    setApplicationEndDate("");
    setProgramStartDate("");
    setProgramEndDate("");
    setStatus("");
    setIntake("");
    setRequirements("");
    setMoreDetailsLink("");
    setFlyer(null);
  };

  const addCourse = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("organization_id", organizationId);
    formData.append("course_name", courseName);
    if (description) formData.append("description", description);
    if (courseFee) formData.append("course_fee", courseFee);
    if (applicationFee) formData.append("application_fee", applicationFee);
    if (applicationStartDate) formData.append("application_start_date", applicationStartDate);
    if (applicationEndDate) formData.append("application_end_date", applicationEndDate);
    if (programStartDate) formData.append("program_start_date", programStartDate);
    if (programEndDate) formData.append("program_end_date", programEndDate);
    if (status) formData.append("status", status);
    if (intake) formData.append("intake", intake);
    if (requirements) formData.append("requirements", requirements);
    if (moreDetailsLink) formData.append("more_details_link", moreDetailsLink);
    if (flyer) formData.append("flyer", flyer);

    apiClient
      .post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(() => {
        resetForm();
        setSuccess("Course created successfully.");
        setIsAddModalOpen(false);
        fetchCourses();
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to create course.");
      })
      .finally(() => setLoading(false));
  };

  const startEdit = (course) => {
    setEditId(course.id);
    setOrganizationId(course.organization_id || "");
    setCourseName(course.course_name || "");
    setDescription(course.description || "");
    setCourseFee(course.course_fee || "");
    setApplicationFee(course.application_fee || "");
    setApplicationStartDate(course.application_start_date || "");
    setApplicationEndDate(course.application_end_date || "");
    setProgramStartDate(course.program_start_date || "");
    setProgramEndDate(course.program_end_date || "");
    setStatus(course.status || "");
    setIntake(course.intake || "");
    setRequirements(course.requirements || "");
    setMoreDetailsLink(course.more_details_link || "");
    setIsEditModalOpen(true);
  };

  const updateCourse = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel way to handle PUT with FormData
    formData.append("organization_id", organizationId);
    formData.append("course_name", courseName);
    if (description) formData.append("description", description);
    if (courseFee) formData.append("course_fee", courseFee);
    if (applicationFee) formData.append("application_fee", applicationFee);
    if (applicationStartDate) formData.append("application_start_date", applicationStartDate);
    if (applicationEndDate) formData.append("application_end_date", applicationEndDate);
    if (programStartDate) formData.append("program_start_date", programStartDate);
    if (programEndDate) formData.append("program_end_date", programEndDate);
    if (status) formData.append("status", status);
    if (intake) formData.append("intake", intake);
    if (requirements) formData.append("requirements", requirements);
    if (moreDetailsLink) formData.append("more_details_link", moreDetailsLink);
    if (flyer) formData.append("flyer", flyer);

    apiClient
      .post(`/courses/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(() => {
        setEditId(null);
        resetForm();
        setSuccess("Course updated successfully.");
        setIsEditModalOpen(false);
        fetchCourses();
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to update course.");
      })
      .finally(() => setLoading(false));
  };

  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setError("");
    setSuccess("");

    apiClient
      .delete(`/courses/${id}`)
      .then(() => {
        setSuccess("Course deleted.");
        fetchCourses();
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Unable to delete course.");
      });
  };

  const filteredCourses = courses.filter((course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (s) => {
    if (!s) return <span className="badge badge-gray">Unknown</span>;
    const lower = s.toLowerCase();
    if (lower.includes("open") || lower.includes("active")) return <span className="badge badge-emerald">{s}</span>;
    if (lower.includes("closed") || lower.includes("ended")) return <span className="badge badge-rose">{s}</span>;
    if (lower.includes("upcoming") || lower.includes("soon")) return <span className="badge badge-amber">{s}</span>;
    return <span className="badge badge-gray">{s}</span>;
  };

  const renderCourseForm = ({ onSubmit, submitText, onCancel }) => (
    <form onSubmit={onSubmit}>
      <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "12px" }}>
        {/* Core Info */}
        <div className="sidebar-section-label" style={{ padding: "0 0 10px", fontSize: "12px" }}>Basic Information</div>
        <div className="form-group">
          <label className="form-label">Organization</label>
          <select
            className="form-select"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} - {org.type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Master of Computer Science"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Status</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Open, Closed, Upcoming"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Intake</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Fall 2026"
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Course Photo (Optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setFlyer(e.target.files[0])}
          />
          <small style={{ color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
            Upload a high-quality image for the course card.
          </small>
        </div>

        {/* Fees */}
        <div className="divider"></div>
        <div className="sidebar-section-label" style={{ padding: "0 0 10px", fontSize: "12px" }}>Financials</div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Course Fee (LKR)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 150000"
              value={courseFee}
              onChange={(e) => setCourseFee(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Application Fee (LKR)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 5000"
              value={applicationFee}
              onChange={(e) => setApplicationFee(e.target.value)}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="divider"></div>
        <div className="sidebar-section-label" style={{ padding: "0 0 10px", fontSize: "12px" }}>Timeline & Dates</div>
        
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Application Start</label>
            <input
              type="date"
              className="form-control"
              value={applicationStartDate}
              onChange={(e) => setApplicationStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Application End</label>
            <input
              type="date"
              className="form-control"
              value={applicationEndDate}
              onChange={(e) => setApplicationEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Program Start</label>
            <input
              type="date"
              className="form-control"
              value={programStartDate}
              onChange={(e) => setProgramStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Program End</label>
            <input
              type="date"
              className="form-control"
              value={programEndDate}
              onChange={(e) => setProgramEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Details */}
        <div className="divider"></div>
        <div className="sidebar-section-label" style={{ padding: "0 0 10px", fontSize: "12px" }}>Detailed Information</div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Course overview and details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: "vertical" }}
          ></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Requirements</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Entry requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            style={{ resize: "vertical" }}
          ></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">External Details Link</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://..."
            value={moreDetailsLink}
            onChange={(e) => setMoreDetailsLink(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Processing..." : submitText}
        </button>
      </div>
    </form>
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ paddingTop: "0" }}>
        <div className="page-header-inner">
          <div>
            <h1 className="page-title">Courses</h1>
            <p className="page-subtitle">Manage catalog, intakes, and course details</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => { resetForm(); setError(""); setSuccess(""); setIsAddModalOpen(true); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Course
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

      {/* Main Card */}
      <div className="card">
        <div className="card-header" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Course Catalog
          </h3>
          <div className="search-bar" style={{ minWidth: "260px" }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: "38px" }}
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Intake</th>
                <th>Course Fee</th>
                <th>App. Ends</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>#{course.id}</td>
                  <td><strong>{course.course_name}</strong></td>
                  <td>{course.organization?.name || "—"}</td>
                  <td>{getStatusBadge(course.status)}</td>
                  <td>{course.intake || "—"}</td>
                  <td style={{ color: "var(--emerald-light)", fontWeight: 600 }}>
                    {course.course_fee ? `LKR ${Number(course.course_fee).toLocaleString()}` : "—"}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{course.application_end_date || "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="action-row" style={{ justifyContent: "flex-end" }}>
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="btn btn-ghost btn-icon"
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Edit Course"
                        onClick={() => { setError(""); setSuccess(""); startEdit(course); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Delete Course"
                        style={{ color: "var(--rose-light)" }}
                        onClick={() => deleteCourse(course.id)}
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
              
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "48px 24px" }}>
                    <div className="empty-state" style={{ padding: 0 }}>
                      <div className="empty-state-icon" style={{ fontSize: "24px", width: "48px", height: "48px" }}>📚</div>
                      <h3 style={{ fontSize: "16px" }}>No courses found</h3>
                      <p>Adjust your search or add a new course.</p>
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
          <div className="modal modal-wide">
            <div className="modal-header">
              <h3>Add New Course</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            {renderCourseForm({
              onSubmit: addCourse,
              submitText: "Create Course",
              onCancel: () => setIsAddModalOpen(false)
            })}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsEditModalOpen(false); }}>
          <div className="modal modal-wide">
            <div className="modal-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amber-light)" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Course
              </h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            {renderCourseForm({
              onSubmit: updateCourse,
              submitText: "Save Changes",
              onCancel: () => setIsEditModalOpen(false)
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;

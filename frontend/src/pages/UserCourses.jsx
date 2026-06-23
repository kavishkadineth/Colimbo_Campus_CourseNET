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
    return <div className="container mt-4">Loading courses...</div>;
  }

  return (
    <div className="container mt-4 text-start">
      <div className="mb-5">
        <h1 className="mb-0">CourseNET</h1>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Courses</h2>
          <p className="text-muted">Available programs</p>
        </div>

        <div className="user-course-search">
          <input
            type="text"
            className="form-control"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {filteredCourses.map((course) => (
          <div className="col-md-6 col-xl-4" key={course.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between gap-2 mb-2">
                  <span className="badge text-bg-secondary">
                    {course.status || "Status N/A"}
                  </span>
                  <span className="text-muted small">{course.intake || "Intake N/A"}</span>
                </div>

                <h4 className="card-title h5">{course.course_name}</h4>
                <p className="text-muted mb-3">{course.organization?.name || "Organization N/A"}</p>

                <div className="small mb-3">
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Application End</span>
                    <strong>{course.application_end_date || "N/A"}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Program Start</span>
                    <strong>{course.program_start_date || "N/A"}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span>Course Fee</span>
                    <strong>{course.course_fee || "N/A"}</strong>
                  </div>
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body text-center">No courses found</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCourses;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../lib/auth";

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
    return <p>Loading course details...</p>;
  }

  if (!course) {
    return (
      <div>
        <p>No course found.</p>
        <Link to={backTo} className="btn btn-secondary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header">
        <h4 className="mb-0">{course.course_name}</h4>
      </div>

      <div className="card-body">
        <p>
          <strong>Organization:</strong> {course.organization?.name || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {course.description || "N/A"}
        </p>
        <p>
          <strong>Requirements:</strong> {course.requirements || "N/A"}
        </p>
        <p>
          <strong>Course Fee:</strong> {course.course_fee || "N/A"}
        </p>
        <p>
          <strong>Application Fee:</strong> {course.application_fee || "N/A"}
        </p>
        <p>
          <strong>Application Start Date:</strong> {course.application_start_date || "N/A"}
        </p>
        <p>
          <strong>Application End Date:</strong> {course.application_end_date || "N/A"}
        </p>
        <p>
          <strong>Program Start Date:</strong> {course.program_start_date || "N/A"}
        </p>
        <p>
          <strong>Program End Date:</strong> {course.program_end_date || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {course.status || "N/A"}
        </p>
        <p>
          <strong>Intake:</strong> {course.intake || "N/A"}
        </p>
        <p>
          <strong>More Details Link:</strong> {course.more_details_link || "N/A"}
        </p>

        <Link to={backTo} className="btn btn-secondary">
          Back to Courses
        </Link>
      </div>
    </div>
  );
}

export default CourseDetails;

import { useEffect, useState } from "react";
import { apiClient } from "../lib/auth";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [organizations, setOrganizations] = useState([]);

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

  const [editId, setEditId] = useState(null);
  const [editOrganizationId, setEditOrganizationId] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCourseFee, setEditCourseFee] = useState("");
  const [editApplicationFee, setEditApplicationFee] = useState("");
  const [editApplicationStartDate, setEditApplicationStartDate] = useState("");
  const [editApplicationEndDate, setEditApplicationEndDate] = useState("");
  const [editProgramStartDate, setEditProgramStartDate] = useState("");
  const [editProgramEndDate, setEditProgramEndDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editIntake, setEditIntake] = useState("");
  const [editRequirements, setEditRequirements] = useState("");
  const [editMoreDetailsLink, setEditMoreDetailsLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const addCourse = () => {
    apiClient
      .post("/courses", {
        organization_id: organizationId,
        course_name: courseName,
        description,
        course_fee: courseFee,
        application_fee: applicationFee,
        application_start_date: applicationStartDate,
        application_end_date: applicationEndDate,
        program_start_date: programStartDate,
        program_end_date: programEndDate,
        status,
        intake,
        requirements,
        more_details_link: moreDetailsLink,
      })
      .then(() => {
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
        fetchCourses();
      })
      .catch((error) => console.error(error));
  };

  const startEdit = (course) => {
    setEditId(course.id);
    setEditOrganizationId(course.organization_id);
    setEditCourseName(course.course_name);
    setEditDescription(course.description);
    setEditCourseFee(course.course_fee);
    setEditApplicationFee(course.application_fee);
    setEditApplicationStartDate(course.application_start_date || "");
    setEditApplicationEndDate(course.application_end_date || "");
    setEditProgramStartDate(course.program_start_date || "");
    setEditProgramEndDate(course.program_end_date || "");
    setEditStatus(course.status || "");
    setEditIntake(course.intake || "");
    setEditRequirements(course.requirements || "");
    setEditMoreDetailsLink(course.more_details_link || "");
  };

  const updateCourse = () => {
    apiClient
      .put(`/courses/${editId}`, {
        organization_id: editOrganizationId,
        course_name: editCourseName,
        description: editDescription,
        course_fee: editCourseFee,
        application_fee: editApplicationFee,
        application_start_date: editApplicationStartDate,
        application_end_date: editApplicationEndDate,
        program_start_date: editProgramStartDate,
        program_end_date: editProgramEndDate,
        status: editStatus,
        intake: editIntake,
        requirements: editRequirements,
        more_details_link: editMoreDetailsLink,
      })
      .then(() => {
        setEditId(null);
        fetchCourses();
      })
      .catch((error) => console.error(error));
  };

  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    apiClient
      .delete(`/courses/${id}`)
      .then(() => {
        fetchCourses();
      })
      .catch((error) => console.error(error));
  };

  const filteredCourses = courses.filter((course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Courses</h2>

      <div className="card shadow mb-4">
        <div className="card-header">
          <h4 className="mb-0">Add Course</h4>
        </div>

        <div className="card-body">
          <select
            className="form-select mb-3"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} - {org.type}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Course Fee"
            value={courseFee}
            onChange={(e) => setCourseFee(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Application Fee"
            value={applicationFee}
            onChange={(e) => setApplicationFee(e.target.value)}
          />

          <label className="form-label">Application Start Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={applicationStartDate}
            onChange={(e) => setApplicationStartDate(e.target.value)}
          />

          <label className="form-label">Application End Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={applicationEndDate}
            onChange={(e) => setApplicationEndDate(e.target.value)}
          />

          <label className="form-label">Program Start Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={programStartDate}
            onChange={(e) => setProgramStartDate(e.target.value)}
          />

          <label className="form-label">Program End Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={programEndDate}
            onChange={(e) => setProgramEndDate(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Intake"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="More Details Link"
            value={moreDetailsLink}
            onChange={(e) => setMoreDetailsLink(e.target.value)}
          />

          <button className="btn btn-primary" onClick={addCourse}>
            Add Course
          </button>
        </div>
      </div>

      {editId && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning">
            <h4 className="mb-0">Edit Course</h4>
          </div>

          <div className="card-body">
            <select
              className="form-select mb-3"
              value={editOrganizationId}
              onChange={(e) => setEditOrganizationId(e.target.value)}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} - {org.type}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="form-control mb-3"
              value={editCourseName}
              onChange={(e) => setEditCourseName(e.target.value)}
            />

            <input
              type="text"
              className="form-control mb-3"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-3"
              value={editCourseFee}
              onChange={(e) => setEditCourseFee(e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-3"
              value={editApplicationFee}
              onChange={(e) => setEditApplicationFee(e.target.value)}
            />

            <label className="form-label">Application Start Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={editApplicationStartDate}
              onChange={(e) => setEditApplicationStartDate(e.target.value)}
            />

            <label className="form-label">Application End Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={editApplicationEndDate}
              onChange={(e) => setEditApplicationEndDate(e.target.value)}
            />

            <label className="form-label">Program Start Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={editProgramStartDate}
              onChange={(e) => setEditProgramStartDate(e.target.value)}
            />

            <label className="form-label">Program End Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={editProgramEndDate}
              onChange={(e) => setEditProgramEndDate(e.target.value)}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Intake"
              value={editIntake}
              onChange={(e) => setEditIntake(e.target.value)}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Requirements"
              value={editRequirements}
              onChange={(e) => setEditRequirements(e.target.value)}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="More Details Link"
              value={editMoreDetailsLink}
              onChange={(e) => setEditMoreDetailsLink(e.target.value)}
            />

            <button
              className="btn btn-success"
              onClick={updateCourse}
            >
              Update Course
            </button>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="mb-0">Course List</h4>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Course Fee</th>
                  <th>Application Fee</th>
                  <th>Application Start</th>
                  <th>Application End</th>
                  <th>Program Start</th>
                  <th>Program End</th>
                  <th>Status</th>
                  <th>Intake</th>
                  <th>Organization</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.course_name}</td>
                    <td>{course.course_fee}</td>
                    <td>{course.application_fee}</td>
                    <td>{course.application_start_date || "N/A"}</td>
                    <td>{course.application_end_date || "N/A"}</td>
                    <td>{course.program_start_date || "N/A"}</td>
                    <td>{course.program_end_date || "N/A"}</td>
                    <td>{course.status || "N/A"}</td>
                    <td>{course.intake || "N/A"}</td>
                    <td>{course.organization?.name}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() =>
                          alert(
                            `Course: ${course.course_name}
Description: ${course.description}
Requirements: ${course.requirements}
Course Fee: ${course.course_fee}
Application Fee: ${course.application_fee}
Application Start Date: ${course.application_start_date || "N/A"}
Application End Date: ${course.application_end_date || "N/A"}
Program Start Date: ${course.program_start_date || "N/A"}
Program End Date: ${course.program_end_date || "N/A"}
Status: ${course.status || "N/A"}
Intake: ${course.intake || "N/A"}`
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(course)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCourse(course.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;

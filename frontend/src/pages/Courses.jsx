import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  // Add Course States
  const [organizationId, setOrganizationId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [applicationFee, setApplicationFee] = useState("");
  const [requirements, setRequirements] = useState("");
  const [moreDetailsLink, setMoreDetailsLink] = useState("");

  // Edit Course States
  const [editId, setEditId] = useState(null);
  const [editOrganizationId, setEditOrganizationId] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCourseFee, setEditCourseFee] = useState("");
  const [editApplicationFee, setEditApplicationFee] = useState("");
  const [editRequirements, setEditRequirements] = useState("");
  const [editMoreDetailsLink, setEditMoreDetailsLink] = useState("");

  const fetchCourses = () => {
    axios
      .get("http://127.0.0.1:8000/api/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchOrganizations = () => {
    axios
      .get("http://127.0.0.1:8000/api/organizations")
      .then((response) => {
        setOrganizations(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCourses();
    fetchOrganizations();
  }, []);

  const addCourse = () => {
    axios
      .post("http://127.0.0.1:8000/api/courses", {
        organization_id: organizationId,
        course_name: courseName,
        description: description,
        course_fee: courseFee,
        application_fee: applicationFee,
        requirements: requirements,
        more_details_link: moreDetailsLink,
      })
      .then(() => {
        setOrganizationId("");
        setCourseName("");
        setDescription("");
        setCourseFee("");
        setApplicationFee("");
        setRequirements("");
        setMoreDetailsLink("");

        fetchCourses();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const startEdit = (course) => {
    setEditId(course.id);
    setEditOrganizationId(course.organization_id);
    setEditCourseName(course.course_name);
    setEditDescription(course.description);
    setEditCourseFee(course.course_fee);
    setEditApplicationFee(course.application_fee);
    setEditRequirements(course.requirements);
    setEditMoreDetailsLink(course.more_details_link);
  };

  const updateCourse = () => {
    axios
      .put(`http://127.0.0.1:8000/api/courses/${editId}`, {
        organization_id: editOrganizationId,
        course_name: editCourseName,
        description: editDescription,
        course_fee: editCourseFee,
        application_fee: editApplicationFee,
        requirements: editRequirements,
        more_details_link: editMoreDetailsLink,
      })
      .then(() => {
        setEditId(null);
        fetchCourses();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteCourse = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/courses/${id}`)
      .then(() => {
        fetchCourses();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Courses</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Add Course</h3>

        <select
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
        >
          <option value="">Select Organization</option>

          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Course Fee"
          value={courseFee}
          onChange={(e) => setCourseFee(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Application Fee"
          value={applicationFee}
          onChange={(e) => setApplicationFee(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="More Details Link"
          value={moreDetailsLink}
          onChange={(e) => setMoreDetailsLink(e.target.value)}
        />

        <br /><br />

        <button onClick={addCourse}>
          Add Course
        </button>
      </div>

      {editId && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Edit Course</h3>

          <select
            value={editOrganizationId}
            onChange={(e) => setEditOrganizationId(e.target.value)}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            type="text"
            value={editCourseName}
            onChange={(e) => setEditCourseName(e.target.value)}
          />

          <br /><br />

          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <br /><br />

          <input
            type="number"
            value={editCourseFee}
            onChange={(e) => setEditCourseFee(e.target.value)}
          />

          <br /><br />

          <input
            type="number"
            value={editApplicationFee}
            onChange={(e) => setEditApplicationFee(e.target.value)}
          />

          <br /><br />

          <input
            type="text"
            value={editRequirements}
            onChange={(e) => setEditRequirements(e.target.value)}
          />

          <br /><br />

          <input
            type="text"
            value={editMoreDetailsLink}
            onChange={(e) => setEditMoreDetailsLink(e.target.value)}
          />

          <br /><br />

          <button onClick={updateCourse}>
            Update Course
          </button>
        </div>
      )}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Course Fee</th>
            <th>Application Fee</th>
            <th>Organization</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.course_name}</td>
              <td>{course.course_fee}</td>
              <td>{course.application_fee}</td>
              <td>{course.organization?.name}</td>
              <td>
                <button onClick={() => startEdit(course)}>
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(course.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Courses;
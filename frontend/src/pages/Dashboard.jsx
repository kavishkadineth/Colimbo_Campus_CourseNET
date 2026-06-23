import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/auth";

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [organizationsCount, setOrganizationsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    apiClient
      .get("/organizations")
      .then((response) => {
        setOrganizationsCount(response.data.length);
      })
      .catch((error) => console.error(error));

    apiClient
      .get("/courses")
      .then((response) => {
        setCoursesCount(response.data.length);
        setCourses(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const pieData = {
    labels: ["Organizations", "Courses"],
    datasets: [
      {
        data: [organizationsCount, coursesCount],
        backgroundColor: ["#0d6efd", "#198754"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5>Total Organizations</h5>
              <h1>{organizationsCount}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5>Total Courses</h5>
              <h1>{coursesCount}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header">
          <h4 className="mb-0">All Course Details</h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Course Fee</th>
                  <th>Application Fee</th>
                  <th>Application Start</th>
                  <th>Application End</th>
                  <th>Program Start</th>
                  <th>Requirements</th>
                  <th>Organization</th>
                  <th>More Details</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.course_name}</td>
                    <td>{course.description}</td>
                    <td>{course.course_fee}</td>
                    <td>{course.application_fee}</td>
                    <td>{course.application_start_date || "N/A"}</td>
                    <td>{course.application_end_date || "N/A"}</td>
                    <td>{course.program_start_date || "N/A"}</td>
                    <td>{course.requirements}</td>
                    <td>
                      {course.organization
                        ? `${course.organization.name} - ${course.organization.type}`
                        : ""}
                    </td>
                    <td>
                      <Link to={`/courses/${course.id}`}>Open</Link>
                    </td>
                  </tr>
                ))}

                {courses.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header">
          <h4 className="mb-0">Distribution Chart</h4>
        </div>

        <div className="card-body">
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

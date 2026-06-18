import { useEffect, useState } from "react";
import axios from "axios";

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");

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
    fetchOrganizations();
  }, []);

  const addOrganization = () => {
    axios
      .post("http://127.0.0.1:8000/api/organizations", {
        name,
        type,
      })
      .then(() => {
        setName("");
        setType("");
        fetchOrganizations();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteOrganization = (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/api/organizations/${id}`)
      .then(() => {
        fetchOrganizations();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const startEdit = (org) => {
    setEditId(org.id);
    setEditName(org.name);
    setEditType(org.type);
  };

  const updateOrganization = () => {
    axios
      .put(`http://127.0.0.1:8000/api/organizations/${editId}`, {
        name: editName,
        type: editType,
      })
      .then(() => {
        setEditId(null);
        setEditName("");
        setEditType("");
        fetchOrganizations();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-header">
          <h3 className="mb-0">Add Organization</h3>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Organization Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Organization Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={addOrganization}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {editId && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning">
            <h3 className="mb-0">Edit Organization</h3>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <button
                  className="btn btn-success w-100"
                  onClick={updateOrganization}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow">
        <div className="card-header">
          <h3 className="mb-0">Organizations List</h3>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th width="180">Actions</th>
                </tr>
              </thead>

              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id}>
                    <td>{org.id}</td>
                    <td>{org.name}</td>
                    <td>{org.type}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(org)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteOrganization(org.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {organizations.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No organizations found
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

export default Organizations;
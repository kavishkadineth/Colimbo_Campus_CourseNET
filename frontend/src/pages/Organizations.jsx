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
        name: name,
        type: type,
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
    <div>
      <h2>Organizations</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Organization Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={addOrganization}
          style={{ marginLeft: "10px" }}
        >
          Add Organization
        </button>
      </div>

      {editId && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Edit Organization</h3>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <input
            type="text"
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            style={{ marginLeft: "10px" }}
          />

          <button
            onClick={updateOrganization}
            style={{ marginLeft: "10px" }}
          >
            Update
          </button>
        </div>
      )}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((org) => (
            <tr key={org.id}>
              <td>{org.id}</td>
              <td>{org.name}</td>
              <td>{org.type}</td>
              <td>
                <button onClick={() => startEdit(org)}>
                  Edit
                </button>

                <button
                  onClick={() => deleteOrganization(org.id)}
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

export default Organizations;
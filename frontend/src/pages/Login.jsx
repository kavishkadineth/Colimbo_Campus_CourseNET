import { useState } from "react";
import { apiClient, saveAuthToken } from "../lib/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const submitLogin = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    apiClient
      .post("/login", {
        email,
        password,
      })
      .then((response) => {
        saveAuthToken(response.data.token);
        onLogin(response.data.user);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Login failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const demoLogin = () => {
    setError("");
    setDemoLoading(true);

    apiClient
      .post("/demo-login", {
        email,
      })
      .then((response) => {
        saveAuthToken(response.data.token);
        onLogin(response.data.user);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Demo login failed.");
      })
      .finally(() => {
        setDemoLoading(false);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <div className="card shadow">
        <div className="card-header">
          <h3 className="mb-0">CourseNET Login</h3>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submitLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-2"
              disabled={demoLoading}
              onClick={demoLogin}
            >
              {demoLoading ? "Starting demo..." : "Login with Demo Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

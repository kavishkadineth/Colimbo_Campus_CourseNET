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
      .post("/login", { email, password })
      .then((response) => {
        saveAuthToken(response.data.token);
        onLogin(response.data.user);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Invalid credentials. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const demoLogin = () => {
    setError("");
    setDemoLoading(true);

    apiClient
      .post("/demo-login", { email })
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
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">C</div>
          <span className="login-logo-text">CourseNET</span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your admin account</p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "20px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={submitLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            id="login-submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div>
                Signing in…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </>
            )}
          </button>

          <div className="login-divider">or</div>

          <button
            id="login-demo"
            type="button"
            className="btn btn-ghost btn-lg"
            style={{ width: "100%" }}
            disabled={demoLoading}
            onClick={demoLogin}
          >
            {demoLoading ? (
              <>
                <div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div>
                Starting demo…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Continue with Demo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

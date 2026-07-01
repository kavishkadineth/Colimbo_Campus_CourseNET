import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminPanel from "../../frontend/src/pages/AdminPanel.jsx";
import { apiClient, clearAuthToken, getAuthToken } from "./lib/auth";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(Boolean(getAuthToken()));

  useEffect(() => {
    if (!getAuthToken()) {
      return;
    }

    apiClient
      .get("/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        clearAuthToken();
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  const logout = () => {
    apiClient
      .post("/logout")
      .finally(() => {
        clearAuthToken();
        setUser(null);
      });
  };

  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span className="loading-text">Authenticating…</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="bg-mesh" />
      <Routes>
        <Route
          path="/*"
          element={
            <AdminPanel
              user={user}
              onLogin={setUser}
              onLogout={logout}
              basePath=""
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

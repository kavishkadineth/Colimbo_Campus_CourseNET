import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminPanel from "../../frontend/src/pages/AdminPanel.jsx";
import { apiClient, clearAuthToken, getAuthToken } from "../../frontend/src/lib/auth";

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
    return <div className="container mt-5">Checking login...</div>;
  }

  return (
    <BrowserRouter>
      <div className="container-fluid py-4 px-4">
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
      </div>
    </BrowserRouter>
  );
}

export default App;

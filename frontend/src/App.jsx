import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Organizations from "./pages/Organizations";
import Courses from "./pages/Courses";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>CourseNET</h1>

        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/organizations">Organizations</Link> |{" "}
          <Link to="/courses">Courses</Link>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
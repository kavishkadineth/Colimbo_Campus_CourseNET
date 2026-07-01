import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "../lib/auth";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/courses")
      .then((response) => {
        // Just take a few featured courses
        setCourses(response.data.slice(0, 3));
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">COURSE DIRECTORY</span>
          <h1 className="hero-title">
            DISCOVER YOUR<br />
            <span>NEXT DEGREE</span>
          </h1>
          <p className="hero-subtitle">EXPLORE THOUSANDS OF PROGRAMMES</p>
          <div className="hero-actions">
            <Link to="/courses" className="btn-hero-primary">Browse Catalog</Link>
            <Link to="/about" className="btn-hero-secondary">How It Works</Link>
          </div>
        </div>
      </section>

      {/* Sub Navigation Bar */}
      <div className="sub-nav-bar">
        <div className="sub-nav-container">
          <Link to="/" className="active">HOME</Link>
          <Link to="/courses">ALL COURSES</Link>
          <Link to="/courses">UNIVERSITIES</Link>
          <Link to="/courses">CATEGORIES</Link>
          <Link to="/contact">SUPPORT</Link>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-container">
          <div className="welcome-text">
            <h2>Welcome to CourseNET</h2>
            <p>
              CourseNET is your centralized platform for discovering world-class education and training 
              opportunities across multiple disciplines. We connect students with top-ranking universities 
              and educational institutes globally, helping you find the perfect undergraduate or postgraduate 
              degree to advance your career.
            </p>
          </div>
          <div className="welcome-badge">
            <div className="badge-circle">
              <span className="badge-year">EST 2026</span>
              <span className="badge-text">EXCELLENCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses-section">
        <div className="section-header">
          <h2>Featured Programmes</h2>
          <p>Discover our top-rated degrees and courses designed for the modern industry.</p>
        </div>
        
        <div className="courses-grid">
          {loading ? (
            <div className="loading-state">Loading programmes...</div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="public-course-card">
                <div 
                  className="course-card-image"
                  style={course.flyer ? { 
                    backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL?.replace('/api','') || 'http://127.0.0.1:8000'}${course.flyer})`
                  } : {}}
                >
                  {course.flyer && <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />}
                  <div className="course-card-badge">{course.intake || "Upcoming"}</div>
                </div>
                <div className="course-card-content">
                  <div className="course-org">{course.organization?.name || "CourseNET"}</div>
                  <h3 className="course-title">{course.course_name}</h3>
                  <p className="course-desc">{course.description ? course.description.substring(0, 100) + '...' : 'Explore cutting-edge concepts and build your career.'}</p>
                  <div className="course-card-footer">
                    <span className="course-fee">
                      {course.course_fee ? `LKR ${Number(course.course_fee).toLocaleString()}` : "TBA"}
                    </span>
                    <Link to={`/courses/${course.id}`} className="btn-read-more">Read More →</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No programmes available right now.</div>
          )}
        </div>
        
        <div className="center-action">
          <Link to="/courses" className="btn-view-all">Browse All Programmes</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
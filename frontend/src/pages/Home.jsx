import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient, getBaseUrl } from "../lib/auth";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/courses');
    }
  };

  const partners = [
    "University of Oxford", "Stanford University", "MIT", 
    "Harvard University", "Cambridge University", "National University of Singapore"
  ];

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
          
          <form className="hero-search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="What do you want to learn today?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="hero-actions" style={{ marginTop: '24px' }}>
            <Link to="/courses" className="btn-hero-primary">Browse Catalog</Link>
            <Link to="/about" className="btn-hero-secondary">How It Works</Link>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
          {/* Double the list for infinite scroll illusion */}
          {[...partners, ...partners].map((partner, idx) => (
            <span key={idx}>{partner}</span>
          ))}
        </div>
      </div>

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
            /* Skeleton Loaders */
            [1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card skeleton">
                <div className="skeleton-img"></div>
                <div style={{ padding: "24px" }}>
                  <div className="skeleton-text" style={{ width: "40%", background: "rgba(0,0,0,0.1)" }}></div>
                  <div className="skeleton-text" style={{ width: "90%", height: "24px", background: "rgba(0,0,0,0.1)", marginTop: "12px" }}></div>
                  <div className="skeleton-text" style={{ width: "70%", height: "24px", background: "rgba(0,0,0,0.1)" }}></div>
                  <div className="skeleton-text" style={{ width: "100%", marginTop: "24px", background: "rgba(0,0,0,0.1)" }}></div>
                  <div className="skeleton-text" style={{ width: "80%", background: "rgba(0,0,0,0.1)" }}></div>
                </div>
              </div>
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="public-course-card">
                <div 
                  className="course-card-image"
                  style={course.flyer ? { 
                    backgroundImage: `url(${getBaseUrl()}${course.flyer})`
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
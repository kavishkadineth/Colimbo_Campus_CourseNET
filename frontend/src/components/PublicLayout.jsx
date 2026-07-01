import { Link, Outlet, useLocation } from "react-router-dom";

function PublicLayout() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="public-layout">
      {/* Top Bar (Contact & Social) */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <span className="top-bar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +94 11 544 5000
            </span>
            <span className="top-bar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              inquiries@coursenet.ac.lk
            </span>
          </div>
          <div className="top-bar-right">
            {/* Social Icons Placeholder */}
            <a href="#" className="social-icon">F</a>
            <a href="#" className="social-icon">In</a>
            <a href="#" className="social-icon">Yt</a>
            <a href="#" className="social-icon">Ig</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="public-header">
        <div className="public-nav-container">
          {/* Logo */}
          <Link to="/" className="public-logo">
            <div className="public-logo-icon">C</div>
            <div className="public-logo-text">
              <span className="public-logo-brand">CourseNET</span>
              <span className="public-logo-sub">PLATFORM</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="public-nav">
            <Link to="/" className={`public-nav-link ${isActive("/") ? "active" : ""}`}>HOME</Link>
            <Link to="/about" className={`public-nav-link ${isActive("/about") ? "active" : ""}`}>ABOUT US</Link>
            <Link to="/courses" className={`public-nav-link ${isActive("/courses") ? "active" : ""}`}>COURSES</Link>
            <Link to="/contact" className={`public-nav-link ${isActive("/contact") ? "active" : ""}`}>CONTACT</Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>CourseNET</h4>
              <p>Your centralized platform for discovering world-class education and training in Computing, Business, and Engineering. Join us to build your future today.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/courses">Programmes</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Us</h4>
              <p>CourseNET Headquarters,<br/>Colombo,<br/>Sri Lanka.</p>
              <p>Email: inquiries@coursenet.lk<br/>Phone: +94 11 544 5000</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} CourseNET. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;

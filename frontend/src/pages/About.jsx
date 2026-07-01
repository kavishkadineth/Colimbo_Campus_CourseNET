function About() {
  return (
    <div className="public-page">
      <div className="public-page-header">
        <h1>About CourseNET</h1>
        <p>Your premier destination for discovering global education opportunities</p>
      </div>
      
      <div className="public-container">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              To provide an accessible, centralized platform that connects students with the perfect 
              educational opportunities. We strive to foster innovation, critical thinking, 
              and lifelong learning by making course discovery seamless and transparent.
            </p>
            
            <h2>Extensive Catalog</h2>
            <p>
              CourseNET offers a comprehensive directory of degree programs, professional certifications, 
              and short courses from trusted institutions worldwide. Our platform is designed to provide 
              all the information you need to make informed decisions about your academic future.
            </p>
            
            <h2>Global Partnerships</h2>
            <p>
              We collaborate with top-ranking universities and educational institutes across the globe 
              to bring international standards of education directly to your screen. Explore programs 
              that are recognized worldwide and open doors to global career opportunities.
            </p>
          </div>
          
          <div className="about-image-grid">
            <div className="about-img placeholder-1"></div>
            <div className="about-img placeholder-2"></div>
            <div className="about-img placeholder-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

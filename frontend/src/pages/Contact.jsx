function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! Our admissions team will get back to you shortly.");
  };

  return (
    <div className="public-page">
      <div className="public-page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our support and partnership teams</p>
      </div>
      
      <div className="public-container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Reach Out</h2>
            <p>We are here to answer any questions you may have about navigating our platform, finding courses, or partnering with us.</p>
            
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <strong>Office Address</strong>
                <p>CourseNET Headquarters,<br/>Colombo,<br/>Sri Lanka.</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <strong>Phone</strong>
                <p>+94 11 544 5000<br/>+94 71 123 4567</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <strong>Email</strong>
                <p>inquiries@coursenet.lk<br/>support@coursenet.lk</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-card">
            <h3>Send an Inquiry</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" required>
                  <option value="">Select a topic</option>
                  <option value="support">Platform Support</option>
                  <option value="partnerships">University Partnerships</option>
                  <option value="course_inquiry">Course Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="4" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn-public-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

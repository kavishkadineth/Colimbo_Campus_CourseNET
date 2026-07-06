import { useState } from "react";
import { apiClient } from "../lib/auth";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    apiClient
      .post("/inquiries", { name, email, subject, message })
      .then(() => {
        setSuccess("Thank you! Your inquiry has been submitted. Our team will get back to you shortly.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to send inquiry. Please try again.");
      })
      .finally(() => setLoading(false));
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

            {success && (
              <div style={{ background: "#dcfce7", color: "#166534", padding: "14px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: 500, border: "1px solid #bbf7d0", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span>✅</span> {success}
              </div>
            )}
            {error && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "14px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: 500, border: "1px solid #fecaca", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span>❌</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Platform Support">Platform Support</option>
                  <option value="University Partnerships">University Partnerships</option>
                  <option value="Course Inquiry">Course Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-public-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../lib/auth";

function ApplyCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [alIndexNumber, setAlIndexNumber] = useState("");
  const [alResults, setAlResults] = useState("");
  const [paymentSheet, setPaymentSheet] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/courses/${id}`)
      .then((response) => setCourse(response.data))
      .catch(() => setError("Course not found or unable to load details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("course_id", id);
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("id_number", idNumber);
    formData.append("al_index_number", alIndexNumber);
    formData.append("al_results", alResults);
    
    if (paymentSheet) {
      formData.append("payment_sheet", paymentSheet);
    }

    try {
      await apiClient.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "50vh", background: "transparent" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="public-page">
        <div className="public-container" style={{ marginTop: "60px", maxWidth: "600px", textAlign: "center", background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ color: "#0b1f42", marginBottom: "16px" }}>Application Submitted Successfully!</h2>
          <p style={{ color: "#4b5563", fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
            Thank you for applying to <strong>{course?.course_name}</strong>. We have received your application and payment details. Our team will review your submission and contact you shortly.
          </p>
          <Link to={`/courses/${id}`} className="btn-public-submit" style={{ display: "inline-block", textDecoration: "none" }}>
            Return to Course Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="public-page-header">
        <h1>Apply for Programme</h1>
        <p>Complete the form below to submit your application</p>
      </div>

      <div className="public-container">
        <Link to={`/courses/${id}`} style={{ color: "#3b82f6", textDecoration: "none", display: "inline-block", marginBottom: "24px", fontWeight: 600 }}>
          ← Back to {course?.course_name || "Course Details"}
        </Link>

        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", maxWidth: "800px", margin: "0 auto" }}>
          
          <h3 style={{ color: "#0b1f42", fontSize: "20px", marginBottom: "24px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
            Applicant Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>Full Name *</label>
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" }} 
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>Email Address *</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" }} 
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>Phone Number *</label>
              <input 
                type="text" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" }} 
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>National ID Number *</label>
              <input 
                type="text" 
                required 
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>Home Address *</label>
            <textarea 
              required 
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px", resize: "vertical" }} 
            />
          </div>

          <h3 style={{ color: "#0b1f42", fontSize: "20px", marginBottom: "24px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
            Academic Qualifications
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>A/L Index Number *</label>
            <input 
              type="text" 
              required 
              value={alIndexNumber}
              onChange={(e) => setAlIndexNumber(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" }} 
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>A/L Results *</label>
            <textarea 
              required 
              rows="4"
              placeholder="E.g.,&#10;Mathematics - A&#10;Physics - B&#10;Chemistry - C"
              value={alResults}
              onChange={(e) => setAlResults(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px", resize: "vertical" }} 
            />
          </div>

          <h3 style={{ color: "#0b1f42", fontSize: "20px", marginBottom: "24px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
            Payment
          </h3>

          {course?.application_fee && (
            <div style={{ marginBottom: "20px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#4b5563", fontWeight: 600 }}>Application Fee:</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#f59e0b" }}>
                  LKR {Number(course.application_fee).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#4b5563" }}>
              Upload Payment Sheet {course?.application_fee ? "*" : "(Optional)"}
            </label>
            <input 
              type="file" 
              accept="image/*,.pdf"
              required={!!course?.application_fee}
              onChange={(e) => setPaymentSheet(e.target.files[0])}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px dashed #cbd5e1", background: "#f8fafc", cursor: "pointer" }} 
            />
            <small style={{ color: "#64748b", marginTop: "8px", display: "block" }}>Accepted formats: JPG, PNG, PDF. Max size: 5MB.</small>
          </div>

          <button 
            type="submit" 
            className="btn-public-submit"
            disabled={submitting}
            style={{ width: "100%", padding: "16px", fontSize: "18px", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyCourse;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./CreatePayment.css";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Success Modal Component
function SuccessModal({ isOpen, onClose, paymentData }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.payment_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = paymentData.payment_url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const openPaymentLink = () => {
    window.open(paymentData.payment_url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="success-icon">
            <svg className="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2>Payment Link Created Successfully!</h2>
          <p>Your payment link has been generated and is ready to use.</p>
        </div>

        <div className="payment-details">
          <div className="detail-item">
            <label>Request ID:</label>
            <span className="request-id">{paymentData.collect_request_id}</span>
          </div>
          
          <div className="detail-item">
            <label>Payment URL:</label>
            <div className="url-container">
              <input 
                type="text" 
                value={paymentData.payment_url} 
                readOnly 
                className="url-input"
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="copy-button" 
            onClick={copyToClipboard}
            disabled={copied}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </>
            )}
          </button>

          <button className="open-button" onClick={openPaymentLink}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Link
          </button>

          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Main CreatePayment Component
function CreatePayment() {
  const [formData, setFormData] = useState({
    school_id: "",
    trustee_id: "",
    student_info: {
      name: "",
      id: "",
      email: ""
    },
    gateway_name: "PhonePe",
    amount: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  const gateways = [
    "PhonePe",
    "Paytm", 
    "Razorpay",
    "CCAvenue",
    "PayU",
    "Instamojo"
  ];

  // Save theme in localStorage
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Logout function
  async function handleLogout() {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/logout`, {
        withCredentials: true,
      });
      alert(res.data.message);
      navigate("/");
    } catch {
      alert("Logout failed. Try again.");
    }
  }

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // School ID validation
    if (!formData.school_id.trim()) {
      newErrors.school_id = "School ID is required";
    } else if (formData.school_id.length < 10) {
      newErrors.school_id = "School ID must be at least 10 characters";
    }

    // Trustee ID validation
    if (!formData.trustee_id.trim()) {
      newErrors.trustee_id = "Trustee ID is required";
    } else if (formData.trustee_id.length < 10) {
      newErrors.trustee_id = "Trustee ID must be at least 10 characters";
    }

    // Student name validation
    if (!formData.student_info.name.trim()) {
      newErrors.student_name = "Student name is required";
    } else if (formData.student_info.name.trim().length < 2) {
      newErrors.student_name = "Student name must be at least 2 characters";
    }

    // Student ID validation
    if (!formData.student_info.id.trim()) {
      newErrors.student_id = "Student ID is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.student_info.email.trim()) {
      newErrors.student_email = "Email is required";
    } else if (!emailRegex.test(formData.student_info.email)) {
      newErrors.student_email = "Please enter a valid email address";
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    } else if (parseFloat(formData.amount) > 100000) {
      newErrors.amount = "Amount cannot exceed ₹100,000";
    }

    // Gateway validation
    if (!formData.gateway_name) {
      newErrors.gateway_name = "Please select a payment gateway";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value, isStudentInfo = false) => {
    if (isStudentInfo) {
      setFormData(prev => ({
        ...prev,
        student_info: {
          ...prev.student_info,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear specific error when user starts typing
    if (errors[field] || (isStudentInfo && errors[`student_${field}`])) {
      const newErrors = { ...errors };
      delete newErrors[field];
      delete newErrors[`student_${field}`];
      setErrors(newErrors);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const response = await axios.post(
        `${API_BASE}/api/payment/create-payment`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setPaymentResponse(response.data);
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          school_id: "",
          trustee_id: "",
          student_info: {
            name: "",
            id: "",
            email: ""
          },
          gateway_name: "PhonePe",
          amount: ""
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create payment. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={`create-payment-page ${darkMode ? "dark" : "light"}`}>
      <Navbar onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="create-payment-container">
        <div className="payment-form-card">
          <div className="form-header">
            <div className="header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1>Create Payment Link</h1>
            <p>Generate a secure payment link for student transactions</p>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            {/* School & Trustee Information */}
            <div className="form-section">
              <h3 className="section-title">
                <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Institution Details
              </h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>School ID *</label>
                  <input
                    type="text"
                    value={formData.school_id}
                    onChange={(e) => handleInputChange("school_id", e.target.value)}
                    placeholder="Enter School ID"
                    className={errors.school_id ? "error" : ""}
                  />
                  {errors.school_id && <span className="error-message">{errors.school_id}</span>}
                </div>

                <div className="form-group">
                  <label>Trustee ID *</label>
                  <input
                    type="text"
                    value={formData.trustee_id}
                    onChange={(e) => handleInputChange("trustee_id", e.target.value)}
                    placeholder="Enter Trustee ID"
                    className={errors.trustee_id ? "error" : ""}
                  />
                  {errors.trustee_id && <span className="error-message">{errors.trustee_id}</span>}
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="form-section">
              <h3 className="section-title">
                <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Student Information
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Student Name *</label>
                  <input
                    type="text"
                    value={formData.student_info.name}
                    onChange={(e) => handleInputChange("name", e.target.value, true)}
                    placeholder="Enter student's full name"
                    className={errors.student_name ? "error" : ""}
                  />
                  {errors.student_name && <span className="error-message">{errors.student_name}</span>}
                </div>

                <div className="form-group">
                  <label>Student ID *</label>
                  <input
                    type="text"
                    value={formData.student_info.id}
                    onChange={(e) => handleInputChange("id", e.target.value, true)}
                    placeholder="Enter student ID"
                    className={errors.student_id ? "error" : ""}
                  />
                  {errors.student_id && <span className="error-message">{errors.student_id}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.student_info.email}
                  onChange={(e) => handleInputChange("email", e.target.value, true)}
                  placeholder="Enter student's email address"
                  className={errors.student_email ? "error" : ""}
                />
                {errors.student_email && <span className="error-message">{errors.student_email}</span>}
              </div>
            </div>

            {/* Payment Information */}
            <div className="form-section">
              <h3 className="section-title">
                <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Payment Details
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Gateway *</label>
                  <select
                    value={formData.gateway_name}
                    onChange={(e) => handleInputChange("gateway_name", e.target.value)}
                    className={errors.gateway_name ? "error" : ""}
                  >
                    <option value="">Select Gateway</option>
                    {gateways.map(gateway => (
                      <option key={gateway} value={gateway}>{gateway}</option>
                    ))}
                  </select>
                  {errors.gateway_name && <span className="error-message">{errors.gateway_name}</span>}
                </div>

                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="Enter amount"
                    className={errors.amount ? "error" : ""}
                  />
                  {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Link...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Create Payment Link
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        paymentData={paymentResponse}
      />
    </div>
  );
}

export default CreatePayment;
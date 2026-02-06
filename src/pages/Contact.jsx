/** @format */
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", form);

      // Show success state
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ general: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page min-vh-100 bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 contac-top">
          <h1 className="display-5 fw-bold text-primary mb-3">Get in Touch</h1>
          <p className="lead text-muted">
            Have questions? We're here to help! Reach out to our team.
          </p>
        </div>

        <div className="row g-5">
          {/* Left Column: Contact Form */}
          <div className="col-lg-7">
            <div className="contact-card card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-5">
                {isSubmitted ? (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-check-circle-fill text-success mb-3"
                      style={{ fontSize: "64px" }}
                    ></i>
                    <h3 className="fw-bold mb-3">Message Sent!</h3>
                    <p className="text-muted">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="fw-bold mb-4">Send us a Message</h3>

                    {errors.general && (
                      <div className="alert alert-danger" role="alert">
                        {errors.general}
                      </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label
                            htmlFor="name"
                            className="form-label fw-semibold"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className={`form-control form-control-lg ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                          {errors.name && (
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 mb-4">
                          <label
                            htmlFor="email"
                            className="form-label fw-semibold"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control form-control-lg ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            placeholder="Email@example.com"
                            value={form.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="phone"
                          className="form-label fw-semibold"
                        >
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-control form-control-lg"
                          placeholder="+20 123 456 7890"
                          value={form.phone}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="subject"
                          className="form-label fw-semibold"
                        >
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          className={`form-control form-control-lg ${
                            errors.subject ? "is-invalid" : ""
                          }`}
                          placeholder="How can we help you?"
                          value={form.subject}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        {errors.subject && (
                          <div className="invalid-feedback">
                            {errors.subject}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="message"
                          className="form-label fw-semibold"
                        >
                          Your Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          className={`form-control form-control-lg ${
                            errors.message ? "is-invalid" : ""
                          }`}
                          rows="5"
                          placeholder="Please describe your inquiry in detail..."
                          value={form.message}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        {errors.message && (
                          <div className="invalid-feedback">
                            {errors.message}
                          </div>
                        )}
                        <div className="form-text">
                          Minimum 10 characters required
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 py-3 fw-bold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Information */}
          <div className="col-lg-5">
            <div className="sticky-top" style={{ top: "2rem" }}>
              {/* Contact Info Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Contact Information</h4>

                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <i
                        className="bi bi-envelope text-primary"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Email Address</h6>
                      <p className="text-muted mb-0">info@kitchen-shop.com</p>
                      <p className="text-muted mb-0">
                        support@kitchen-shop.com
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <i
                        className="bi bi-telephone text-primary"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Phone Numbers</h6>
                      <p className="text-muted mb-0">+20 123 456 7890</p>
                      <p className="text-muted mb-0">+20 987 654 3210</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <i
                        className="bi bi-geo-alt text-primary"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Our Location</h6>
                      <p className="text-muted mb-0">
                        123 Nile Street,
                        <br />
                        Downtown, Cairo
                        <br />
                        Egypt
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                      <i
                        className="bi bi-clock text-success"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Working Hours</h5>
                      <p className="mb-1">
                        <strong>Sunday - Thursday:</strong> 9:00 AM - 6:00 PM
                      </p>
                      <p className="mb-1">
                        <strong>Friday - Saturday:</strong> 10:00 AM - 4:00 PM
                      </p>
                      <p className="text-muted small mb-0">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 me-3">
                      <i
                        className="bi bi-headset text-warning"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Need Immediate Help?</h5>
                      <p className="text-muted mb-3">
                        Call our customer support hotline for urgent inquiries.
                      </p>
                      <a
                        href="tel:+201234567890"
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-telephone me-2"></i>
                        Call Now: +20 123 456 7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <div className="text-center contac-top">
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
                {isSubmitted ?
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
                : <>
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
                        {isSubmitting ?
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Sending Message...
                          </>
                        : <>
                            <i className="bi bi-send me-2"></i>
                            Send Message
                          </>
                        }
                      </button>
                    </form>
                  </>
                }
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-envelope-at"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                        <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Email Address</h6>
                      <p className="text-muted mb-0">atta.tellwany@gmail.com</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-telephone"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Phone Numbers</h6>
                      <p className="text-muted mb-0">+20 11 55159557</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-geo-alt"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Our Location</h6>
                      <p className="text-muted mb-0">
                        Nozha,Cairo
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-gear"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                      </svg>
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
                      {/* أيقونة واتساب بدل سماعة الهاتف */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-whatsapp"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Need Immediate Help?</h5>
                      <p className="text-muted mb-3">
                        Chat with our support on WhatsApp for urgent inquiries.
                      </p>
                      <a
                        href="https://wa.me/201155159557"
                        className="btn btn-outline-success"
                        target="_blank"
                      >
                        <i className="bi bi-whatsapp me-2"></i>
                        Chat on WhatsApp
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

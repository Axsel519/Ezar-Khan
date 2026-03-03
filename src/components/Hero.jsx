/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const buttonStyle = {
    fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
    whiteSpace: "nowrap",
    minWidth: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1.5rem",
    transition: "all 0.3s ease",
  };

  return (
    <section
      className="hero-section py-5"
      style={{ backgroundColor: "#1a1a1a", color: "white" }}
    >
      {" "}
      {/* مثال لخلفية غامقة */}
      <div className="container">
        <div className="hero-content text-center px-2">
          <h1 className="hero-title display-4 fw-bold mb-4">
            Elevate Your Culinary Journey
          </h1>

          <div className="hero-buttons d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
            {/* Button: Shop Now */}
            <button
              className="btn btn-primary btn-lg shadow-sm"
              onClick={() => navigate("/shop")}
              style={buttonStyle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-cart3 me-2"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
              Shop Now
            </button>

            {/* Button: Learn More (تعديل اللون للأبيض) */}
            <button
              className="btn btn-outline-light btn-lg"
              onClick={() => navigate("/about")}
              style={{
                ...buttonStyle,
                borderWidth: "2px",
                color: "#ffffff", // لون النص أبيض
                borderColor: "#ffffff", // لون الحدود أبيض
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "black";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-info-circle me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
              </svg>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

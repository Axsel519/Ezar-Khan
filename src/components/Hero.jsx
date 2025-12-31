/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section py-4 py-md-5">
      <div className="container">
        <div className="hero-content text-center px-2">
          <h1 className="hero-title display-5 display-md-4 fw-bold mb-3">
            Elevate Your Culinary Journey
          </h1>

          {/* تغيير هنا فقط */}
          <div className="hero-buttons d-flex flex-wrap justify-content-center align-items-center gap-3 gap-md-4 gap-lg-5">
            <button
              className="btn btn-primary hero-btn px-3 px-sm-4 px-md-5 py-2 py-sm-3"
              onClick={() => navigate("/shop")}
              style={{
                fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                whiteSpace: "nowrap",
                minWidth: "fit-content",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="clamp(16px, 2vw, 20px)"
                height="clamp(16px, 2vw, 20px)"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="me-2 flex-shrink-0"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
              Shop Now
            </button>

            <button
              className="btn btn-outline-light px-3 px-sm-4 px-md-5 py-2 py-sm-3"
              onClick={() => navigate("/about")}
              style={{
                fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                whiteSpace: "nowrap",
                minWidth: "fit-content",
                borderWidth: "2px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="clamp(16px, 2vw, 20px)"
                height="clamp(16px, 2vw, 20px)"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="me-2 flex-shrink-0"
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

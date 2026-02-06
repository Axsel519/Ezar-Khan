/** @format */

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useAuth } from "../components/AuthContext";

export default function Header({ cartCount = 0, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout, updateProfilePicture } = useAuth();

  // State variables
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(
    currentUser?.profileImage || null,
  );
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Refs
  const fileInputRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle screen resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update profile image when user changes
  useEffect(() => {
    if (currentUser?.profileImage) {
      setProfileImage(currentUser.profileImage);
    } else {
      setProfileImage(null);
    }
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
        setShowImageUpload(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when offcanvas is open
  useEffect(() => {
    if (showOffcanvas) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showOffcanvas]);

  // Handle image selection for profile picture
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار ملف صورة");
      return;
    }

    uploadProfileImage(file);
  };

  // Upload profile image
  const uploadProfileImage = (file) => {
    setUploading(true);
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedUser = {
          ...currentUser,
          profileImage: base64Image,
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        if (updateProfilePicture) {
          updateProfilePicture(base64Image);
        }

        setProfileImage(base64Image);
        setUploading(false);
        setShowImageUpload(false);
        window.dispatchEvent(new Event("authUpdate"));
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  // Remove profile image
  const removeProfileImage = () => {
    const updatedUser = {
      ...currentUser,
      profileImage: null,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    if (updateProfilePicture) {
      updateProfilePicture(null);
    }

    setProfileImage(null);
    setShowImageUpload(false);
    window.dispatchEvent(new Event("authUpdate"));
  };

  // Handle search functionality
  const filteredSuggestions =
    searchQuery.trim() ?
      products
        .filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const handleSuggestionClick = (productId) => {
    navigate(`/shop/${productId}`);
    setSearchQuery("");
    setShowOffcanvas(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/shop");
      setShowOffcanvas(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("authUpdate"));
    setShowOffcanvas(false);
    setShowUserMenu(false);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Profile icon component
  const ProfileIconElement = ({ size = "40px", showBorder = false }) => (
    <div
      className="profile-icon-container"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        border: showBorder ? "2px solid #dee2e6" : "none",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onClick={() => setShowUserMenu(!showUserMenu)}
    >
      {profileImage ?
        <img
          src={profileImage}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      : <svg
          xmlns="http://www.w3.org/2000/svg"
          width={
            size === "40px" ? "24"
            : size === "60px" ?
              "32"
            : "20"
          }
          height={
            size === "40px" ? "24"
            : size === "60px" ?
              "32"
            : "20"
          }
          fill="currentColor"
          className="bi bi-person-circle"
          viewBox="0 0 16 16"
          style={{ color: "#6c757d" }}
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      }
    </div>
  );

  return (
    <>
      {/* Mobile Design */}
      {isMobile ?
        <nav className="navbar bg-body-tertiary fixed-top">
          <div className="container-fluid">
            {/* Logo */}
            <Link to="/" className="navbar-brand">
              <img
                src="/logo-ek.png"
                alt="logo"
                style={{ width: "16vw", height: "auto" }}
              />
            </Link>

            {/* Right Side Actions */}
            <div className="d-flex align-items-center gap-3">
              {/* Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                style={{ position: "relative" }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ width: "27vw", borderRadius: "20px" }}
                />
                {filteredSuggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 mt-1"
                    style={{ zIndex: 1000 }}
                  >
                    {filteredSuggestions.map((p) => (
                      <li
                        key={p.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSuggestionClick(p.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {p.title}
                      </li>
                    ))}
                  </ul>
                )}
              </form>

              {/* Shopping Cart */}
              <div
                style={{ position: "relative", display: "inline-block" }}
                className="cart hover-container"
              >
                <Link
                  to="/cart"
                  className="btn btn-link p-0 cart-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ color: "#0d6efd", transition: "all 0.3s ease" }}
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                  </svg>
                </Link>
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 5px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      zIndex: 10,
                      minWidth: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                    className="cart-counter"
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Hamburger Menu */}
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setShowOffcanvas(true)}
                aria-label="Toggle navigation"
                style={{ padding: "0.5vh 0.9vw" }}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            {/* Offcanvas Menu */}
            {showOffcanvas && (
              <>
                <div
                  id="offcanvasBackdrop"
                  className="offcanvas-backdrop show"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1040,
                  }}
                  onClick={() => setShowOffcanvas(false)}
                />
                <div
                  className="offcanvas offcanvas-end show"
                  style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "280px",
                    height: "100%",
                    backgroundColor: "white",
                    zIndex: 1050,
                  }}
                >
                  {/* Offcanvas Content */}
                  <div
                    className="offcanvas-header"
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <h5
                      className="offcanvas-title"
                      style={{ fontWeight: "bold" }}
                    >
                      Ezar Khan
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowOffcanvas(false)}
                    />
                  </div>
                  <div
                    className="offcanvas-body"
                    style={{
                      overflowY: "auto",
                      height: "calc(100% - 57px)",
                      padding: "0",
                    }}
                  >
                    {/* Navigation Links */}
                    <ul className="navbar-nav flex-grow-1 header-nav-links">
                      <li className="nav-item">
                        <NavLink
                          to="/"
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                          }
                          onClick={() => setShowOffcanvas(false)}
                          style={{ padding: "12px 20px" }}
                        >
                          Home
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/shop"
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                          }
                          onClick={() => setShowOffcanvas(false)}
                          style={{ padding: "12px 20px" }}
                        >
                          Shop
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/about"
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                          }
                          onClick={() => setShowOffcanvas(false)}
                          style={{ padding: "12px 20px" }}
                        >
                          About Us
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/contact"
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                          }
                          onClick={() => setShowOffcanvas(false)}
                          style={{ padding: "12px 20px" }}
                        >
                          Contact
                        </NavLink>
                      </li>
                      {isLoggedIn &&
                        currentUser?.role?.toUpperCase() === "ADMIN" && (
                          <li className="nav-item">
                            <NavLink
                              to="/admin"
                              className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : ""}`
                              }
                              onClick={() => setShowOffcanvas(false)}
                              style={{
                                padding: "12px 20px",
                                color: "#dc3545",
                                fontWeight: "600",
                              }}
                            >
                              <i className="bi bi-speedometer2 me-2"></i>
                              Admin Dashboard
                            </NavLink>
                          </li>
                        )}
                    </ul>

                    {/* User Section */}
                    <div className="p-3 border-top mt-3">
                      {isLoggedIn ?
                        <div className="user-section">
                          {/* User Info */}
                          <div className="d-flex align-items-center mb-3">
                            <div className="position-relative">
                              <ProfileIconElement
                                size="50px"
                                showBorder={true}
                              />
                              <button
                                className="btn-change-image-offcanvas"
                                onClick={() =>
                                  setShowImageUpload(!showImageUpload)
                                }
                                title="Change profile picture"
                                style={{
                                  position: "absolute",
                                  bottom: "0",
                                  right: "0",
                                  backgroundColor: "#0d6efd",
                                  color: "white",
                                  border: "2px solid white",
                                  borderRadius: "50%",
                                  width: "20px",
                                  height: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  fontSize: "10px",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                </svg>
                              </button>
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0 fw-bold name">
                                {currentUser?.name || "User"}
                              </h6>
                              <small className="text-muted">
                                {currentUser?.email || ""}
                              </small>
                            </div>
                          </div>

                          {/* Image Upload Options */}
                          {showImageUpload && (
                            <div className="image-upload-options-offcanvas mt-3 p-3 border rounded bg-light">
                              <h6 className="mb-2 text-center">
                                Change Profile Picture
                              </h6>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                style={{ display: "none" }}
                              />
                              <div className="d-flex flex-column gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary w-100"
                                  onClick={() => fileInputRef.current.click()}
                                  disabled={uploading}
                                >
                                  {uploading ?
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2"></span>
                                      Uploading...
                                    </>
                                  : "Upload New Photo"}
                                </button>
                                {profileImage && (
                                  <button
                                    className="btn btn-sm btn-outline-danger w-100"
                                    onClick={removeProfileImage}
                                    disabled={uploading}
                                  >
                                    Remove Current Photo
                                  </button>
                                )}
                                <button
                                  className="btn btn-sm btn-outline-secondary w-100"
                                  onClick={() => setShowImageUpload(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                              <div className="text-muted small mt-2 text-center">
                                Max 5MB • JPG, PNG, GIF
                              </div>
                            </div>
                          )}

                          {/* Logout Button */}
                          <div className="mt-3">
                            <button
                              onClick={handleLogout}
                              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-box-arrow-right me-2"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                                />
                                <path
                                  fillRule="evenodd"
                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                                />
                              </svg>{" "}
                              Logout
                            </button>
                          </div>
                        </div>
                      : <Link
                          to="/login"
                          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                          onClick={() => setShowOffcanvas(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-box-arrow-in-right me-2"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                            />
                            <path
                              fillRule="evenodd"
                              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                            />
                          </svg>{" "}
                          Login / Sign Up
                        </Link>
                      }
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      : /* Desktop Design */
        <header className="px-2 px-sm-3 px-md-4 shadow-md">
          <div className="d-flex align-items-center justify-content-between py-3">
            {/* Logo */}
            <Link to="/" className="me-5">
              <img
                src="/logo-ek.png"
                alt="logo"
                style={{ width: "15vw", height: "auto" }}
              />
            </Link>

            {/* Navigation Links */}
            <nav className="d-flex align-items-center nav-links header-nav-links">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                style={{
                  textDecoration: "none",
                  color: "#495057",
                  fontWeight: "500",
                }}
              >
                Shop
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                style={{
                  textDecoration: "none",
                  color: "#495057",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                style={{
                  textDecoration: "none",
                  color: "#495057",
                  fontWeight: "500",
                }}
              >
                Contact
              </NavLink>
              {isLoggedIn && currentUser?.role?.toUpperCase() === "ADMIN" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  style={{
                    textDecoration: "none",
                    color: "#dc3545",
                    fontWeight: "600",
                  }}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Admin
                </NavLink>
              )}
            </nav>

            {/* Search Field */}
            <div
              className="flex-grow-1 mx-3 searching"
              style={{ maxWidth: "35vw" }}
            >
              <form
                onSubmit={handleSearchSubmit}
                style={{ position: "relative", width: "30vw" }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{
                    width: "80%",
                    borderRadius: "20px",
                    border: "1px solid #ced4da",
                  }}
                />
                {filteredSuggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 mt-1"
                    style={{ zIndex: 1000 }}
                  >
                    {filteredSuggestions.map((p) => (
                      <li
                        key={p.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSuggestionClick(p.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {p.title}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            {/* Cart and Profile */}
            <div className="d-flex align-items-center gap-3">
              {/* Shopping Cart */}
              <div
                style={{ position: "relative", display: "inline-block" }}
                className="cart hover-container"
              >
                <Link
                  to="/cart"
                  className="btn btn-link p-0 cart-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ color: "#0d6efd", transition: "all 0.3s ease" }}
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                  </svg>
                </Link>
                {cartCount > 0 && (
                  <span
                    className="cart-counter"
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 5px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      zIndex: 10,
                      minWidth: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="position-relative" ref={userMenuRef}>
                <button
                  className="btn btn-link p-0"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    border: "none",
                    background: "transparent",
                    textDecoration: "none",
                  }}
                >
                  <ProfileIconElement size="44px" showBorder={false} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="position-absolute top-100 end-0 mt-2"
                    style={{
                      minWidth: "300px",
                      backgroundColor: "white",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                    }}
                  >
                    <div>
                      {isLoggedIn ?
                        <>
                          {/* User Info */}
                          <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <ProfileIconElement
                                  size="60px"
                                  showBorder={true}
                                />
                                <button
                                  className="btn-change-image"
                                  onClick={() =>
                                    setShowImageUpload(!showImageUpload)
                                  }
                                  title="Change profile picture"
                                  style={{
                                    position: "absolute",
                                    bottom: "0",
                                    right: "0",
                                    backgroundColor: "#0d6efd",
                                    color: "white",
                                    border: "2px solid white",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                  </svg>
                                </button>
                              </div>
                              <div>
                                <div className="fw-bold text-start">
                                  {currentUser?.name || "User"}
                                </div>
                                <div className="small text-muted">
                                  {currentUser?.email || ""}
                                </div>
                              </div>
                            </div>

                            {/* Image Upload Options */}
                            {showImageUpload && (
                              <div className="mt-3 p-3 border rounded">
                                <h6 className="mb-2">Change Profile Picture</h6>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleImageSelect}
                                  accept="image/*"
                                  style={{ display: "none" }}
                                />
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-outline-primary flex-fill"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploading}
                                  >
                                    {uploading ? "Uploading..." : "Upload"}
                                  </button>
                                  {profileImage && (
                                    <button
                                      className="btn btn-sm btn-outline-danger flex-fill"
                                      onClick={removeProfileImage}
                                      disabled={uploading}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                                <div className="text-muted small mt-2">
                                  Max 5MB • JPG, PNG, GIF
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Logout Button */}
                          <div className="p-2">
                            <button
                              onClick={handleLogout}
                              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-box-arrow-right me-2"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                                />
                                <path
                                  fillRule="evenodd"
                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                                />
                              </svg>{" "}
                              Logout
                            </button>
                          </div>
                        </>
                      : <div className="p-3">
                          <Link
                            to="/login"
                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-box-arrow-in-right me-2"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                              />
                              <path
                                fillRule="evenodd"
                                d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                              />
                            </svg>{" "}
                            Login / Sign Up
                          </Link>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      }
    </>
  );
}

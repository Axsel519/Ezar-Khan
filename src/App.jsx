/** @format */

// ============================================
// MAIN APPLICATION COMPONENT - ROOT
// ============================================
// Manages global state, routing, and provides context to all components

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

// Page Components
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Utility Functions
import { loadCart, updateCart } from "./utils/cart";

// ============================================
// TOAST NOTIFICATION COMPONENT
// ============================================
// Displays temporary success/error/warning messages
const Toast = ({ message, type = "success" }) => {
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : type === "warning"
      ? "bg-yellow-500"
      : type === "info"
      ? "bg-blue-500"
      : "bg-gray-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-xl z-50 max-w-md animate-slide-in`}
    >
      <div className="flex items-center gap-3">
        <i
          className={`bi ${
            type === "success" ? "bi-check-circle" : "bi-info-circle"
          } text-xl`}
        ></i>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// APP CONTENT COMPONENT
// ============================================
// Core application logic and state management
function AppContent() {
  // ========== STATE MANAGEMENT ==========
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ========== INITIALIZATION EFFECTS ==========
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCart();
    setCart(savedCart);
  }, []);

  // ========== CART MANAGEMENT FUNCTIONS ==========
  /**
   * Show toast notification with auto-hide
   * @param {string} message - Notification message
   * @param {string} type - success/error/warning/info
   */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  /**
   * Update cart with product and quantity
   * @param {Object} product - Product object
   * @param {number} quantity - Desired quantity (0 to remove)
   */
  const handleUpdateCart = (product, quantity = 1) => {
    const updatedCart = updateCart(product, quantity);
    setCart(updatedCart);

    // Show appropriate toast message
    if (quantity === 0) {
      showToast(`تمت إزالة ${product.title} من السلة`, "info");
    } else if (quantity > 0) {
      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        showToast(`تم تحديث كمية ${product.title} إلى ${quantity}`, "success");
      } else {
        showToast(`تمت إضافة ${product.title} إلى السلة`, "success");
      }
    }
  };

  /**
   * Get quantity of specific product in cart
   * @param {string} productId - Product ID
   * @returns {number} Quantity in cart
   */
  const getProductQuantity = (productId) => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  /**
   * Verify user authentication before order confirmation
   * @param {Object} orderDetails - Order information
   * @returns {boolean} True if user is authenticated
   */
  const handleOrderConfirmation = (orderDetails) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!isLoggedIn || !currentUser) {
      showToast("الرجاء تسجيل الدخول أولاً لتأكيد الطلب", "warning");
      return false;
    }

    showToast(`تم تأكيد طلبك بنجاح، ${currentUser.name}`, "success");
    return true;
  };

  // Calculate total items in cart for header badge
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // ========== RENDER ==========
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with search and cart */}
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main content area */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Home onAdd={handleUpdateCart} getQuantity={getProductQuantity} />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                onAdd={handleUpdateCart}
                getQuantity={getProductQuantity}
                searchQuery={searchQuery}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (require auth) */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cart}
                onUpdateCart={handleUpdateCart}
                onOrderConfirm={handleOrderConfirmation}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout cartItems={cart} onUpdateCart={handleUpdateCart} />
            }
          />

          {/* Product Routes */}
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                onAdd={handleUpdateCart}
                getProductQuantity={getProductQuantity}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/shop/:id"
            element={
              <ProductDetails
                onAdd={handleUpdateCart}
                getProductQuantity={getProductQuantity}
                showToast={showToast}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// ============================================
// MAIN APP EXPORT WITH AUTH PROVIDER
// ============================================
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

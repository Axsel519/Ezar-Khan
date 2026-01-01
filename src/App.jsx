/** @format */

// ============================================
// MAIN APPLICATION COMPONENT
// ============================================
// This is the root component that manages the overall application state
// including authentication, cart management, and routing

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
import Checkout from "./pages/Checkout"; // Import Checkout component

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Utility Functions
import { loadCart, updateCart } from "./utils/cart";

// ============================================
// TOAST NOTIFICATION COMPONENT
// ============================================
// Displays temporary notifications for user actions
const Toast = ({ message, type = "success" }) => {
  // Determine background color based on notification type
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
// Contains the main application logic and state management
function AppContent() {
  // ========== STATE MANAGEMENT ==========
  const [cart, setCart] = useState([]); // Shopping cart items
  const [searchQuery, setSearchQuery] = useState(""); // Search query from header
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  }); // Toast notification state

  // ========== EFFECTS ==========
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = loadCart();
    setCart(savedCart);
  }, []);

  // ========== UTILITY FUNCTIONS ==========

  /**
   * Displays a toast notification to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (success, error, warning, info)
   */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  /**
   * Updates the shopping cart with a product and quantity
   * @param {Object} product - The product to add/update
   * @param {number} quantity - The quantity to set (0 removes the product)
   */
  const handleUpdateCart = (product, quantity = 1) => {
    const updatedCart = updateCart(product, quantity);
    setCart(updatedCart);

    // Show appropriate notification based on action
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
   * Gets the quantity of a specific product in the cart
   * @param {string} productId - The ID of the product
   * @returns {number} The quantity of the product in the cart
   */
  const getProductQuantity = (productId) => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  /**
   * Handles order confirmation with login verification
   * @param {Object} orderDetails - The order details to confirm
   * @returns {boolean} True if order can proceed, false if login is required
   */
  const handleOrderConfirmation = (orderDetails) => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!isLoggedIn || !currentUser) {
      showToast("الرجاء تسجيل الدخول أولاً لتأكيد الطلب", "warning");
      return false; // Prevent order confirmation
    }

    // User is logged in, proceed with order confirmation
    showToast(`تم تأكيد طلبك بنجاح، ${currentUser.name}`, "success");
    return true; // Allow order confirmation
  };

  // Calculate total items in cart for badge display
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER COMPONENT */}
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        <Routes>
          {/* HOME PAGE */}
          <Route
            path="/"
            element={
              <Home onAdd={handleUpdateCart} getQuantity={getProductQuantity} />
            }
          />

          {/* SHOP PAGE */}
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

          {/* ABOUT PAGE */}
          <Route path="/about" element={<About />} />

          {/* CONTACT PAGE */}
          <Route path="/contact" element={<Contact />} />

          {/* AUTHENTICATION PAGES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* CART PAGE */}
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

          {/* CHECKOUT PAGE - 4-STEP PROCESS */}
          <Route
            path="/checkout"
            element={
              <Checkout cartItems={cart} onUpdateCart={handleUpdateCart} />
            }
          />

          {/* PRODUCT DETAILS PAGES */}
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

      {/* FOOTER COMPONENT */}
      <Footer />

      {/* TOAST NOTIFICATION */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT WITH AUTH PROVIDER
// ============================================
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

/** @format */

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import { loadCart, updateCart } from "./utils/cart";
import { AuthProvider } from "./components/AuthContext";

// مكون Toast للإشعارات
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

function AppContent() {
  // حالة التطبيق
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // تحميل السلة عند بدء التشغيل
  useEffect(() => {
    const savedCart = loadCart();
    setCart(savedCart);
  }, []);

  // عرض إشعار
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // التعامل مع تحديث السلة
  const handleUpdateCart = (product, quantity = 1) => {
    const updatedCart = updateCart(product, quantity);
    setCart(updatedCart);

    // عرض رسالة مناسبة حسب الحالة
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

  // الحصول على كمية منتج معين
  const getProductQuantity = (productId) => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // حساب إجمالي عدد العناصر في السلة
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* الهيدر مع البحث والسلة */}
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* المحتوى الرئيسي */}
      <main className="flex-1">
        <Routes>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={<Cart cartItems={cart} onUpdateCart={handleUpdateCart} />}
          />

          {/* مسارات المنتجات */}
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

      {/* الفوتر */}
      <Footer />

      {/* إشعارات Toast */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// المكون الرئيسي مع Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

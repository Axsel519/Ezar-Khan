/** @format */

import React, { createContext, useState, useContext, useEffect } from "react";

// إنشاء context للمصادقة
const AuthContext = createContext();

// Hook مخصص لاستخدام context المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("يجب استخدام useAuth داخل AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // حالة المصادقة الأولية
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    currentUser: null,
    isLoading: true,
  });

  // التحقق من حالة تسجيل الدخول من localStorage
  const checkAuth = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
    return { loggedIn, userData };
  };

  // تحديث حالة المصادقة بناءً على localStorage
  const updateAuthState = () => {
    const { loggedIn, userData } = checkAuth();
    setAuthState({
      isLoggedIn: loggedIn,
      currentUser: userData,
      isLoading: false,
    });
  };

  // الاستماع لتغيرات localStorage والمزامنة بين النوافذ
  useEffect(() => {
    updateAuthState(); // التحميل الأولي

    // الاستماع لتغيرات localStorage من نوافذ أخرى
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener("storage", handleStorageChange);

    // تنظيف الـ listeners عند إلغاء التثبيت
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // تسجيل الدخول
  const login = (userData) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));

    setAuthState({
      isLoggedIn: true,
      currentUser: userData,
      isLoading: false,
    });

    // إرسال حدث لتحديث جميع المكونات
    window.dispatchEvent(new Event("authStateChanged"));
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    setAuthState({
      isLoggedIn: false,
      currentUser: null,
      isLoading: false,
    });

    window.dispatchEvent(new Event("authStateChanged"));
  };

  // تحديث صورة الملف الشخصي
  const updateProfilePicture = (imageUrl) => {
    if (authState.currentUser) {
      const updatedUser = {
        ...authState.currentUser,
        profileImage: imageUrl,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setAuthState((prev) => ({
        ...prev,
        currentUser: updatedUser,
      }));
    }
  };

  // الاستماع لأحداث التحديث الداخلية
  useEffect(() => {
    const handleAuthChange = () => {
      updateAuthState();
    };

    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  // القيم المتاحة للمكونات الفرعية
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        currentUser: authState.currentUser,
        isLoading: authState.isLoading,
        login,
        logout,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

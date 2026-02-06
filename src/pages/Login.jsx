/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { authAPI } from "../services/api";

/**
 * Login Component - تصميم جديد وجميل
 * يعالج تسجيل الدخول مع التحقق من صحة النموذج
 * @component
 */
const Login = () => {
  // حالة النموذج
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // حالة الواجهة
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // الهوكس
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * التعامل مع تغييرات الإدخال
   * @param {Event} e - حدث تغيير الإدخال
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // مسح الخطأ المحدد للحقل
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // مسح الخطأ العام
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  /**
   * التحقق من صحة بيانات النموذج
   * @returns {Object} أخطاء التحقق
   */
  const validateForm = () => {
    const validationErrors = {};

    // التحقق من البريد الإلكتروني
    if (!formData.email.trim()) {
      validationErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "الرجاء إدخال بريد إلكتروني صحيح";
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      validationErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      validationErrors.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
    }

    return validationErrors;
  };

  /**
   * التعامل مع إرسال النموذج
   * @param {Event} e - حدث إرسال النموذج
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة النموذج
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // بدء حالة التحميل
    setIsLoading(true);

    try {
      // Call backend API
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

<<<<<<< HEAD
      console.log("Login response:", response); // Debug log
=======
      console.log('Login response:', response); // Debug log
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c

      // تحضير بيانات المستخدم
      const userData = {
        id: response.user._id || response.user.id,
        email: response.user.email,
<<<<<<< HEAD
        name:
          response.user.firstName ||
          response.user.name ||
          response.user.email.split("@")[0],
        role: response.user.role?.toUpperCase() || "CUSTOMER", // Convert to uppercase
=======
        name: response.user.firstName || response.user.name || response.user.email.split("@")[0],
        role: response.user.role?.toUpperCase() || 'CUSTOMER', // Convert to uppercase
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
        profileImage: response.user.profileImage || null,
      };

      // Get token (handle both 'token' and 'access_token')
      const token = response.token || response.access_token;

      // تحديث سياق المصادقة
      login(userData, token);

      // إذا اختار تذكرني
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // إرسال أحداث للتحديث في جميع أنحاء التطبيق
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("authUpdate"));

      // رسالة نجاح
      console.log("تم تسجيل الدخول بنجاح!");

      // إعادة التوجيه إلى الصفحة الرئيسية
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
<<<<<<< HEAD

      if (error.response?.status === 401) {
        setErrors({
          general:
            "البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.",
=======
      
      if (error.response?.status === 401) {
        setErrors({
          general: "البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.",
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
        });
      } else if (error.response?.status === 404) {
        setErrors({ general: "لم يتم العثور على حساب. الرجاء التسجيل أولاً." });
      } else {
        setErrors({
<<<<<<< HEAD
          general:
            error.response?.data?.message ||
            "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً.",
=======
          general: error.response?.data?.message || "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً.",
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * التعامل مع تسجيل الدخول عبر وسائل التواصل الاجتماعي
   * @param {string} provider - مزود التواصل الاجتماعي
   */
  const handleSocialLogin = (provider) => {
    // تأثير بسيط عند النقر
    const button = document.querySelector(`.btn-${provider}`);
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "";
      }, 200);
    }

    console.log(`جاري تسجيل الدخول عبر ${provider}`);
    // يمكنك إضافة منطق OAuth هنا
  };

  return (
    <div className="login-page">
      {/* عناصر عائمة للخلفية */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      <div className="login-container">
        <div className="login-card">
          {/* رأس الصفحة */}
          <div className="login-header">
            <div className="login-logo">
              <i className="bi bi-shop"></i>
            </div>
            <h1 className="login-title">مرحباً بعودتك</h1>
            <p className="login-subtitle">
              سجل الدخول إلى حسابك لمواصلة التسوق
            </p>
          </div>

          {/* عرض الأخطاء */}
          {errors.general && (
            <div className="login-alert" role="alert">
              <i className="bi bi-exclamation-triangle"></i>
              <span>{errors.general}</span>
            </div>
          )}

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* حقل البريد الإلكتروني */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <div className="input-container">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  disabled={isLoading}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <div id="email-error" className="error-message">
                  <i className="bi bi-info-circle"></i>
                  {errors.email}
                </div>
              )}
            </div>

            {/* حقل كلمة المرور */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`form-input ${
                    errors.password ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                  dir="ltr"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                  <span className="toggle-text">
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <div id="password-error" className="error-message">
                  <i className="bi bi-info-circle"></i>
                  {errors.password}
                </div>
              )}
            </div>

            {/* خيارات إضافية */}
            <div className="form-options">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-mark"></span>
                <span className="checkbox-label">تذكرني</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button type="submit" className="login-btn" disabled={isLoading}>
<<<<<<< HEAD
              {isLoading ?
=======
              {isLoading ? (
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                <>
                  <span className="btn-spinner"></span>
                  جاري تسجيل الدخول...
                </>
<<<<<<< HEAD
              : <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  تسجيل الدخول
                </>
              }
            </button>

            {/* فاصل */}
            <div className="divider"></div>
=======
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  تسجيل الدخول
                </>
              )}
            </button>

            {/* فاصل */}
            <div className="divider">
              <span>أو متابعة عبر</span>
            </div>

            {/* أزرار وسائل التواصل الاجتماعي */}
            <div className="social-login">
              <button
                type="button"
                className="social-btn btn-google"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <span className="social-icon">
                  <i className="bi bi-google"></i>
                </span>
                <span className="social-text">Google</span>
              </button>
              <button
                type="button"
                className="social-btn btn-facebook"
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
              >
                <span className="social-icon">
                  <i className="bi bi-facebook"></i>
                </span>
                <span className="social-text">Facebook</span>
              </button>
            </div>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
          </form>

          {/* تذييل الصفحة */}
          <div className="login-footer">
            <p>
              ليس لديك حساب؟{" "}
              <Link to="/register" className="register-link">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// تصدير المكون
export { Login };
export default Login;

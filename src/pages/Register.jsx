/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Luxury Register Component
 * صفحة إنشاء حساب بتصميم فاخر وحديث
 * @component
 */
const LuxuryRegister = () => {
  const navigate = useNavigate();

  // حالة النموذج
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  // حالة الواجهة
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  /**
   * التعامل مع تغييرات الإدخال
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  /**
   * التحقق من صحة البيانات
   */
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "الاسم الكامل مطلوب";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
    }

    if (!form.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "بريد إلكتروني غير صالح";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم هاتف غير صالح";
    }

    if (!form.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    } else if (form.address.trim().length < 10) {
      newErrors.address = "يرجى إدخال عنوان مفصل أكثر";
    }

    if (!form.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (form.password.length < 8) {
      newErrors.password = "8 أحرف على الأقل";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "أحرف كبيرة وصغيرة وأرقام";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    if (!agreedToTerms) {
      newErrors.terms = "يجب الموافقة على الشروط";
    }

    return newErrors;
  };

  /**
   * حساب قوة كلمة المرور
   */
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = calculatePasswordStrength(form.password);
  const strengthLabels = ["ضعيفة جداً", "ضعيفة", "متوسطة", "قوية", "قوية جداً"];
  const strengthColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#16a34a",
  ];

  /**
   * معالجة التسجيل
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        ...form,
        createdAt: new Date().toISOString(),
        profileImage: null,
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      setShowSuccessToast(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrors({ general: "حدث خطأ. يرجى المحاولة مرة أخرى." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="luxury-register-page">
      {/* أشكال عائمة */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>

      {/* Toast النجاح */}
      {showSuccessToast && (
        <div className="luxury-toast">
          <div className="toast-wrapper">
            <div className="toast-icon">
              <i className="bi bi-check-lg"></i>
            </div>
            <div className="toast-content">
              <div className="toast-title">تم إنشاء الحساب بنجاح! 🎉</div>
              <div className="toast-message">
                جاري توجيهك إلى صفحة تسجيل الدخول...
              </div>
            </div>
            <button
              className="toast-close"
              onClick={() => setShowSuccessToast(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}

      <div className="luxury-container">
        <div className="luxury-card">
          {/* القسم الأيسر - النموذج */}
          <div className="luxury-left">
            <div className="luxury-header">
              <div className="luxury-logo">
                <i className="bi bi-gem"></i>
              </div>
              <h1 className="luxury-title">انضم إلى عائلتنا</h1>
              <p className="luxury-subtitle">
                ابدأ رحلتك معنا واستمتع بتجربة تسوق استثنائية
              </p>
            </div>

            <form onSubmit={handleRegister} className="luxury-form">
              {errors.general && (
                <div className="error-message">
                  <i className="bi bi-exclamation-triangle"></i>
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="form-grid">
                {/* الاسم */}
                <div className="luxury-form-group">
                  <label className="luxury-label">
                    <i className="bi bi-person-circle"></i>
                    الاسم الكامل
                  </label>
                  <div className="luxury-input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
                      className={`luxury-input ${errors.name ? "error" : ""}`}
                      disabled={isSubmitting}
                    />
                    <i className="bi bi-person luxury-input-icon"></i>
                  </div>
                  {errors.name && (
                    <div className="error-message">
                      <i className="bi bi-info-circle"></i>
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* البريد الإلكتروني */}
                <div className="luxury-form-group">
                  <label className="luxury-label">
                    <i className="bi bi-envelope"></i>
                    البريد الإلكتروني
                  </label>
                  <div className="luxury-input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@domain.com"
                      className={`luxury-input ${errors.email ? "error" : ""}`}
                      disabled={isSubmitting}
                    />
                    <i className="bi bi-at luxury-input-icon"></i>
                  </div>
                  {errors.email && (
                    <div className="error-message">
                      <i className="bi bi-info-circle"></i>
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* الهاتف */}
                <div className="luxury-form-group">
                  <label className="luxury-label">
                    <i className="bi bi-phone"></i>
                    رقم الهاتف
                  </label>
                  <div className="luxury-input-wrapper">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className={`luxury-input ${errors.phone ? "error" : ""}`}
                      disabled={isSubmitting}
                    />
                    <i className="bi bi-telephone luxury-input-icon"></i>
                  </div>
                  {errors.phone && (
                    <div className="error-message">
                      <i className="bi bi-info-circle"></i>
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* العنوان */}
                <div className="luxury-form-group">
                  <label className="luxury-label">
                    <i className="bi bi-geo-alt"></i>
                    العنوان
                  </label>
                  <div className="luxury-input-wrapper">
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="المدينة، المنطقة، الشارع"
                      className={`luxury-input ${
                        errors.address ? "error" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    <i className="bi bi-house luxury-input-icon"></i>
                  </div>
                  {errors.address && (
                    <div className="error-message">
                      <i className="bi bi-info-circle"></i>
                      {errors.address}
                    </div>
                  )}
                </div>
              </div>

              {/* كلمة المرور */}
              <div className="luxury-form-group">
                <label className="luxury-label">
                  <i className="bi bi-shield-lock"></i>
                  كلمة المرور
                </label>
                <div className="password-field">
                  <div className="luxury-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="أدخل كلمة مرور قوية"
                      className={`luxury-input ${
                        errors.password ? "error" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    <i className="bi bi-key luxury-input-icon"></i>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      <i
                        className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                      ></i>
                      <span className="toggle-label">
                        {showPassword ? "إخفاء" : "إظهار"}
                      </span>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="error-message">
                      <i className="bi bi-info-circle"></i>
                      {errors.password}
                    </div>
                  )}

                  {/* مؤشر قوة كلمة المرور */}
                  {form.password && (
                    <div className="password-strength">
                      <div className="strength-indicator">
                        <div className="strength-bars">
                          {[...Array(4)].map((_, index) => (
                            <div
                              key={index}
                              className={`strength-bar ${
                                index < passwordStrength ? "filled" : ""
                              }`}
                              style={{
                                backgroundColor:
                                  index < passwordStrength
                                    ? strengthColors[passwordStrength]
                                    : undefined,
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="strength-text">
                          {strengthLabels[passwordStrength]}
                        </div>
                      </div>
                      <div className="strength-description">
                        قوة: {passwordStrength}/4
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* تأكيد كلمة المرور */}
              <div className="luxury-form-group">
                <label className="luxury-label">
                  <i className="bi bi-shield-check"></i>
                  تأكيد كلمة المرور
                </label>
                <div className="password-field">
                  <div className="luxury-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="أعد إدخال كلمة المرور"
                      className={`luxury-input ${
                        errors.confirmPassword ? "error" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    <i className="bi bi-key-fill luxury-input-icon"></i>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isSubmitting}
                    >
                      <i
                        className={`bi bi-eye${
                          showConfirmPassword ? "-slash" : ""
                        }`}
                      ></i>
                      <span className="toggle-label">
                        {showConfirmPassword ? "إخفاء" : "إظهار"}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="error-message">
                      <i className="bi bi-info-circle"></i>
                      {errors.confirmPassword}
                    </div>
                  )}
                  {form.confirmPassword &&
                    form.password === form.confirmPassword && (
                      <div className="success-message">
                        <i className="bi bi-check-circle"></i>
                        كلمات المرور متطابقة ✓
                      </div>
                    )}
                </div>
              </div>

              {/* الشروط والأحكام */}
              <div className="terms-section">
                <label className="terms-checkbox">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <div className="checkbox-box">
                      <i className="bi bi-check-lg checkbox-tick"></i>
                    </div>
                  </div>
                  <div className="terms-text">
                    أوافق على <Link to="/terms">الشروط والأحكام</Link> و{" "}
                    <Link to="/privacy">سياسة الخصوصية</Link>
                  </div>
                </label>
                {errors.terms && (
                  <div className="error-message" style={{ marginTop: "15px" }}>
                    <i className="bi bi-info-circle"></i>
                    {errors.terms}
                  </div>
                )}
              </div>

              {/* زر التسجيل */}
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="button-spinner"></span>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus"></i>
                    إنشاء حسابي
                  </>
                )}
              </button>
            </form>

            {/* رابط تسجيل الدخول */}
            <div className="login-link-section">
              <p className="login-text">هل لديك حساب بالفعل؟</p>
              <Link to="/login" className="login-button">
                <i className="bi bi-box-arrow-in-right"></i>
                تسجيل الدخول
              </Link>
            </div>
          </div>

          {/* القسم الأيمن - المميزات */}
          <div className="luxury-right">
            <h2 className="features-title">مميزات الانضمام إلينا</h2>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <i className="bi bi-rocket-takeoff"></i>
                  </div>
                  <h3 className="feature-name">توصيل فوري</h3>
                </div>
                <p className="feature-description">
                  توصيل سريع خلال 24-48 ساعة مع تحديثات مباشرة لمسار الشحنة
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <h3 className="feature-name">أمان مطلق</h3>
                </div>
                <p className="feature-description">
                  تشفير متقدم لبياناتك ومدفوعاتك مع حماية من الاحتيال
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <i className="bi bi-gift"></i>
                  </div>
                  <h3 className="feature-name">عروض حصرية</h3>
                </div>
                <p className="feature-description">
                  خصومات تصل إلى 50% للمشتركين وعروض خاصة طوال العام
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <i className="bi bi-headset"></i>
                  </div>
                  <h3 className="feature-name">دعم فوري</h3>
                </div>
                <p className="feature-description">
                  فريق دعم متاح 24/7 لمساعدتك في أي استفسار أو مشكلة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LuxuryRegister };
export default LuxuryRegister;

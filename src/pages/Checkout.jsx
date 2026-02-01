/** @format */

// ============================================
// CHECKOUT COMPONENT - 4-Step Order Process
// ============================================
// This component handles the complete checkout process with 4 steps:
// 1. Cart Review → 2. Information → 3. Payment → 4. Complete

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { ordersAPI } from "../services/api";

export default function Checkout({ cartItems = [], onUpdateCart }) {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser } = useAuth();

  // ========== STATE MANAGEMENT ==========
  const [currentStep, setCurrentStep] = useState(1); // Current step (1-4)
  const [formData, setFormData] = useState({
    // Step 1: Cart Review
    cartVerified: false,

    // Step 2: Information
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "Egypt",
    zipCode: "",

    // Step 3: Payment
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",

    // Step 4: Complete
    orderConfirmed: false,
    orderNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // ========== CALCULATIONS ==========
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = totalAmount * 0.14; // 14% tax
  const discount = totalAmount * 0.1; // 10% discount
  const shipping = 0; // Free shipping
  const finalTotal = totalAmount + tax + shipping - discount;

  // ========== EFFECTS ==========
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [isLoggedIn, navigate]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (currentUser && currentStep === 2) {
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.name || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser, currentStep]);

  // ========== VALIDATION FUNCTIONS ==========
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Cart Review
        if (cartItems.length === 0) {
          newErrors.cart = "سلة التسوق فارغة. الرجاء إضافة منتجات أولاً.";
        }
        break;

      case 2: // Information
        if (!formData.fullName.trim()) {
          newErrors.fullName = "الاسم الكامل مطلوب";
        }
        if (!formData.email.trim()) {
          newErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "البريد الإلكتروني غير صالح";
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "رقم الهاتف مطلوب";
        }
        if (!formData.address.trim()) {
          newErrors.address = "العنوان مطلوب";
        }
        if (!formData.city.trim()) {
          newErrors.city = "المدينة مطلوبة";
        }
        break;

      case 3: // Payment
        if (formData.paymentMethod === "credit-card") {
          if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = "رقم البطاقة مطلوب";
          } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
            newErrors.cardNumber = "رقم البطاقة يجب أن يكون 16 رقمًا";
          }
          if (!formData.cardExpiry.trim()) {
            newErrors.cardExpiry = "تاريخ الانتهاء مطلوب";
          }
          if (!formData.cardCvv.trim()) {
            newErrors.cardCvv = "رمز CVV مطلوب";
          } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
            newErrors.cardCvv = "رمز CVV غير صالح";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== HANDLER FUNCTIONS ==========
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePayment = async () => {
    if (validateStep(3)) {
      setIsProcessing(true);

      try {
        // Prepare order data for backend
        const orderData = {
          items: cartItems.map(item => ({
            productId: item.product.id || item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.country}`,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
        };

        // Create order via backend API
        const response = await ordersAPI.create(orderData);

        // Generate order number from response
        const orderNumber = response.orderNumber || response.id || `ORD-${Date.now().toString().slice(-8)}`;

        setFormData((prev) => ({
          ...prev,
          orderConfirmed: true,
          orderNumber: orderNumber,
        }));

        setCurrentStep(4);

        // Save order to localStorage for reference
        const orderDetails = {
          orderNumber,
          items: cartItems,
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
          payment: {
            method: formData.paymentMethod,
            amount: finalTotal,
          },
          date: new Date().toISOString(),
          status: "confirmed",
        };

        localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
      } catch (error) {
        console.error("Payment error:", error);
        setErrors({
          payment: error.response?.data?.message || "فشل في معالجة الدفع. الرجاء المحاولة مرة أخرى.",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCompleteOrder = () => {
    // Clear cart after successful order
    cartItems.forEach((item) => onUpdateCart(item.product, 0));

    // Navigate to home or order confirmation page
    navigate("/", { state: { orderCompleted: true } });
  };

  // ========== STEP COMPONENTS ==========

  // STEP 1: CART REVIEW
  const renderStep1 = () => (
    <div className="checkout-step">
      <div className="step-header">
        <h4>
          <i className="bi bi-cart-check me-2"></i>
          مراجعة السلة
        </h4>
        <p>الرجاء مراجعة العناصر في سلة التسوق الخاصة بك</p>
      </div>

      <div className="cart-review-section">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-review-item">
            <div className="item-image">
              <img
                src={item.product.images?.[0] || "/images/placeholder.jpg"}
                alt={item.product.title}
              />
            </div>
            <div className="item-details">
              <h6>{item.product.title}</h6>
              <div className="item-meta">
                <span>الكمية: {item.quantity}</span>
                <span>السعر: {item.product.price.toFixed(2)} جنيه</span>
              </div>
            </div>
            <div className="item-total">
              <strong>
                {(item.product.price * item.quantity).toFixed(2)}{" "}
              </strong>
              <span className="currency">EGP</span>
            </div>
          </div>
        ))}
      </div>

      <div className="step-summary">
        <div className="summary-row">
          <span> : عدد العناصر</span>
          <span>{totalItems}</span>
        </div>
        <div className="summary-row">
          <span> : الإجمالي الجزئي</span>
          <span>
            {totalAmount.toFixed(2)} <span className="currency">EGP</span>
          </span>
        </div>
        <div className="summary-row">
          <span> : الضريبة (14%)</span>
          <span>
            {tax.toFixed(2)} <span className="currency">EGP</span>
          </span>
        </div>
        <div className="summary-row">
          <span> : الشحن</span>
          <span className="text-success">مجاني</span>
        </div>
        <div className="summary-row">
          <span> : الخصم (10%)</span>
          <span className="text-success">-{discount.toFixed(2)} EGP</span>
        </div>
        <div className="summary-row total">
          <span> : الإجمالي النهائي</span>
          <strong>
            {finalTotal.toFixed(2)} <span className="currency">EGP</span>
          </strong>
        </div>
      </div>

      <div className="step-actions">
        <Link to="/cart" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-right me-2"></i>
          العودة للسلة
        </Link>
        <button className="btn btn-primary" onClick={handleNextStep}>
          المتابعة للمعلومات
          <i className="bi bi-arrow-left ms-2"></i>
        </button>
      </div>
    </div>
  );

  // STEP 2: INFORMATION
  const renderStep2 = () => (
    <div className="checkout-step">
      <div className="step-header">
        <h4>
          <i className="bi bi-person-circle me-2"></i>
          معلومات العميل
        </h4>
        <p>الرجاء إدخال معلومات الشحن الخاصة بك</p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="fullName" className="form-label">
            الاسم الكامل <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          {errors.fullName && (
            <div className="invalid-feedback">{errors.fullName}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label">
            البريد الإلكتروني <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="phone" className="form-label">
            رقم الهاتف <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="address" className="form-label">
            العنوان <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="الشارع، المنطقة، المدينة"
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="city" className="form-label">
            المدينة <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="city" className="form-label">
            المحافظة <span className="text-danger">*</span>
          </label>
          <select
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          >
            <option value="">اختر المحافظة</option>
            <option value="الإسكندرية">الإسكندرية</option>
            <option value="الإسماعيلية">الإسماعيلية</option>
            <option value="أسوان">أسوان</option>
            <option value="أسيوط">أسيوط</option>
            <option value="الأقصر">الأقصر</option>
            <option value="البحر الأحمر">البحر الأحمر</option>
            <option value="البحيرة">البحيرة</option>
            <option value="بني سويف">بني سويف</option>
            <option value="بورسعيد">بورسعيد</option>
            <option value="جنوب سيناء">جنوب سيناء</option>
            <option value="الجيزة">الجيزة</option>
            <option value="الدقهلية">الدقهلية</option>
            <option value="دمياط">دمياط</option>
            <option value="سوهاج">سوهاج</option>
            <option value="السويس">السويس</option>
            <option value="الشرقية">الشرقية</option>
            <option value="شمال سيناء">شمال سيناء</option>
            <option value="الغربية">الغربية</option>
            <option value="الفيوم">الفيوم</option>
            <option value="القاهرة">القاهرة</option>
            <option value="القليوبية">القليوبية</option>
            <option value="قنا">قنا</option>
            <option value="كفر الشيخ">كفر الشيخ</option>
            <option value="مطروح">مطروح</option>
            <option value="المنوفية">المنوفية</option>
            <option value="المنيا">المنيا</option>
            <option value="الوادي الجديد">الوادي الجديد</option>
          </select>
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="zipCode" className="form-label">
            الرمز البريدي
          </label>
          <input
            type="text"
            className="form-control"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn-outline-secondary" onClick={handlePrevStep}>
          <i className="bi bi-arrow-right me-2"></i>
          العودة للسلة
        </button>
        <button className="btn btn-primary" onClick={handleNextStep}>
          المتابعة للدفع
          <i className="bi bi-arrow-left ms-2"></i>
        </button>
      </div>
    </div>
  );

  // STEP 3: PAYMENT
  const renderStep3 = () => (
    <div className="checkout-step">
      <div className="step-header">
        <h4>
          <i className="bi bi-credit-card me-2"></i>
          طريقة الدفع
        </h4>
        <p>اختر طريقة الدفع المناسبة لك</p>
      </div>

      <div className="payment-methods">
        <div className="payment-option">
          <input
            type="radio"
            id="credit-card"
            name="paymentMethod"
            value="credit-card"
            checked={formData.paymentMethod === "credit-card"}
            onChange={handleInputChange}
            className="payment-radio"
          />
          <label htmlFor="credit-card" className="payment-label">
            <div className="payment-icon">
              <i className="bi bi-credit-card-fill"></i>
            </div>
            <div className="payment-info">
              <h6>بطاقة ائتمان/خصم</h6>
              <p>فيزا، ماستركارد، أمريكان إكسبريس</p>
            </div>
          </label>
        </div>

        {/* انستا باي */}
        <div className="payment-option">
          <input
            type="radio"
            id="instapay"
            name="paymentMethod"
            value="instapay"
            checked={formData.paymentMethod === "instapay"}
            onChange={handleInputChange}
            className="payment-radio"
          />
          <label htmlFor="instapay" className="payment-label">
            <div className="payment-icon instapay-icon">
              <i className="bi bi-lightning"></i>
            </div>
            <div className="payment-info">
              <h6>انستاباي او فودافون كاش</h6>
              <p className="text-muted">تحويل بنكي فوري او محفظه اليكترونيه</p>
            </div>
          </label>
        </div>

        {/* الدفع عند الاستلام */}
        <div className="payment-option">
          <input
            type="radio"
            id="cash-on-delivery"
            name="paymentMethod"
            value="cash-on-delivery"
            checked={formData.paymentMethod === "cash-on-delivery"}
            onChange={handleInputChange}
            className="payment-radio"
          />
          <label htmlFor="cash-on-delivery" className="payment-label">
            <div className="payment-icon cash-icon">
              <i className="bi bi-truck"></i>
            </div>
            <div className="payment-info">
              <h6>الدفع عند الاستلام</h6>
              <p className="text-muted">ادفع عند استلام طلبك</p>
            </div>
          </label>
        </div>
      </div>

      {formData.paymentMethod === "credit-card" && (
        <div className="card-details mt-4">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="cardNumber" className="form-label">
                رقم البطاقة <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.cardNumber ? "is-invalid" : ""
                }`}
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {errors.cardNumber && (
                <div className="invalid-feedback">{errors.cardNumber}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="cardExpiry" className="form-label">
                تاريخ الانتهاء <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.cardExpiry ? "is-invalid" : ""
                }`}
                id="cardExpiry"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.cardExpiry && (
                <div className="invalid-feedback">{errors.cardExpiry}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="cardCvv" className="form-label">
                رمز CVV <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.cardCvv ? "is-invalid" : ""}`}
                id="cardCvv"
                name="cardCvv"
                value={formData.cardCvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
              />
              {errors.cardCvv && (
                <div className="invalid-feedback">{errors.cardCvv}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* إضافة هذا القسم الجديد لتفاصيل التحويل لانستاباي */}
      {formData.paymentMethod === "instapay" && (
        <div className="instapay-details mt-4 p-4 border rounded bg-light">
          <div className="text-center mb-4">
            <h5 className="text-primary">
              <i className="bi bi-info-circle me-2"></i>
              او فودافون كاش تعليمات الدفع عبر انستاباي
            </h5>
            <p className="text-muted">
              قم بالتحويل إلى الرقم التالي ثم أرفق صورة إيصال التحويل
            </p>
          </div>

          <div className="transfer-info text-center mb-4">
            <div className="transfer-number bg-white p-3 rounded shadow-sm d-inline-block me-3">
              <h3 className="text-success mb-0">
                <i className="bi bi-phone me-2"></i>
                01212121212
              </h3>
              <small className="text-muted">انستاباي</small>
            </div>

            <div className="transfer-number bg-white p-3 rounded shadow-sm d-inline-block">
              <h3 className="text-success mb-0">
                <i className="bi bi-phone me-2"></i>
                01010101010
              </h3>
              <small className="text-muted">رقم المحفظة</small>
            </div>
          </div>

          <div className="instructions mb-4" dir="rtl">
            <h6 className="text-end">خطوات الدفع:</h6>
            <ol className="list-steps" style={{ paddingRight: "20px" }}>
              <li>افتح تطبيق البنك أو المحفظة الإلكترونية</li>
              <li>
                قم بالتحويل إلى الرقم <strong>01212121212</strong>
              </li>
              <li>احفظ إيصال التحويل (Screenshot)</li>
              <li>أرفق صورة الإيصال من خلال الزر أدناه</li>
            </ol>
          </div>

          <div className="upload-receipt">
            <label htmlFor="receiptUpload" className="form-label">
              <i className="bi bi-cloud-upload me-2"></i>
              رفع صورة إيصال التحويل <span className="text-danger">*</span>
            </label>

            <div className="upload-container mb-3">
              {/* منطقة السحب والإفلات */}
              <div
                className="upload-drop-zone border rounded p-4 text-center"
                style={{
                  border: "2px dashed #dee2e6",
                  background: "#f8f9fa",
                  cursor: "pointer",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#0d6efd";
                  e.currentTarget.style.background = "#e7f1ff";
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = "#dee2e6";
                  e.currentTarget.style.background = "#f8f9fa";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#dee2e6";
                  e.currentTarget.style.background = "#f8f9fa";

                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    const file = files[0];
                    if (file.type.startsWith("image/")) {
                      // معالجة الملف هنا
                      console.log("File dropped:", file);
                      document.getElementById("receiptUpload").files = files;
                    }
                  }
                }}
                onClick={() => document.getElementById("receiptUpload").click()}
              >
                <i className="bi bi-cloud-arrow-up display-4 text-muted mb-3"></i>
                <h5 className="mb-2">اسحب وأفلت الملف هنا</h5>
                <p className="text-muted mb-3">أو انقر لاختيار الملف</p>
                <button className="btn btn-primary btn-sm">
                  <i className="bi bi-folder2-open me-2"></i>
                  اختر ملف
                </button>
              </div>

              {/* معاينة الصورة */}
              <div className="image-preview mt-3 d-none" id="imagePreview">
                <div className="preview-container p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">
                      <i className="bi bi-image me-2"></i>معاينة الصورة
                    </h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        document.getElementById("receiptUpload").value = "";
                        document
                          .getElementById("imagePreview")
                          .classList.add("d-none");
                        document.getElementById("previewImage").src = "";
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-trash3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>{" "}
                    </button>
                  </div>
                  <img
                    id="previewImage"
                    alt="معاينة"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    <small className="text-muted" id="fileName"></small>
                    <small className="text-muted" id="fileSize"></small>
                  </div>
                </div>
              </div>
            </div>

            {/* حقل الرفع المخفي */}
            <input
              type="file"
              className="form-control d-none"
              id="receiptUpload"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    alert("حجم الملف كبير جداً. الحد الأقصى 5MB");
                    e.target.value = "";
                    return;
                  }

                  if (!file.type.match("image.*")) {
                    alert("يرجى اختيار صورة فقط");
                    e.target.value = "";
                    return;
                  }

                  // عرض المعاينة
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    document.getElementById("previewImage").src =
                      e.target.result;
                    document
                      .getElementById("imagePreview")
                      .classList.remove("d-none");
                    document.getElementById("fileName").textContent = file.name;
                    document.getElementById(
                      "fileSize"
                    ).textContent = `الحجم: ${(file.size / 1024).toFixed(
                      2
                    )} KB`;
                  };
                  reader.readAsDataURL(file);

                  console.log("File selected:", file);
                  // يمكنك إضافة منطق رفع الملف هنا
                }
              }}
            />

            <div className="form-text text-muted">
              يمكنك رفع الصور بصيغة: JPG, PNG, GIF (الحجم الأقصى: 5MB)
            </div>
          </div>

          <div className="note-alert alert alert-warning mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>ملاحظة مهمة:</strong> لن يتم تأكيد طلبك حتى يتم التحقق من
            التحويل. يرجى التأكد من إرفاق صورة الإيصال بوضوح.
          </div>
        </div>
      )}

      <div className="order-summary-sm mt-4">
        <h6>ملخص الطلب:</h6>
        <div className="summary-row">
          <span>الإجمالي:</span>
          <strong>{finalTotal.toFixed(2)} جنيه</strong>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn-outline-secondary" onClick={handlePrevStep}>
          <i className="bi bi-arrow-right me-2"></i>
          العودة للمعلومات
        </button>
        <button
          className="btn btn-success"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              جاري معالجة الدفع...
            </>
          ) : (
            <>
              <i className="bi bi-lock-fill me-2"></i>
              تأكيد الدفع
            </>
          )}
        </button>
      </div>
    </div>
  );

  // STEP 4: COMPLETE
  const renderStep4 = () => (
    <div className="checkout-step text-center">
      <div className="success-animation">
        <div className="success-icon">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <div className="success-circle"></div>
      </div>

      <h4 className="mt-4">تم تأكيد طلبك بنجاح! 🎉</h4>
      <p className="text-muted">
        شكراً لك على ثقتك. تم استلام طلبك وسيتم تجهيزه قريباً.
      </p>

      <div className="order-details-card mt-4">
        <div className="order-number">
          <h6>رقم الطلب</h6>
          <p className="text-primary fw-bold">{formData.orderNumber}</p>
        </div>

        <div className="delivery-estimate">
          <i className="bi bi-truck"></i>
          <span>
            التوصيل المتوقع: <strong>2-3 أيام عمل</strong>
          </span>
        </div>

        <div className="order-total mt-3">
          <h6>الإجمالي المدفوع:</h6>
          <p className="display-6 fw-bold text-success">
            {finalTotal.toFixed(2)}
            <span className="currency"> EGP</span>
          </p>
        </div>
      </div>

      <div className="step-actions mt-4">
        <Link to="/shop" className="btn btn-outline-primary">
          <i className="bi bi-bag me-2"></i>
          مواصلة التسوق
        </Link>
        <button className="btn btn-primary" onClick={handleCompleteOrder}>
          <i className="bi bi-house me-2"></i>
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="checkout-container">
      {/* Checkout Header with Progress Steps */}
      <div className="checkout-header">
        <div className="container">
          <div className="checkout-title-section">
            <div className="checkout-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32" // تكبير من 16 إلى 32
                fill="currentColor"
                className="bi bi-cart-check-fill"
                viewBox="0 0 16 16"
                style={{ color: "white" }} // إضافة لون أبيض واضح
              >
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708" />
              </svg>
            </div>

            <div className="Complete the order">
              <h1>إتمام الطلب</h1>
              <p className="text-muted">أكمل عملية الشراء في 4 خطوات بسيطة</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="checkout-progress">
            <div className="progress-steps">
              {/* Step 1: Cart */}
              <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                <span className="step-number">1</span>
                <span className="step-label">السلة</span>
              </div>
              <div className="step-connector"></div>

              {/* Step 2: Information */}
              <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                <span className="step-number">2</span>
                <span className="step-label">المعلومات</span>
              </div>
              <div className="step-connector"></div>

              {/* Step 3: Payment */}
              <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span>
                <span className="step-label">الدفع</span>
              </div>
              <div className="step-connector"></div>

              {/* Step 4: Complete */}
              <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                <span className="step-number">4</span>
                <span className="step-label">التأكيد</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="checkout-form-container">
              {/* Render Current Step */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>
          </div>

          <div className="col-lg-4">
            {/* Order Summary Sidebar */}
            <div className="order-summary-sidebar">
              <h5 className="mb-3">ملخص الطلب</h5>

              <div className="order-items-preview">
                {cartItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item-preview">
                    <div className="preview-image">
                      <img
                        src={
                          item.product.images?.[0] || "/images/placeholder.jpg"
                        }
                        alt={item.product.title}
                      />
                    </div>
                    <div className="preview-info">
                      <h6>{item.product.title}</h6>
                      <p className="text-muted mb-1">الكمية: {item.quantity}</p>
                      <p className="price">
                        {(item.product.price * item.quantity).toFixed(2)}{" "}
                        <span className="currency">EGP</span>
                      </p>
                    </div>
                  </div>
                ))}

                {cartItems.length > 3 && (
                  <div className="more-items text-center">
                    <small>+ {cartItems.length - 3} عناصر أخرى</small>
                  </div>
                )}
              </div>

              <div className="order-totals mt-3">
                <div className="total-row">
                  <span>Items:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>
                    {totalAmount.toFixed(2)}{" "}
                    <span className="currency">EGP</span>
                  </span>
                </div>
                <div className="total-row">
                  <span>Tax (14%):</span>
                  <span>
                    {tax.toFixed(2)} <span className="currency">EGP</span>
                  </span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="total-row">
                  <span>Discount (10%):</span>
                  <span className="text-success">
                    -{discount.toFixed(2)} EGP
                  </span>
                </div>
                <hr />
                <div className="total-row final">
                  <span>Total Amount : </span>
                  <strong>
                    {finalTotal.toFixed(2)}{" "}
                    <span className="currency">EGP</span>
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

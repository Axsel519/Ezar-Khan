/** @format */

import React from "react";
import { Link } from "react-router-dom";

/**
 * مكون بطاقة المنتج - يعرض منتجاً واحداً
 * @param {Object} props - خصائص المكون
 * @param {Object} props.product - بيانات المنتج
 * @param {Function} props.onAdd - دالة إضافة المنتج للسلة (اختياري)
 * @returns {JSX.Element} عنصر بطاقة المنتج
 */
export default function ProductCard({ product, onAdd }) {
  // التحقق من وجود بيانات المنتج
  if (!product) return null;

  /**
   * معالجة مسار الصورة - إرجاع المسار كما هو
   * @param {string} imagePath - مسار الصورة
   * @returns {string} نفس المسار
   */
  const getImagePath = (imagePath) => imagePath;

  // الحصول على الصورة الرئيسية للمنتج
  const imageSource =
    product.images && product.images.length > 0
      ? getImagePath(product.images[0])
      : null;

  return (
    <div
      className="card shadow-sm border-0 h-100"
      style={{ width: "100%", maxWidth: "100%", minWidth: "0" }}
    >
      {/* رابط المنتج للصفحة التفصيلية */}
      <Link
        to={`/shop/${product.id}`}
        className="text-decoration-none text-dark h-100 d-block"
      >
        {/* حاوية صورة المنتج */}
        <div className="card-img-top-wrapper" style={{ height: "150px" }}>
          <img
            src={
              imageSource ||
              // صورة افتراضية في حالة عدم وجود صورة
              `https://placehold.co/400x300/e9ecef/495057?text=${encodeURIComponent(
                product.title.split(" ")[0]
              )}`
            }
            className="card-img-top object-fit-cover h-100 w-100"
            alt={product.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x300/e9ecef/495057?text=${encodeURIComponent(
                product.title.split(" ")[0]
              )}`;
            }}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* جسم البطاقة */}
        <div
          className="card-body d-flex flex-column"
          style={{ padding: "0.75rem" }}
        >
          {/* عنوان المنتج - محدود بسطرين */}
          <h6
            className="card-title fw-bold mb-1"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: "0.9rem",
              minHeight: "2.4em",
              lineHeight: "1.2",
            }}
            title={product.title}
          >
            {product.title}
          </h6>

          {/* وصف المنتج - محدود بسطر واحد */}
          <p
            className="card-text text-muted small mb-2"
            style={{
              fontSize: "0.75rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              direction: "rtl",
              textAlign: "right",
              margin: 0,
              minHeight: "1.2em",
            }}
            title={product.description}
          >
            {product.description || "لا يوجد وصف متاح"}
          </p>

          {/* قسم السعر والتقييم */}
          <div className="d-flex justify-content-between align-items-center mt-auto">
            {/* السعر */}
            <div className="d-flex flex-column">
              <span
                className="fw-bold text-primary"
                style={{ fontSize: "1rem" }}
              >
                {product.price.toFixed(2)} <span className="currency">EGP</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

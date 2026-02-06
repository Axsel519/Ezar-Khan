/** @format */

import React from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, subtitle, products, onAdd }) {
  // التحقق من وجود منتجات
  if (!products || products.length === 0) {
    return (
      <section className="product-section">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-1 text-muted"></i>
          <p className="mt-3 text-muted">No products available</p>
          <p className="text-muted small">Please make sure the backend server is running</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-section">
      {/* العنوان والوصف */}
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>

      {/* شبكة المنتجات المعدلة */}
      <div className="container">
        <div className="row justify-content-center">
          {products.map((product) => (
            <div
              key={product.id || product._id}
              className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <ProductCard product={product} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

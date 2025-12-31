/** @format */

import React from "react";
import ProductCard from "./ProductCard";

// تم إزالة chunkSize لأننا سنستخدم Grid ثابت ليعرض المنتجات
export default function ProductGrid({ products, onAdd }) {
  return (
    // استخدام تخطيط شبكي (Grid) لعرض المنتجات
    <div
      className="grid 
                 grid-cols-1          /* عمود واحد على الشاشات الصغيرة جدًا */
                 sm:grid-cols-2       /* عمودان على الشاشات الصغيرة */
                 lg:grid-cols-4       /* أربعة أعمدة على الشاشات الكبيرة (لتحقيق المطلوب) */
                 gap-6                /* مسافة بين الكروت */
                 justify-items-center /* لتوسيط الكروت داخل الأعمدة */
                 py-4"
    >
      {/* عرض كل المنتجات مباشرة داخل الشبكة */}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}

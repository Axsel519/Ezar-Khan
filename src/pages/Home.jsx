/** @format */

import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import { products } from "../data/products";

export default function Home({ onAdd }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  /**
   * دالة لاختيار 4 منتجات عشوائية فقط
   */
  const getRandomProducts = (productsList, count) => {
    if (!productsList || productsList.length === 0) return [];

    // نسخ المصفوفة لتجنب تعديل المصفوفة الأصلية
    const productsCopy = [...productsList];
    const selectedProducts = [];

    // اختيار 4 منتجات عشوائية
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * productsCopy.length);
      selectedProducts.push(productsCopy[randomIndex]);
      productsCopy.splice(randomIndex, 1);
    }

    return selectedProducts;
  };

  // اختيار 4 منتجات فقط عند تحميل المكون
  useEffect(() => {
    const randomFeatured = getRandomProducts(products, 4);
    setFeaturedProducts(randomFeatured);
  }, []);

  return (
    <div>
      {/* قسم Hero الرئيسي */}
      <Hero />

      {/* قسم المنتجات المميزة - 4 منتجات فقط */}
      <ProductSection
        title="Featured Products"
        subtitle="Our most popular kitchen essentials"
        products={featuredProducts}
      />
    </div>
  );
}

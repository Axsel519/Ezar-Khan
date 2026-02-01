/** @format */

import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import { productsAPI } from "../services/api";

export default function Home({ onAdd }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * دالة لاختيار 4 منتجات عشوائية فقط
   */
  const getRandomProducts = (productsList, count) => {
    if (!productsList || productsList.length === 0) return [];

    // نسخ المصفوفة لتجنب تعديل المصفوفة الأصلية
    const productsCopy = [...productsList];
    const selectedProducts = [];

    // اختيار 4 منتجات عشوائية
    for (let i = 0; i < Math.min(count, productsCopy.length); i++) {
      const randomIndex = Math.floor(Math.random() * productsCopy.length);
      selectedProducts.push(productsCopy[randomIndex]);
      productsCopy.splice(randomIndex, 1);
    }

    return selectedProducts;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        
        // Ensure we always get an array
        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data && Array.isArray(data.data)) {
          productsArray = data.data;
        }
        
        console.log('Fetched products for home:', productsArray);
        const randomFeatured = getRandomProducts(productsArray, 4);
        setFeaturedProducts(randomFeatured);
      } catch (error) {
        console.error("Error fetching products:", error);
        setFeaturedProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

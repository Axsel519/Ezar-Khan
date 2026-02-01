/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";

export default function Shop({ onAdd, getQuantity, searchQuery }) {
  const [category, setCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  // استخدام searchQuery من الـ Header
  const q = searchQuery?.trim() || "";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll({
          page: currentPage,
          limit: itemsPerPage,
          search: q || undefined,
          category: category !== "All Products" ? category : undefined,
          sortBy: sortBy !== "default" ? sortBy : undefined
        });
        
        // Handle different response structures
        let productsArray = [];
        let total = 0;
        
        if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
          total = data.total || data.totalProducts || productsArray.length;
        } else if (data.data && Array.isArray(data.data)) {
          productsArray = data.data;
          total = data.total || data.totalProducts || productsArray.length;
        } else if (Array.isArray(data)) {
          productsArray = data;
          total = productsArray.length;
        }
        
        console.log('Fetched products:', productsArray);
        setProducts(productsArray);
        setFilteredProducts(productsArray);
        setTotalProducts(total);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products from server. Please make sure the backend is running.");
        setProducts([]);
        setFilteredProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage, q, category, sortBy]);

  // إنشاء قائمة الفئات
  const categories = React.useMemo(() => {
    // For now, use static categories or fetch from backend
    return ["All Products", "Kitchen Tools", "Utensils", "Appliances", "Storage"];
  }, []);

  // فلترة وترتيب المنتجات - now handled by backend
  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [q, category, sortBy]);

  // دالة إضافة للسلة مع تأثير
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    // تأثير زر الإضافة
    const button = e.currentTarget;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-circle-fill"></i> Added!';
    button.classList.add("btn-success");
    button.classList.remove("btn-primary");

    onAdd(product, (getQuantity(product.id) || 0) + 1);

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove("btn-success");
      button.classList.add("btn-primary");
    }, 1500);
  };

  return (
    <div className="shop-page">
      {/* Hero Section */}
      <div className="shop-hero py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Discover Premium <span className="text-primary">Kitchen</span>{" "}
                Essentials
              </h1>
              <p className="lead mb-4">
                Explore our curated collection of high-quality kitchen tools,
                utensils, and appliances designed to elevate your cooking
                experience.
              </p>
              <div className="d-flex gap-3">
                <div className="stat-box">
                  <div className="stat-number">{totalProducts || 0}+</div>
                  <div className="stat-label">Products</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{Math.max(0, categories.length - 1)}</div>
                  <div className="stat-label">Categories</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">4.8★</div>
                  <div className="stat-label">Avg. Rating</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="floating-card card-1">
                  <i className="bi bi-truck"></i>
                  <span>Free Shopping</span>
                </div>
                <div className="floating-card card-2">
                  <i className="bi bi-shield-check"></i>
                  <span>Fast Delivery</span>
                </div>
                <div className="floating-card card-3">
                  <i className="bi bi-arrow-clockwise"></i>
                  <span>14-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section mb-5">
        <div className="container">
          <div className="filter-card p-4 rounded-4 shadow-sm">
            <div className="row g-3 align-items-center">
              {/* Search Results */}
              <div className="col-lg-4">
                <div className="search-results">
                  <i className="bi bi-search me-2"></i>
                  {q ? (
                    <span>
                      Showing <strong>{filteredProducts?.length || 0}</strong> results
                      for "{q}"
                    </span>
                  ) : (
                    <span>Browse all {totalProducts || 0} products</span>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="col-lg-3">
                <div className="filter-group">
                  <label className="filter-label">
                    <i className="bi bi-grid me-2"></i>Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select filter-select"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="col-lg-3">
                <div className="filter-group">
                  <label className="filter-label">
                    <i className="bi bi-sort-down me-2"></i>Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select filter-select"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters */}
              <div className="col-lg-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setCategory("All Products");
                    setSortBy("default");
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <div className="container">
          {loading && products.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading products...</p>
            </div>
          ) : error && products.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="bi bi-exclamation-triangle display-1 text-danger mb-4"></i>
              <h3 className="mb-3">Cannot Connect to Server</h3>
              <p className="text-muted mb-4">{error}</p>
              <div className="d-flex gap-3 justify-content-center">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Retry
                </button>
                <a
                  href="http://localhost:3000/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-server me-2"></i>
                  Check Backend
                </a>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-4"></i>
              <h3 className="mb-3">No products found</h3>
              <p className="text-muted mb-4">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCategory("All Products");
                  setSortBy("default");
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                {filteredProducts.map((product) => {
                  const currentQty = getQuantity(product.id || product._id) || 0;
                  const mainImage =
                    product.images?.[0] || "/images/placeholder.jpg";
                  const productTitle = product.name || product.title;

                  return (
                    <div key={product.id || product._id} className="col">
                      <div className="card product-card h-100 shadow-sm border-0 position-relative">
                        {/* Link حول الصورة والتفاصيل فقط */}
                        <Link
                          to={`/shop/${product.id || product._id}`}
                          className="text-decoration-none text-dark"
                          style={{ display: "contents" }}
                        >
                          {/* Card Image */}
                          <div
                            className="position-relative"
                            style={{ height: "180px", overflow: "hidden" }}
                          >
                            <img
                              src={mainImage}
                              className="card-img-top w-100 h-100 object-fit-contain p-3"
                              alt={productTitle}
                              style={{
                                backgroundColor: "#f8f9fa",
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%236c757d' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(
                                  productTitle
                                )}%3C/text%3E%3C/svg%3E`;
                              }}
                            />

                            {/* Quick View Overlay */}
                            <div className="card-img-overlay d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-opacity">
                              <div className="btn btn-outline-light btn-sm rounded-pill">
                                <i className="bi bi-eye me-1"></i>
                                Quick View
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="card-body d-flex flex-column p-3">
                            {/* Product Title - محاذاة لليمين فقط */}
                            <h5
                              className="card-title mb-2"
                              style={{ textAlign: "right", fontSize: "0.9rem" }}
                            >
                              {productTitle}
                            </h5>

                            {/* Product Description - سطر واحد ومحاذاة لليمين فقط */}
                            <p
                              className="card-text text-muted flex-grow-1 mb-2"
                              style={{
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textAlign: "right",
                                direction: "rtl",
                                unicodeBidi: "plaintext",
                              }}
                            >
                              {product.description}
                            </p>

                            {/* Price and Actions */}
                            <div className="mt-auto">
                              {/* Price - كما كانت من قبل (من اليسار) */}
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h4
                                  className="text-primary fw-bold mb-0"
                                  style={{ fontSize: "1rem" }}
                                >
                                  {product.price.toFixed(2)}{" "}
                                  <span className="currency">EGP</span>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* أزرار الإضافة والكمية خارج الـ Link - كما كانت من قبل */}
                        <div
                          className="card-footer bg-transparent border-0 p-3 pt-0"
                          style={{ position: "relative", zIndex: 2 }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            {currentQty > 0 ? (
                              <div className="d-flex align-items-center justify-content-center gap-2 w-100">
                                <button
                                  className="btn btn-link p-0 qty-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onAdd(product, currentQty - 1);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    className="bi bi-dash-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                  </svg>
                                </button>

                                <span className="fw-bold-number">
                                  {currentQty}
                                </span>

                                <button
                                  className="btn btn-link p-0 qty-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onAdd(product, currentQty + 1);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    className="bi bi-plus-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary flex-grow-1"
                                onClick={(e) => handleAddToCart(product, e)}
                                style={{
                                  fontSize: "0.85rem",
                                  padding: "0.4rem 0.5rem",
                                }}
                              >
                                <i className="bi bi-cart-plus me-1"></i>
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Products Count */}
              <div className="products-count mt-4 pt-3 border-top">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <p className="mb-0 text-muted">
                      Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalProducts)}</strong> of{" "}
                      <strong>{totalProducts}</strong> products
                    </p>
                  </div>
                  <div className="col-md-6">
                    {/* Pagination Controls */}
                    {totalProducts > itemsPerPage && (
                      <nav aria-label="Product pagination">
                        <ul className="pagination justify-content-md-end justify-content-center mb-0">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => {
                                setCurrentPage(currentPage - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              disabled={currentPage === 1}
                            >
                              <i className="bi bi-chevron-left"></i> Previous
                            </button>
                          </li>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.ceil(totalProducts / itemsPerPage) }, (_, i) => i + 1)
                            .filter(page => {
                              const totalPages = Math.ceil(totalProducts / itemsPerPage);
                              // Show first page, last page, current page, and pages around current
                              return page === 1 || 
                                     page === totalPages || 
                                     (page >= currentPage - 1 && page <= currentPage + 1);
                            })
                            .map((page, index, array) => {
                              // Add ellipsis if there's a gap
                              const prevPage = array[index - 1];
                              const showEllipsis = prevPage && page - prevPage > 1;
                              
                              return (
                                <React.Fragment key={page}>
                                  {showEllipsis && (
                                    <li className="page-item disabled">
                                      <span className="page-link">...</span>
                                    </li>
                                  )}
                                  <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button 
                                      className="page-link" 
                                      onClick={() => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                    >
                                      {page}
                                    </button>
                                  </li>
                                </React.Fragment>
                              );
                            })}
                          
                          <li className={`page-item ${currentPage === Math.ceil(totalProducts / itemsPerPage) ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => {
                                setCurrentPage(currentPage + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              disabled={currentPage === Math.ceil(totalProducts / itemsPerPage)}
                            >
                              Next <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

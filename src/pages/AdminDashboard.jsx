/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { productsAPI, ordersAPI, uploadsAPI } from "../services/api";

export default function AdminDashboard() {
  const { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);

  // Order expansion state
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Check admin access - log for debugging
  useEffect(() => {
    console.log("Admin Check:", {
      isLoggedIn,
      currentUser,
      role: currentUser?.role,
      isAdmin: currentUser?.role === "ADMIN",
    });
  }, [isLoggedIn, currentUser]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, currentPage]); // Re-fetch when page changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
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

      setProducts(productsArray);
      setTotalProducts(total);
    } catch (err) {
      setError("Failed to fetch products");
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();

      // Ensure we always set an array
      let ordersArray = [];
      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (data && Array.isArray(data.orders)) {
        ordersArray = data.orders;
      } else if (data && Array.isArray(data.data)) {
        ordersArray = data.data;
      }

      setOrders(ordersArray);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingProduct) {
        await productsAPI.update(
          editingProduct.id || editingProduct._id,
          productForm,
        );
        setSuccess("Product updated successfully!");
      } else {
        await productsAPI.create(productForm);
        setSuccess("Product created successfully!");
      }

      resetProductForm();
      setCurrentPage(1); // Reset to first page after adding/updating
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setLoading(true);
      await productsAPI.delete(id);
      setSuccess("Product deleted successfully!");
      setCurrentPage(1); // Reset to first page after deleting
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || product.title,
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      images: product.images || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      images: [],
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const indexOfFirstProduct = (currentPage - 1) * itemsPerPage;
  const indexOfLastProduct = Math.min(
    indexOfFirstProduct + itemsPerPage,
    totalProducts,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <nav aria-label="Products pagination">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await ordersAPI.updateStatus(orderId, newStatus);
      setSuccess("Order status updated successfully!");
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setLoading(true);
      const uploadedImages = await uploadsAPI.uploadMultiple(files);
      const imageUrls = uploadedImages.map((img) => img.url || img.path);

      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      setSuccess("Images uploaded successfully!");
    } catch (err) {
      setError("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (!isLoggedIn || currentUser?.role?.toUpperCase() !== "ADMIN") {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <i className="bi bi-shield-lock display-1 text-danger mb-4"></i>
                <h2 className="mb-3">Access Denied</h2>
                <p className="text-muted mb-4">
                  You need administrator privileges to access this page.
                </p>

                <div className="alert alert-info text-start">
                  <strong>Debug Info:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Logged In: {isLoggedIn ? "✅ Yes" : "❌ No"}</li>
                    <li>User Email: {currentUser?.email || "N/A"}</li>
                    <li>User Role: {currentUser?.role || "❌ Missing"}</li>
                    <li>Required Role: ADMIN</li>
                  </ul>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    <i className="bi bi-house me-2"></i>
                    Go to Home
                  </button>
                  {!isLoggedIn && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/login")}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <small className="text-muted">
                    If you should have admin access, please check the console
                    (F12) for more details.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-0">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Admin Dashboard
                </h1>
                <p className="text-muted mb-0">
                  Welcome back, {currentUser?.name}
                </p>
              </div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Store
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}
        {success && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-check-circle me-2"></i>
            {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess(null)}
            ></button>
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <i className="bi bi-box-seam me-2"></i>
              Products
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="bi bi-cart-check me-2"></i>
              Orders
            </button>
          </li>
        </ul>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="row">
            {/* Product Form */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-plus-circle me-2"></i>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleProductSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          })
                        }
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Price (EGP)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Images</label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <div className="mt-2">
                        {productForm.images.map((img, index) => (
                          <div
                            key={index}
                            className="d-inline-block position-relative me-2 mb-2"
                          >
                            <img
                              src={img}
                              alt=""
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                              className="rounded"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              style={{ padding: "2px 6px", fontSize: "10px" }}
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ?
                          "Saving..."
                        : editingProduct ?
                          "Update Product"
                        : "Add Product"}
                      </button>
                      {editingProduct && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetProductForm}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Products List ({totalProducts})
                  </h5>
                  <div className="d-flex align-items-center gap-3">
                    <small className="text-muted">
                      Page {currentPage} of {totalPages} | Showing{" "}
                      {indexOfFirstProduct + 1}-
                      {Math.min(indexOfLastProduct, totalProducts)} of{" "}
                      {totalProducts}
                    </small>
                  </div>
                </div>
                <div className="card-body">
                  {loading ?
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  : !Array.isArray(products) || products.length === 0 ?
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-1"></i>
                      <p className="mt-3">No products found</p>
                    </div>
                  : <>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Category</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id || product._id}>
                                <td>
                                  <img
                                    src={
                                      product.images?.[0] ||
                                      "/images/placeholder.jpg"
                                    }
                                    alt={product.name || product.title}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                    }}
                                    className="rounded"
                                  />
                                </td>
                                <td>{product.name || product.title}</td>
                                <td>{product.price} EGP</td>
                                <td>{product.stock || 0}</td>
                                <td>
                                  <span className="badge bg-secondary">
                                    {product.category}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-pencil-square"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product.id || product._id,
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-trash"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="mt-4">{renderPagination()}</div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-cart-check me-2"></i>
                    Orders List ({Array.isArray(orders) ? orders.length : 0})
                  </h5>
                </div>
                <div className="card-body">
                  {loading ?
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  : !Array.isArray(orders) || orders.length === 0 ?
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-1"></i>
                      <p className="mt-3">No orders found</p>
                    </div>
                  : <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}></th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => {
                            const orderId = order.id || order._id;
                            const isExpanded = expandedOrders.has(orderId);

                            return (
                              <React.Fragment key={orderId}>
                                <tr
                                  onClick={() => toggleOrderExpansion(orderId)}
                                  style={{ cursor: "pointer" }}
                                  className="order-row"
                                >
                                  <td>
                                    <i
                                      className={`bi bi-chevron-${
                                        isExpanded ? "down" : "right"
                                      }`}
                                    ></i>
                                  </td>
                                  <td>
                                    <code
                                      className="text-primary"
                                      style={{ fontSize: "0.85rem" }}
                                    >
                                      {orderId.substring(0, 8)}...
                                    </code>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="fw-semibold">
                                        {order.userId?.firstName}{" "}
                                        {order.userId?.lastName}
                                      </div>
                                      <small className="text-muted">
                                        {order.userId?.email}
                                      </small>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge bg-secondary">
                                      {order.items?.length || 0} items
                                    </span>
                                  </td>
                                  <td className="fw-bold">
                                    {order.totalAmount?.toFixed(2) || 0} EGP
                                  </td>
                                  <td>
                                    <span
                                      className={`badge bg-${
                                        (
                                          order.status?.toLowerCase() ===
                                          "delivered"
                                        ) ?
                                          "success"
                                        : (
                                          order.status?.toLowerCase() ===
                                          "shipped"
                                        ) ?
                                          "info"
                                        : (
                                          order.status?.toLowerCase() ===
                                          "processing"
                                        ) ?
                                          "warning"
                                        : (
                                          order.status?.toLowerCase() ===
                                          "cancelled"
                                        ) ?
                                          "danger"
                                        : "secondary"
                                      }`}
                                    >
                                      {order.status?.toUpperCase() || "PENDING"}
                                    </span>
                                  </td>
                                  <td>
                                    <small>
                                      {new Date(
                                        order.createdAt,
                                      ).toLocaleDateString()}
                                    </small>
                                  </td>
                                  <td onClick={(e) => e.stopPropagation()}>
                                    <select
                                      className="form-select form-select-sm"
                                      value={
                                        order.status?.toLowerCase() || "pending"
                                      }
                                      onChange={(e) =>
                                        handleOrderStatusUpdate(
                                          orderId,
                                          e.target.value,
                                        )
                                      }
                                      style={{ minWidth: "130px" }}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="processing">
                                        Processing
                                      </option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">
                                        Delivered
                                      </option>
                                      <option value="cancelled">
                                        Cancelled
                                      </option>
                                    </select>
                                  </td>
                                </tr>

                                {/* Expanded Order Details */}
                                {isExpanded && (
                                  <tr>
                                    <td colSpan="8" className="bg-light">
                                      <div className="p-3">
                                        <div className="row">
                                          {/* Order Items */}
                                          <div className="col-md-7">
                                            <h6 className="mb-3">
                                              <i className="bi bi-box-seam me-2"></i>
                                              Order Items
                                            </h6>
                                            <div className="table-responsive">
                                              <table className="table table-sm table-bordered bg-white">
                                                <thead className="table-light">
                                                  <tr>
                                                    <th>Product</th>
                                                    <th className="text-center">
                                                      Quantity
                                                    </th>
                                                    <th className="text-end">
                                                      Price
                                                    </th>
                                                    <th className="text-end">
                                                      Subtotal
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {order.items?.map(
                                                    (item, index) => (
                                                      <tr key={index}>
                                                        <td>
                                                          <div className="d-flex align-items-center">
                                                            <i className="bi bi-box text-muted me-2"></i>
                                                            <span>
                                                              {item.productName ||
                                                                "Unknown Product"}
                                                            </span>
                                                          </div>
                                                        </td>
                                                        <td className="text-center">
                                                          <span className="badge bg-primary">
                                                            {item.quantity}
                                                          </span>
                                                        </td>
                                                        <td className="text-end">
                                                          {item.price?.toFixed(
                                                            2,
                                                          )}{" "}
                                                          EGP
                                                        </td>
                                                        <td className="text-end fw-bold">
                                                          {(
                                                            item.price *
                                                            item.quantity
                                                          ).toFixed(2)}{" "}
                                                          EGP
                                                        </td>
                                                      </tr>
                                                    ),
                                                  )}
                                                  <tr className="table-light">
                                                    <td
                                                      colSpan="3"
                                                      className="text-end fw-bold"
                                                    >
                                                      Total:
                                                    </td>
                                                    <td className="text-end fw-bold text-primary">
                                                      {order.totalAmount?.toFixed(
                                                        2,
                                                      )}{" "}
                                                      EGP
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>

                                          {/* Shipping & Payment Info */}
                                          <div className="col-md-5">
                                            <h6 className="mb-3">
                                              <i className="bi bi-info-circle me-2"></i>
                                              Order Details
                                            </h6>
                                            <div className="card">
                                              <div className="card-body">
                                                <div className="mb-3">
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    Shipping Address
                                                  </small>
                                                  <div>
                                                    {order.shippingAddress ||
                                                      "N/A"}
                                                  </div>
                                                </div>

                                                <div className="mb-3">
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-telephone me-1"></i>
                                                    Phone
                                                  </small>
                                                  <div>
                                                    {order.phone || "N/A"}
                                                  </div>
                                                </div>

                                                <div className="mb-3">
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-credit-card me-1"></i>
                                                    Payment Method
                                                  </small>
                                                  <div className="text-capitalize">
                                                    {order.paymentMethod?.replace(
                                                      "-",
                                                      " ",
                                                    ) || "N/A"}
                                                  </div>
                                                </div>

                                                <div>
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-calendar me-1"></i>
                                                    Order Date
                                                  </small>
                                                  <div>
                                                    {new Date(
                                                      order.createdAt,
                                                    ).toLocaleString()}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

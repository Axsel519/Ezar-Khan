/** @format */

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { productsAPI, ordersAPI, uploadsAPI } from "../services/api";
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { productsAPI, ordersAPI, uploadsAPI } from '../services/api';
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c

export default function AdminDashboard() {
  const { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD

  const [activeTab, setActiveTab] = useState("products");
=======
  
  const [activeTab, setActiveTab] = useState('products');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
<<<<<<< HEAD

=======
  
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);
<<<<<<< HEAD

=======
  
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
  // Order expansion state
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Product form state
  const [productForm, setProductForm] = useState({
<<<<<<< HEAD
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
=======
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Check admin access - log for debugging
  useEffect(() => {
<<<<<<< HEAD
    console.log("Admin Check:", {
      isLoggedIn,
      currentUser,
      role: currentUser?.role,
      isAdmin: currentUser?.role === "ADMIN",
=======
    console.log('Admin Check:', {
      isLoggedIn,
      currentUser,
      role: currentUser?.role,
      isAdmin: currentUser?.role === 'ADMIN'
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
    });
  }, [isLoggedIn, currentUser]);

  // Fetch data based on active tab
  useEffect(() => {
<<<<<<< HEAD
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "orders") {
=======
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
      fetchOrders();
    }
  }, [activeTab, currentPage]); // Re-fetch when page changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll({
        page: currentPage,
<<<<<<< HEAD
        limit: itemsPerPage,
      });

      // Handle different response structures
      let productsArray = [];
      let total = 0;

=======
        limit: itemsPerPage
      });
      
      // Handle different response structures
      let productsArray = [];
      let total = 0;
      
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD

      setProducts(productsArray);
      setTotalProducts(total);
    } catch (err) {
      setError("Failed to fetch products");
=======
      
      setProducts(productsArray);
      setTotalProducts(total);
    } catch (err) {
      setError('Failed to fetch products');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD

=======
      
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
      // Ensure we always set an array
      let ordersArray = [];
      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (data && Array.isArray(data.orders)) {
        ordersArray = data.orders;
      } else if (data && Array.isArray(data.data)) {
        ordersArray = data.data;
      }
<<<<<<< HEAD

      setOrders(ordersArray);
    } catch (err) {
      setError("Failed to fetch orders");
=======
      
      setOrders(ordersArray);
    } catch (err) {
      setError('Failed to fetch orders');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
        await productsAPI.update(
          editingProduct.id || editingProduct._id,
          productForm,
        );
        setSuccess("Product updated successfully!");
      } else {
        await productsAPI.create(productForm);
        setSuccess("Product created successfully!");
      }

=======
        await productsAPI.update(editingProduct.id || editingProduct._id, productForm);
        setSuccess('Product updated successfully!');
      } else {
        await productsAPI.create(productForm);
        setSuccess('Product created successfully!');
      }
      
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
      resetProductForm();
      setCurrentPage(1); // Reset to first page after adding/updating
      fetchProducts();
    } catch (err) {
<<<<<<< HEAD
      setError(err.response?.data?.message || "Failed to save product");
=======
      setError(err.response?.data?.message || 'Failed to save product');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
<<<<<<< HEAD
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
=======
    if (!window.confirm('Are you sure you want to delete this product?')) return;
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c

    try {
      setLoading(true);
      await productsAPI.delete(id);
<<<<<<< HEAD
      setSuccess("Product deleted successfully!");
      setCurrentPage(1); // Reset to first page after deleting
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
=======
      setSuccess('Product deleted successfully!');
      setCurrentPage(1); // Reset to first page after deleting
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || product.title,
<<<<<<< HEAD
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      images: product.images || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
=======
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      images: product.images || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
<<<<<<< HEAD
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
=======
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
      images: [],
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const indexOfFirstProduct = (currentPage - 1) * itemsPerPage;
<<<<<<< HEAD
  const indexOfLastProduct = Math.min(
    indexOfFirstProduct + itemsPerPage,
    totalProducts,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
=======
  const indexOfLastProduct = Math.min(indexOfFirstProduct + itemsPerPage, totalProducts);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
=======
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
<<<<<<< HEAD
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
=======
                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

<<<<<<< HEAD
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
=======
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                <button
                  className="page-link"
                  onClick={() => handlePageChange(totalPages)}
                >
=======
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                  {totalPages}
                </button>
              </li>
            </>
          )}

<<<<<<< HEAD
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
=======
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
      setSuccess("Order status updated successfully!");
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status");
=======
      setSuccess('Order status updated successfully!');
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
<<<<<<< HEAD
    setExpandedOrders((prev) => {
=======
    setExpandedOrders(prev => {
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
      const imageUrls = uploadedImages.map((img) => img.url || img.path);

      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      setSuccess("Images uploaded successfully!");
    } catch (err) {
      setError("Failed to upload images");
=======
      const imageUrls = uploadedImages.map(img => img.url || img.path);
      
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      setSuccess('Images uploaded successfully!');
    } catch (err) {
      setError('Failed to upload images');
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
<<<<<<< HEAD
    setProductForm((prev) => ({
=======
    setProductForm(prev => ({
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

<<<<<<< HEAD
  if (!isLoggedIn || currentUser?.role?.toUpperCase() !== "ADMIN") {
=======
  if (!isLoggedIn || currentUser?.role?.toUpperCase() !== 'ADMIN') {
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD

                <div className="alert alert-info text-start">
                  <strong>Debug Info:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Logged In: {isLoggedIn ? "✅ Yes" : "❌ No"}</li>
                    <li>User Email: {currentUser?.email || "N/A"}</li>
                    <li>User Role: {currentUser?.role || "❌ Missing"}</li>
=======
                
                <div className="alert alert-info text-start">
                  <strong>Debug Info:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Logged In: {isLoggedIn ? '✅ Yes' : '❌ No'}</li>
                    <li>User Email: {currentUser?.email || 'N/A'}</li>
                    <li>User Role: {currentUser?.role || '❌ Missing'}</li>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                    <li>Required Role: ADMIN</li>
                  </ul>
                </div>

                <div className="d-grid gap-2">
<<<<<<< HEAD
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
=======
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                  >
                    <i className="bi bi-house me-2"></i>
                    Go to Home
                  </button>
                  {!isLoggedIn && (
<<<<<<< HEAD
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/login")}
=======
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/login')}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <small className="text-muted">
<<<<<<< HEAD
                    If you should have admin access, please check the console
                    (F12) for more details.
=======
                    If you should have admin access, please check the console (F12) for more details.
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                <p className="text-muted mb-0">
                  Welcome back, {currentUser?.name}
                </p>
              </div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/")}
=======
                <p className="text-muted mb-0">Welcome back, {currentUser?.name}</p>
              </div>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/')}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Store
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
<<<<<<< HEAD
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
=======
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
<<<<<<< HEAD
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
=======
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
            >
              <i className="bi bi-box-seam me-2"></i>
              Products
            </button>
          </li>
          <li className="nav-item">
            <button
<<<<<<< HEAD
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
=======
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
            >
              <i className="bi bi-cart-check me-2"></i>
              Orders
            </button>
          </li>
        </ul>

        {/* Products Tab */}
<<<<<<< HEAD
        {activeTab === "products" && (
=======
        {activeTab === 'products' && (
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
          <div className="row">
            {/* Product Form */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-plus-circle me-2"></i>
<<<<<<< HEAD
                    {editingProduct ? "Edit Product" : "Add New Product"}
=======
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
=======
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={productForm.description}
<<<<<<< HEAD
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          })
                        }
=======
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
=======
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.stock}
<<<<<<< HEAD
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
=======
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.category}
<<<<<<< HEAD
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                          })
                        }
=======
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
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
=======
                          <div key={index} className="d-inline-block position-relative me-2 mb-2">
                            <img src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              style={{ padding: '2px 6px', fontSize: '10px' }}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
<<<<<<< HEAD
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
=======
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      {editingProduct && (
                        <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                      Page {currentPage} of {totalPages} | Showing{" "}
                      {indexOfFirstProduct + 1}-
                      {Math.min(indexOfLastProduct, totalProducts)} of{" "}
                      {totalProducts}
=======
                      Page {currentPage} of {totalPages} | Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                    </small>
                  </div>
                </div>
                <div className="card-body">
<<<<<<< HEAD
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
=======
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : !Array.isArray(products) || products.length === 0 ? (
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-1"></i>
                      <p className="mt-3">No products found</p>
                    </div>
<<<<<<< HEAD
                  : <>
=======
                  ) : (
                    <>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
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
=======
                                    src={product.images?.[0] || '/images/placeholder.jpg'}
                                    alt={product.name || product.title}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                    className="rounded"
                                  />
                                </td>
                                <td>{product.name || product.title}</td>
                                <td>{product.price} EGP</td>
                                <td>{product.stock || 0}</td>
<<<<<<< HEAD
                                <td>
                                  <span className="badge bg-secondary">
                                    {product.category}
                                  </span>
                                </td>
=======
                                <td><span className="badge bg-secondary">{product.category}</span></td>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditProduct(product)}
                                  >
<<<<<<< HEAD
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      class="bi bi-pencil-square"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                      <path
                                        fill-rule="evenodd"
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
                                      class="bi bi-trash"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
=======
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteProduct(product.id || product._id)}
                                  >
                                    <i className="bi bi-trash"></i>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
<<<<<<< HEAD

                      {/* Pagination */}
                      <div className="mt-4">{renderPagination()}</div>
                    </>
                  }
=======
                      
                      {/* Pagination */}
                      <div className="mt-4">
                        {renderPagination()}
                      </div>
                    </>
                  )}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
<<<<<<< HEAD
        {activeTab === "orders" && (
=======
        {activeTab === 'orders' && (
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
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
=======
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : !Array.isArray(orders) || orders.length === 0 ? (
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-1"></i>
                      <p className="mt-3">No orders found</p>
                    </div>
<<<<<<< HEAD
                  : <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}></th>
=======
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}></th>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD

                            return (
                              <React.Fragment key={orderId}>
                                <tr
                                  onClick={() => toggleOrderExpansion(orderId)}
                                  style={{ cursor: "pointer" }}
                                  className="order-row"
                                >
                                  <td>
                                    <i
                                      className={`bi bi-chevron-${isExpanded ? "down" : "right"}`}
                                    ></i>
                                  </td>
                                  <td>
                                    <code
                                      className="text-primary"
                                      style={{ fontSize: "0.85rem" }}
                                    >
=======
                            
                            return (
                              <React.Fragment key={orderId}>
                                <tr 
                                  onClick={() => toggleOrderExpansion(orderId)}
                                  style={{ cursor: 'pointer' }}
                                  className="order-row"
                                >
                                  <td>
                                    <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                                  </td>
                                  <td>
                                    <code className="text-primary" style={{ fontSize: '0.85rem' }}>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                      {orderId.substring(0, 8)}...
                                    </code>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="fw-semibold">
<<<<<<< HEAD
                                        {order.userId?.firstName}{" "}
                                        {order.userId?.lastName}
                                      </div>
                                      <small className="text-muted">
                                        {order.userId?.email}
                                      </small>
=======
                                        {order.userId?.firstName} {order.userId?.lastName}
                                      </div>
                                      <small className="text-muted">{order.userId?.email}</small>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge bg-secondary">
                                      {order.items?.length || 0} items
                                    </span>
                                  </td>
<<<<<<< HEAD
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
=======
                                  <td className="fw-bold">{order.totalAmount?.toFixed(2) || 0} EGP</td>
                                  <td>
                                    <span className={`badge bg-${
                                      order.status?.toLowerCase() === 'delivered' ? 'success' :
                                      order.status?.toLowerCase() === 'shipped' ? 'info' :
                                      order.status?.toLowerCase() === 'processing' ? 'warning' :
                                      order.status?.toLowerCase() === 'cancelled' ? 'danger' :
                                      'secondary'
                                    }`}>
                                      {order.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                  </td>
                                  <td>
                                    <small>{new Date(order.createdAt).toLocaleDateString()}</small>
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                  </td>
                                  <td onClick={(e) => e.stopPropagation()}>
                                    <select
                                      className="form-select form-select-sm"
<<<<<<< HEAD
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

=======
                                      value={order.status?.toLowerCase() || 'pending'}
                                      onChange={(e) => handleOrderStatusUpdate(orderId, e.target.value)}
                                      style={{ minWidth: '130px' }}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                </tr>
                                
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
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
=======
                                                    <th className="text-center">Quantity</th>
                                                    <th className="text-end">Price</th>
                                                    <th className="text-end">Subtotal</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {order.items?.map((item, index) => (
                                                    <tr key={index}>
                                                      <td>
                                                        <div className="d-flex align-items-center">
                                                          <i className="bi bi-box text-muted me-2"></i>
                                                          <span>{item.productName || 'Unknown Product'}</span>
                                                        </div>
                                                      </td>
                                                      <td className="text-center">
                                                        <span className="badge bg-primary">{item.quantity}</span>
                                                      </td>
                                                      <td className="text-end">{item.price?.toFixed(2)} EGP</td>
                                                      <td className="text-end fw-bold">
                                                        {(item.price * item.quantity).toFixed(2)} EGP
                                                      </td>
                                                    </tr>
                                                  ))}
                                                  <tr className="table-light">
                                                    <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                    <td className="text-end fw-bold text-primary">
                                                      {order.totalAmount?.toFixed(2)} EGP
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
<<<<<<< HEAD

=======
                                          
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                                                  <div>
                                                    {order.shippingAddress ||
                                                      "N/A"}
                                                  </div>
                                                </div>

=======
                                                  <div>{order.shippingAddress || 'N/A'}</div>
                                                </div>
                                                
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                                <div className="mb-3">
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-telephone me-1"></i>
                                                    Phone
                                                  </small>
<<<<<<< HEAD
                                                  <div>
                                                    {order.phone || "N/A"}
                                                  </div>
                                                </div>

=======
                                                  <div>{order.phone || 'N/A'}</div>
                                                </div>
                                                
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                                <div className="mb-3">
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-credit-card me-1"></i>
                                                    Payment Method
                                                  </small>
                                                  <div className="text-capitalize">
<<<<<<< HEAD
                                                    {order.paymentMethod?.replace(
                                                      "-",
                                                      " ",
                                                    ) || "N/A"}
                                                  </div>
                                                </div>

=======
                                                    {order.paymentMethod?.replace('-', ' ') || 'N/A'}
                                                  </div>
                                                </div>
                                                
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                                                <div>
                                                  <small className="text-muted d-block mb-1">
                                                    <i className="bi bi-calendar me-1"></i>
                                                    Order Date
                                                  </small>
                                                  <div>
<<<<<<< HEAD
                                                    {new Date(
                                                      order.createdAt,
                                                    ).toLocaleString()}
=======
                                                    {new Date(order.createdAt).toLocaleString()}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
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
<<<<<<< HEAD
                  }
=======
                  )}
>>>>>>> 517b6a95f7b55fb5916113fdbb4ab41c75e4436c
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

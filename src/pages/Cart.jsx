/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Cart({ cartItems = [], onUpdateCart }) {
  const { isLoggedIn } = useAuth();

  // Require authentication before showing the cart contents.
  if (!isLoggedIn) {
    return (
      <div className="empty-cart auth-required">
        <div className="empty-cart-icon">
          <i className="bi bi-person-circle"></i>
        </div>
        <h2>Please sign in to view your cart</h2>
        <p className="text-muted">You should open your account to continue.</p>
        <Link to="/login" className="btn btn-primary btn-lg mt-3">
          Sign In
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        {/* Simple Ripple Circle */}
        <div className="ripple-circle mb-4">
          <div className="ripple"></div>
          <div className="ripple ripple-delay-1"></div>
          <div className="ripple ripple-delay-2"></div>
        </div>

        <div className="empty-cart-icon">
          <i className="bi bi-cart-x"></i>
        </div>
        <h2>Your cart is empty</h2>
        <p className="text-muted">Add some products to get started!</p>
        <Link to="/shop" className="btn btn-primary btn-lg mt-3">
          <i className="bi bi-arrow-left me-2"></i>
          Start Shopping
        </Link>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = totalAmount * 0.1; // 10% تخفيض

  // دوال التحكم
  const decreaseQuantity = (item) => {
    const newQuantity = item.quantity - 1;
    onUpdateCart(item.product, newQuantity);
  };

  const increaseQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    onUpdateCart(item.product, newQuantity);
  };

  const removeItem = (item) => {
    onUpdateCart(item.product, 0);
  };

  // تأثير عند إزالة منتج
  const handleRemove = (item, e) => {
    e.stopPropagation();
    const row = e.target.closest(".cart-item-row");
    if (row) {
      row.style.opacity = "0.5";
      row.style.transform = "translateX(20px)";
      setTimeout(() => {
        removeItem(item);
      }, 300);
    } else {
      removeItem(item);
    }
  };

  return (
    <div className="cart-container">
      {/* Cart Header */}
      <div className="cart-header">
        <div className="cart-title-section">
          <div className="cart-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-bag-check-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"
              />
            </svg>{" "}
          </div>
          <div>
            <h1 className="cart-title">Your Shopping Cart</h1>
            <p className="cart-subtitle">
              <span className="cart-count">{totalItems}</span> items in your
              cart
            </p>
          </div>
        </div>
        <div className="cart-progress">
          <div className="progress-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-label">Cart</span>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-label">Information</span>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <span className="step-number">4</span>
              <span className="step-label">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-content">
        <div className="row">
          {/* Cart Items - Left Column */}
          <div className="col-lg-8">
            <div className="cart-items-section">
              {/* Cart Header */}
              <div className="cart-items-header">
                <h3 className="section-title">Items in Cart</h3>
                <div className="cart-actions">
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-heart me-1"></i>
                    Save Cart
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to clear your cart?"
                        )
                      ) {
                        cartItems.forEach((item) =>
                          onUpdateCart(item.product, 0)
                        );
                      }
                    }}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="cart-item-card cart-item-row"
                  >
                    {/* Product Image */}
                    <div className="cart-item-image">
                      <Link
                        to={`/shop/${item.product.id}`}
                        className="product-image-link"
                      >
                        <div className="image-wrapper">
                          <img
                            src={
                              item.product.images?.[0] ||
                              "/images/placeholder.jpg"
                            }
                            alt={item.product.title}
                            className="product-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236c757d' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(
                                item.product.title.substring(0, 15)
                              )}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                          <div className="image-overlay">
                            <i className="bi bi-eye"></i>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="cart-item-info">
                      <div
                        className="close-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleRemove(item, e);
                        }}
                        style={{ cursor: "pointer" }}
                        title="Remove item"
                        aria-label={`Remove ${item.product.title} from cart`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-x-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </div>

                      {/* Product Name */}
                      <div className="cart-item-name-section">
                        <h3 className="product-name">{item.product.title}</h3>

                        {/* Product Description */}
                        {item.product.description && (
                          <div className="product-description">
                            <p className="description-text">
                              {item.product.description.length > 100
                                ? `${item.product.description.substring(
                                    0,
                                    100
                                  )}...`
                                : item.product.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Product Price */}
                      <div className="product-price-section">
                        <div className="price-display">
                          <span className="current-price">
                            {(item.product.price * item.quantity).toFixed(2)}{" "}
                            EGP
                          </span>
                          {item.quantity > 1 && (
                            <span className="unit-price text-muted">
                              {item.product.price.toFixed(2)} EGP each
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="quantity-section">
                        <div className="quantity-controls-card">
                          <button
                            className="quantity-btn decrease-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              decreaseQuantity(item);
                            }}
                            disabled={item.quantity <= 1}
                          >
                            <i className="bi bi-dash-lg">-</i>
                          </button>
                          <div className="quantity-display">
                            <strong className="number-items">
                              <span className="quantity-number">
                                {item.quantity}
                              </span>
                              <span className="quantity-label texst-items">
                                {" "}
                                items
                              </span>
                            </strong>
                          </div>
                          <button
                            className="quantity-btn increase-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              increaseQuantity(item);
                            }}
                          >
                            <i className="bi bi-plus-lg">+</i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary Bar */}
              <div className="cart-summary-bar">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="cart-totals">
                      <span className="total-label">Cart Total:</span>
                      <span className="total-amount">
                        {totalAmount.toFixed(2)} EGP
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <Link to="/shop" className="btn btn-outline-primary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="col-lg-4">
            <div className="order-summary-card">
              <div className="order-summary-header">
                <h3 className="summary-title">
                  <i className="bi bi-receipt me-2"></i>
                  Order Summary
                </h3>
              </div>

              <div className="order-summary-body">
                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span className="price-label">
                      <i className="bi bi-cart3 me-2 text-muted"></i>
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="price-value">
                      {totalAmount.toFixed(2)} EGP
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">
                      <i className="bi bi-truck me-2 text-muted"></i>
                      Shipping
                    </span>
                    <span className="price-value text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      FREE
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">
                      <i className="bi bi-calculator me-2 text-muted"></i>
                      Tax (14%)
                    </span>
                    <span className="price-value">
                      {(totalAmount * 0.14).toFixed(2)} EGP
                    </span>
                  </div>
                  <div className="price-row discount-row">
                    <span className="price-label">
                      <i className="bi bi-tag-fill me-2 text-success"></i>
                      <span className="discount-text">Discount (10%)</span>
                    </span>
                    <span className="price-value text-success">
                      -{totalSavings.toFixed(2)} EGP
                    </span>
                  </div>
                </div>

                {/* Divider with pattern */}
                <div className="summary-divider">
                  <div className="divider-line"></div>
                  <div className="divider-icon">
                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>

                {/* Total */}
                <div className="total-section">
                  <div className="total-row">
                    <span className="total-label">
                      <i className="bi bi-receipt me-2"></i>
                      Total Amount
                    </span>
                    <span className="total-amount">
                      <span className="total-currency">EGP</span>
                      {(
                        totalAmount +
                        totalAmount * 0.14 -
                        totalSavings
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="savings-message">
                    <i className="bi bi-gift-fill me-2"></i>
                    <span>
                      You saved <strong>{totalSavings.toFixed(2)} EGP</strong>{" "}
                      with this order
                    </span>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="delivery-estimate">
                    <i className="bi bi-clock-history me-2"></i>
                    <span>
                      Estimated delivery: <strong>2-3 business days</strong>
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="promo-section">
                  <div className="promo-header">
                    <i className="bi bi-percent"></i>
                    <h6>Have a promo code?</h6>
                  </div>
                  <div className="promo-input-group">
                    <div className="input-wrapper">
                      <i className="bi bi-ticket-perforated input-icon"></i>
                      <input
                        type="text"
                        className="promo-input"
                        placeholder="Enter promo code"
                        aria-label="Promo code"
                      />
                    </div>
                    <button className="promo-btn">
                      <i className="bi bi-arrow-right-short"></i>
                      <span>Apply</span>
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="checkout-section">
                  <Link
                    to="/checkout"
                    className="btn btn-primary btn-checkout w-100"
                  >
                    <div className="checkout-content">
                      <div className="checkout-text">
                        <i className="bi bi-lock-fill"></i>
                        <span>Proceed to Checkout</span>
                      </div>
                      <div className="checkout-arrow">
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </Link>

                  <div className="secure-checkout">
                    <i className="bi bi-shield-check"></i>
                    <small>Secure 256-bit SSL encrypted checkout</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

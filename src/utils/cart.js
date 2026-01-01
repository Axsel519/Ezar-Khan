/** @format */

// ============================================
// CART UTILITIES
// ============================================
// Handles shopping cart operations including localStorage persistence

const CART_KEY = "cart_items";

// ============================================
// CART OPERATIONS
// ============================================

/**
 * Loads the cart from localStorage
 * @returns {Array} The cart items array
 */
export function loadCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Saves the cart to localStorage
 * @param {Array} cart - The cart items array to save
 * @returns {Array} The saved cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

/**
 * Unified function to update cart items
 * @param {Object} product - The product to add/update
 * @param {number} quantity - The quantity (0 removes the product)
 * @returns {Array} The updated cart
 */
export function updateCart(product, quantity) {
  let cart = loadCart();
  const productIndex = cart.findIndex((item) => item.product.id === product.id);

  if (quantity > 0) {
    // Update or add product
    const cartItem = { product, quantity };

    if (productIndex !== -1) {
      cart[productIndex].quantity = quantity; // Update quantity
    } else {
      cart.push(cartItem); // Add new product
    }
  } else {
    // Remove product if quantity is 0
    if (productIndex !== -1) {
      cart = cart.filter((_, index) => index !== productIndex);
    }
  }

  return saveCart(cart);
}

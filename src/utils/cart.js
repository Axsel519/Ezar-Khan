/** @format */

const CART_KEY = "cart_items";

// تحميل السلة من localStorage
export function loadCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

// حفظ السلة في localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

// ✅ الدالة الموحدة للتحكم في السلة
export function updateCart(product, quantity) {
  let cart = loadCart();
  const productIndex = cart.findIndex((item) => item.product.id === product.id);

  if (quantity > 0) {
    // تحديث أو إضافة المنتج
    const cartItem = { product, quantity };

    if (productIndex !== -1) {
      cart[productIndex].quantity = quantity; // تحديث الكمية
    } else {
      cart.push(cartItem); // إضافة منتج جديد
    }
  } else {
    // إزالة المنتج إذا كانت الكمية 0
    if (productIndex !== -1) {
      cart = cart.filter((_, index) => index !== productIndex);
    }
  }

  return saveCart(cart);
}

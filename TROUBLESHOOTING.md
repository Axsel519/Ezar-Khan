# Troubleshooting Guide - Kitchen Shop

## Common Errors and Solutions

### 1. "products.map is not a function"

**Error:**
```
Uncaught TypeError: products.map is not a function
```

**Cause:** The backend API is not returning data in the expected format, or the API is not running.

**Solutions:**

#### A. Check if Backend is Running
```bash
curl http://localhost:3000/health
```

If this fails, start your backend server.

#### B. Check API Response Format
The API should return products in one of these formats:
```javascript
// Format 1: Direct array
[
  { id: "1", name: "Product 1", ... },
  { id: "2", name: "Product 2", ... }
]

// Format 2: Object with products array
{
  products: [
    { id: "1", name: "Product 1", ... },
    { id: "2", name: "Product 2", ... }
  ]
}
```

#### C. Verify API Endpoint
Test the products endpoint:
```bash
curl http://localhost:3000/products
```

#### D. Check CORS Configuration
If you see CORS errors in the console, ensure your backend has CORS enabled for `http://localhost:5173`

**Backend CORS Configuration (Express.js example):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

### 2. "Failed to fetch products"

**Error:**
```
Error fetching products: Network Error
```

**Solutions:**

#### A. Verify Backend URL
Check `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

#### B. Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests
5. Check the error details

#### C. Test API Manually
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test products endpoint
curl http://localhost:3000/products

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/products
```

---

### 3. "Unauthorized" / 401 Errors

**Error:**
```
401 Unauthorized
```

**Solutions:**

#### A. Clear and Re-login
```javascript
// In browser console
localStorage.clear()
location.reload()
```

Then login again.

#### B. Check Token
```javascript
// In browser console
console.log(localStorage.getItem('authToken'))
```

If null or expired, login again.

#### C. Verify Backend Authentication
Ensure your backend is properly validating JWT tokens.

---

### 4. Admin Dashboard Not Accessible

**Error:**
```
Redirected to home page when accessing /admin
```

**Solutions:**

#### A. Check User Role
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('currentUser'))
console.log(user.role)
```

Role must be `"ADMIN"` (case-sensitive).

#### B. Login with Admin Credentials
```
Email: admin@example.com
Password: Admin@123456
```

#### C. Verify Backend Returns Role
Check the login response includes the role:
```javascript
{
  token: "...",
  user: {
    id: "...",
    email: "...",
    role: "ADMIN"  // Must be present
  }
}
```

---

### 5. Images Not Loading

**Error:**
Images show broken icon or placeholder.

**Solutions:**

#### A. Check Image URLs
Verify the image URLs in the database are correct and accessible.

#### B. Check Upload Directory
Ensure the backend upload directory exists and has proper permissions.

#### C. Test Image URL Directly
Copy an image URL and paste it in browser to see if it loads.

#### D. Check CORS for Images
If images are on a different domain, ensure CORS is configured.

---

### 6. Order Creation Fails

**Error:**
```
Failed to create order
```

**Solutions:**

#### A. Check Required Fields
Ensure all required fields are filled:
- Shipping address
- Phone number
- Payment method

#### B. Verify Cart Items
```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('cart')))
```

#### C. Check Backend Logs
Look at backend console for error details.

#### D. Test Order Endpoint
```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "1", "quantity": 2}],
    "shippingAddress": "123 Main St",
    "phone": "+1234567890"
  }'
```

---

### 7. Build Errors

**Error:**
```
Build failed with errors
```

**Solutions:**

#### A. Clear Cache and Reinstall
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

#### B. Check Node Version
```bash
node --version
```

Ensure Node.js v14 or higher.

#### C. Fix Syntax Errors
Check the error message for file and line number, then fix the syntax error.

#### D. Check for Missing Dependencies
```bash
npm install
```

---

### 8. Slow Performance

**Issue:** Application is slow or laggy.

**Solutions:**

#### A. Check Network Speed
Use DevTools Network tab to check API response times.

#### B. Optimize Images
Ensure images are properly sized and compressed.

#### C. Check Backend Performance
Monitor backend response times and optimize queries.

#### D. Enable Caching
Configure proper caching headers on the backend.

---

### 9. Comments Not Showing

**Error:**
Comments section is empty even after adding comments.

**Solutions:**

#### A. Check API Response
```bash
curl http://localhost:3000/comments/product/PRODUCT_ID
```

#### B. Verify Product ID
Ensure the product ID in the URL matches the database.

#### C. Check Console for Errors
Look for JavaScript errors in browser console.

---

### 10. Cart Not Persisting

**Issue:** Cart items disappear after page refresh.

**Solutions:**

#### A. Check LocalStorage
```javascript
// In browser console
console.log(localStorage.getItem('cart'))
```

#### B. Check Browser Settings
Ensure cookies and local storage are enabled.

#### C. Clear and Reset
```javascript
localStorage.removeItem('cart')
location.reload()
```

---

## Debugging Tips

### 1. Enable Verbose Logging
Add this to your component:
```javascript
useEffect(() => {
  console.log('Current state:', { products, loading, error });
}, [products, loading, error]);
```

### 2. Check API Calls
In DevTools Network tab:
- Filter by "XHR" or "Fetch"
- Check request/response details
- Look for error status codes

### 3. Inspect State
Use React DevTools to inspect component state and props.

### 4. Test API Independently
Use Postman or curl to test API endpoints separately from the frontend.

### 5. Check Browser Console
Always check the browser console for error messages and warnings.

---

## Getting Help

### Before Asking for Help:

1. **Check this guide** for your specific error
2. **Read error messages** carefully
3. **Check browser console** for details
4. **Test API endpoints** manually
5. **Verify environment** variables

### When Asking for Help, Include:

1. **Error message** (full text)
2. **Browser console** output
3. **Network tab** details
4. **Steps to reproduce**
5. **Environment info** (OS, Node version, browser)
6. **What you've tried** already

### Useful Commands for Debugging:

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Verify build
npm run build

# Test production build
npm run preview

# Clear npm cache
npm cache clean --force
```

### Browser Console Commands:

```javascript
// Check authentication
console.log(localStorage.getItem('authToken'))
console.log(localStorage.getItem('currentUser'))

// Check cart
console.log(localStorage.getItem('cart'))

// Clear all data
localStorage.clear()

// Check API base URL
console.log(import.meta.env.VITE_API_BASE_URL)
```

---

## Still Having Issues?

1. **Review Documentation:**
   - [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
   - [QUICK_START.md](./QUICK_START.md)
   - [README.md](./README.md)

2. **Check Backend Logs:**
   Look at your backend server console for error details

3. **Restart Everything:**
   ```bash
   # Stop frontend and backend
   # Then restart both
   npm run dev
   ```

4. **Fresh Install:**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   npm run dev
   ```

---

**Last Updated:** January 2026  
**Version:** 1.0.0

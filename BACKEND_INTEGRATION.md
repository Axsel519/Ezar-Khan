# Backend Integration Guide

## Overview
This application is now fully integrated with the backend API server running on `http://localhost:3000`.

## Features Implemented

### 1. Authentication System
- **Login**: `/auth/login` - Users can log in with email and password
- **Register**: `/auth/register` - New users can create accounts
- **JWT Token Management**: Automatic token storage and inclusion in requests
- **Auto-redirect**: Unauthorized users are redirected to login

### 2. Products Management
- **Fetch Products**: GET `/products` - Display all products with pagination
- **Search Products**: GET `/products?search=term` - Search functionality
- **Product Details**: GET `/products/:id` - View individual product details
- **Admin CRUD**: Create, update, and delete products (admin only)

### 3. Orders System
- **Create Order**: POST `/orders` - Place new orders
- **My Orders**: GET `/orders/my-orders` - View user's order history
- **Admin Orders**: GET `/orders` - View all orders (admin only)
- **Update Status**: PATCH `/orders/:id/status` - Update order status (admin only)

### 4. Comments/Reviews
- **Add Review**: POST `/comments` - Add product reviews
- **Get Reviews**: GET `/comments/product/:id` - Fetch product reviews
- **Update Review**: PATCH `/comments/:id` - Edit own reviews
- **Delete Review**: DELETE `/comments/:id` - Remove own reviews

### 5. Image Uploads
- **Upload Images**: POST `/uploads/images` - Upload product images (admin only)
- **Get Image**: GET `/uploads/:id` - Retrieve uploaded images
- **Delete Image**: DELETE `/uploads/:id` - Remove images (admin only)

### 6. Admin Dashboard
- **Route**: `/admin` - Accessible only to users with `role: ADMIN`
- **Product Management**: Full CRUD operations for products
- **Order Management**: View and update order statuses
- **Image Upload**: Upload and manage product images

## API Configuration

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

### Authentication Headers
All authenticated requests automatically include:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server
Make sure your backend server is running on `http://localhost:3000`

### 3. Start Frontend
```bash
npm run dev
```

### 4. Test Credentials
Use these credentials to test the application:

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin@123456`

**Customer Account:**
- Email: `john@example.com`
- Password: `Customer@123`

## File Structure

```
src/
├── services/
│   └── api.js                 # API service layer with axios
├── components/
│   └── AuthContext.jsx        # Authentication context provider
├── pages/
│   ├── Login.jsx              # Login page with backend integration
│   ├── Register.jsx           # Registration page
│   ├── Shop.jsx               # Products listing with backend data
│   ├── ProductDetails.jsx     # Product details with comments
│   ├── Cart.jsx               # Shopping cart
│   ├── Checkout.jsx           # Checkout with order creation
│   └── AdminDashboard.jsx     # Admin panel for management
└── App.jsx                    # Main app with routing
```

## API Service Methods

### Authentication
```javascript
authAPI.register(userData)
authAPI.login(credentials)
authAPI.logout()
```

### Products
```javascript
productsAPI.getAll(params)
productsAPI.getById(id)
productsAPI.search(searchTerm)
productsAPI.create(productData)      // Admin only
productsAPI.update(id, productData)  // Admin only
productsAPI.delete(id)               // Admin only
```

### Orders
```javascript
ordersAPI.create(orderData)
ordersAPI.getMyOrders()
ordersAPI.getAll(params)             // Admin only
ordersAPI.getById(id)
ordersAPI.updateStatus(id, status)   // Admin only
```

### Comments
```javascript
commentsAPI.create(commentData)
commentsAPI.getByProduct(productId)
commentsAPI.update(id, commentData)
commentsAPI.delete(id)
```

### Uploads
```javascript
uploadsAPI.uploadSingle(file)        // Admin only
uploadsAPI.uploadMultiple(files)     // Admin only
uploadsAPI.getImage(id)
uploadsAPI.getAll()                  // Admin only
uploadsAPI.delete(id)                // Admin only
```

## Error Handling

The application includes comprehensive error handling:

- **401 Unauthorized**: Automatic redirect to login page
- **403 Forbidden**: Access denied message
- **404 Not Found**: Resource not found error
- **409 Conflict**: Duplicate resource (e.g., email already exists)
- **500 Server Error**: Generic server error message

## Security Features

1. **JWT Token Storage**: Tokens stored in localStorage
2. **Automatic Token Injection**: Axios interceptor adds token to requests
3. **Token Expiration Handling**: Auto-logout on 401 responses
4. **Role-Based Access**: Admin routes protected by role check
5. **Input Validation**: Client-side and server-side validation

## Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
                    ↓
                CANCELLED
```

## Payment Methods Supported

1. **Credit Card**: Visa, Mastercard, American Express
2. **InstaPay**: Instant bank transfer
3. **Vodafone Cash**: Mobile wallet
4. **Cash on Delivery**: Pay when you receive

## Admin Dashboard Features

### Products Tab
- View all products in a table
- Add new products with form
- Edit existing products
- Delete products
- Upload multiple product images
- Real-time image preview

### Orders Tab
- View all customer orders
- Filter and search orders
- Update order status
- View order details
- Track order history

## Best Practices Implemented

1. **Axios Interceptors**: Centralized request/response handling
2. **Error Boundaries**: Graceful error handling
3. **Loading States**: User feedback during API calls
4. **Optimistic Updates**: Immediate UI updates
5. **Token Refresh**: Automatic token management
6. **API Abstraction**: Clean service layer separation
7. **Type Safety**: Consistent data structures
8. **Security**: Protected routes and role-based access

## Troubleshooting

### Backend Connection Issues
```javascript
// Check if backend is running
curl http://localhost:3000/health
```

### CORS Errors
Make sure your backend has CORS enabled for `http://localhost:5173`

### Token Issues
Clear localStorage and login again:
```javascript
localStorage.clear()
```

### Image Upload Fails
Check file size (max 5MB) and format (JPG, PNG, GIF)

## Production Deployment

### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Update API Configuration
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

### Build for Production
```bash
npm run build
```

## Support

For issues or questions:
1. Check the API documentation
2. Review error messages in browser console
3. Verify backend server is running
4. Check network tab in DevTools

## License

This project is part of the Kitchen Shop application.

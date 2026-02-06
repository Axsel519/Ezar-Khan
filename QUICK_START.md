# Quick Start Guide - Kitchen Shop with Backend Integration

## Prerequisites
- Node.js (v14 or higher)
- Backend API server running on `http://localhost:3000`
- npm or yarn package manager

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup (Optional)
Copy the example environment file:
```bash
copy .env.example .env
```

Edit `.env` if you need to change the API URL:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Start the Application
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## First Time Setup

### 1. Make Sure Backend is Running
Your backend server must be running on `http://localhost:3000`. Test it:
```bash
curl http://localhost:3000/health
```

### 2. Register an Account
- Go to `http://localhost:5173/register`
- Fill in the registration form
- Click "إنشاء حسابي" (Create Account)

### 3. Login
- Go to `http://localhost:5173/login`
- Use your credentials or test credentials:
  - **Admin**: `admin@example.com` / `Admin@123456`
  - **Customer**: `john@example.com` / `Customer@123`

## Features Overview

### For Customers

#### 1. Browse Products
- Visit `/shop` to see all products
- Use search bar to find specific items
- Filter by category
- Sort by price or name

#### 2. Product Details
- Click on any product to see details
- View multiple images
- Read and write reviews
- Add comments

#### 3. Shopping Cart
- Add products to cart
- Adjust quantities
- View cart summary
- Proceed to checkout

#### 4. Checkout Process
1. **Cart Review**: Verify your items
2. **Information**: Enter shipping details
3. **Payment**: Choose payment method
   - Credit Card
   - InstaPay
   - Vodafone Cash
   - Cash on Delivery
4. **Complete**: Get order confirmation

#### 5. My Orders
- View order history at `/orders/my-orders`
- Track order status
- View order details

### For Admins

#### Access Admin Dashboard
- Login with admin credentials
- Click "Admin" in navigation menu
- Or go directly to `/admin`

#### Products Management
- **View All Products**: See complete product list
- **Add Product**: Fill form and upload images
- **Edit Product**: Click edit icon, modify details
- **Delete Product**: Remove products from catalog
- **Upload Images**: Drag & drop or select files

#### Orders Management
- **View All Orders**: See all customer orders
- **Update Status**: Change order status
  - PENDING → PROCESSING → SHIPPED → DELIVERED
  - Or CANCELLED
- **Filter Orders**: Search and filter by status
- **View Details**: See customer and order information

## API Endpoints Used

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get token

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `GET /products?search=term` - Search products
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders
- `POST /orders` - Create new order
- `GET /orders/my-orders` - Get user's orders
- `GET /orders` - Get all orders (admin)
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update status (admin)

### Comments
- `POST /comments` - Add review/comment
- `GET /comments/product/:id` - Get product reviews
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Uploads
- `POST /uploads/images` - Upload images (admin)
- `GET /uploads/:id` - Get image
- `DELETE /uploads/:id` - Delete image (admin)

## Common Tasks

### Add a New Product (Admin)
1. Go to `/admin`
2. Click "Products" tab
3. Fill in product form:
   - Name
   - Description
   - Price
   - Stock
   - Category
4. Upload images
5. Click "Add Product"

### Place an Order (Customer)
1. Browse products at `/shop`
2. Add items to cart
3. Go to `/cart`
4. Click "Proceed to Checkout"
5. Fill in shipping information
6. Choose payment method
7. Confirm order

### Update Order Status (Admin)
1. Go to `/admin`
2. Click "Orders" tab
3. Find the order
4. Select new status from dropdown
5. Status updates automatically

## Troubleshooting

### "Failed to fetch products"
- Check if backend is running
- Verify API URL in `.env`
- Check browser console for errors

### "Unauthorized" Error
- Token may have expired
- Logout and login again
- Clear localStorage: `localStorage.clear()`

### Images Not Loading
- Check image URLs in database
- Verify upload directory permissions
- Check network tab in DevTools

### Admin Dashboard Not Accessible
- Verify user role is "ADMIN"
- Check localStorage: `localStorage.getItem('currentUser')`
- Login with admin credentials

## Development Tips

### View API Requests
Open browser DevTools → Network tab to see all API calls

### Check Authentication
```javascript
// In browser console
console.log(localStorage.getItem('authToken'))
console.log(localStorage.getItem('currentUser'))
```

### Clear All Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Test Different Roles
1. Logout
2. Login with different credentials
3. Test role-specific features

## Production Deployment

### 1. Update API URL
Edit `.env`:
```env
VITE_API_BASE_URL=https://your-production-api.com
```

### 2. Build Application
```bash
npm run build
```

### 3. Deploy
Upload `dist` folder to your hosting service

## Support

For issues or questions:
1. Check `BACKEND_INTEGRATION.md` for detailed API documentation
2. Review error messages in browser console
3. Verify backend server is running and accessible
4. Check network requests in DevTools

## Next Steps

- Customize product categories
- Add more payment methods
- Implement order tracking
- Add email notifications
- Create customer dashboard
- Add wishlist feature
- Implement product ratings
- Add inventory management

## License

This project is part of the Kitchen Shop application.

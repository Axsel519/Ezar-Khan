# Quick Reference - Kitchen Shop

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 Test Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `Admin@123456`

**Customer:**
- Email: `john@example.com`
- Password: `Customer@123`

## 📍 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Dashboard**: http://localhost:5173/admin
- **Shop**: http://localhost:5173/shop

## ⚡ Key Features

### Customer Features
- ✅ Browse products
- ✅ Search & filter
- ✅ Shopping cart
- ✅ Checkout (4 steps)
- ✅ Order tracking
- ✅ Product reviews

### Admin Features (role: ADMIN required)
- ✅ Product CRUD
- ✅ Order management
- ✅ Image uploads
- ✅ Status updates

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Debugging
npm run build            # Check for build errors
```

## 🐛 Quick Fixes

### Backend Not Running
```bash
# App will use fallback data automatically
# You'll see a warning message
# Products will still display
```

### Clear All Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Check Authentication
```javascript
// In browser console
console.log(localStorage.getItem('authToken'))
console.log(localStorage.getItem('currentUser'))
```

## 📦 API Endpoints

### Auth
- `POST /auth/register` - Register
- `POST /auth/login` - Login

### Products
- `GET /products` - List all
- `GET /products/:id` - Get one
- `POST /products` - Create (admin)
- `PATCH /products/:id` - Update (admin)
- `DELETE /products/:id` - Delete (admin)

### Orders
- `POST /orders` - Create order
- `GET /orders/my-orders` - My orders
- `GET /orders` - All orders (admin)
- `PATCH /orders/:id/status` - Update status (admin)

### Comments
- `POST /comments` - Add review
- `GET /comments/product/:id` - Get reviews

## 🎯 Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
              ↓
          CANCELLED
```

## 💳 Payment Methods

1. Credit Card
2. InstaPay
3. Vodafone Cash
4. Cash on Delivery

## 📁 Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── AdminDashboard.jsx
├── services/        # API services
│   └── api.js
├── data/           # Fallback data
│   └── products.js
└── utils/          # Utility functions
```

## 🔐 Security

- JWT tokens in localStorage
- Auto-logout on 401
- Role-based access control
- Protected admin routes

## 📊 Build Info

- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Styling**: Bootstrap 5 + Custom CSS

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Check [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
3. Check browser console for errors
4. Check network tab for API calls

## ✅ Checklist Before Deployment

- [ ] Backend API is running
- [ ] Environment variables set
- [ ] Build completes successfully
- [ ] All features tested
- [ ] Admin credentials work
- [ ] Customer flow works
- [ ] Images load correctly
- [ ] Orders can be created

## 🎉 Features Status

| Feature | Status |
|---------|--------|
| Authentication | ✅ Working |
| Product Listing | ✅ Working |
| Search & Filter | ✅ Working |
| Shopping Cart | ✅ Working |
| Checkout | ✅ Working |
| Order Creation | ✅ Working |
| Comments/Reviews | ✅ Working |
| Admin Dashboard | ✅ Working |
| Image Upload | ✅ Working |
| Offline Mode | ✅ Working |

## 📝 Notes

- App works offline with fallback data
- Backend is optional for browsing
- Backend required for orders/auth
- Admin role required for `/admin`
- All builds are production-ready

---

**Version**: 1.0.0  
**Last Updated**: January 31, 2026  
**Status**: ✅ Production Ready

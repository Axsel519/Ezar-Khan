# Kitchen Shop - E-Commerce Application

A modern, full-featured e-commerce application for kitchen products built with React and integrated with a backend API server.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse and search through kitchen products
- **Product Details**: View detailed product information with multiple images
- **Shopping Cart**: Add, remove, and manage cart items
- **Checkout Process**: Complete 4-step checkout with multiple payment options
- **Order Tracking**: View order history and status
- **Reviews & Comments**: Add and view product reviews
- **User Authentication**: Secure login and registration

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel at `/admin`
- **Product Management**: Full CRUD operations for products
- **Order Management**: View and update order statuses
- **Image Upload**: Upload and manage product images
- **User Management**: View customer information

### Payment Methods
- Credit Card (Visa, Mastercard, American Express)
- InstaPay (Instant bank transfer)
- Vodafone Cash (Mobile wallet)
- Cash on Delivery

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Bootstrap 5, Custom CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **State Management**: React Context API
- **Authentication**: JWT tokens

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:3000`

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd kitchen-shop
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
```bash
copy .env.example .env
```

Edit `.env` if needed:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Quick Start

### Test Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin@123456`

**Customer Account:**
- Email: `john@example.com`
- Password: `Customer@123`

### First Steps

1. **Start Backend Server**: Ensure your backend API is running on port 3000
2. **Register**: Create a new account at `/register`
3. **Login**: Sign in at `/login`
4. **Browse**: Explore products at `/shop`
5. **Admin**: Access admin dashboard at `/admin` (admin only)

## 📁 Project Structure

```
kitchen-shop/
├── public/
│   └── images/          # Product images
├── src/
│   ├── components/      # Reusable components
│   │   ├── AuthContext.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── utils/          # Utility functions
│   ├── data/           # Static data
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── .env.example        # Environment variables template
├── package.json
└── vite.config.js
```

## 🔌 API Integration

The application integrates with a backend API server. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed API documentation.

### Key Endpoints

- **Authentication**: `/auth/login`, `/auth/register`
- **Products**: `/products`, `/products/:id`
- **Orders**: `/orders`, `/orders/my-orders`
- **Comments**: `/comments`, `/comments/product/:id`
- **Uploads**: `/uploads/images`

## 🎨 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start (alias for dev)
npm start
```

## 🔐 Authentication & Authorization

- **JWT Tokens**: Stored in localStorage
- **Auto-logout**: On token expiration (401 responses)
- **Protected Routes**: Automatic redirect to login
- **Role-Based Access**: Admin vs Customer permissions

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy
Upload the `dist` folder to your hosting service.

### Environment Configuration
Update `.env` with production API URL:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Getting started guide
- [Backend Integration](./BACKEND_INTEGRATION.md) - API documentation
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical overview

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:3000/health
```

### Clear Application Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### CORS Errors
Ensure your backend has CORS enabled for `http://localhost:5173`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues or questions:
1. Check the documentation files
2. Review browser console for errors
3. Verify backend server is running
4. Check network tab in DevTools

## 🎉 Features Roadmap

- [ ] Real-time order updates (WebSocket)
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Advanced search filters
- [ ] Wishlist feature
- [ ] Product ratings
- [ ] Inventory management
- [ ] Sales analytics
- [ ] Coupon system
- [ ] Customer dashboard

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the blazing fast build tool
- Bootstrap for the UI components
- All contributors and testers

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready

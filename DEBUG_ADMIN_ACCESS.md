# Debug Admin Access Issue

## Quick Debug Steps

### 1. Check Current User Data

Open browser console (F12) and run:

```javascript
// Check if logged in
console.log('Is Logged In:', localStorage.getItem('isLoggedIn'));

// Check current user
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Current User:', user);
console.log('User Role:', user?.role);

// Check token
console.log('Auth Token:', localStorage.getItem('authToken'));
```

### 2. Expected Output

For admin access, you should see:
```javascript
{
  id: "...",
  email: "admin@example.com",
  name: "Admin",
  role: "ADMIN",  // ← This must be exactly "ADMIN"
  profileImage: null
}
```

### 3. Common Issues

#### Issue 1: Role is Missing
**Problem:** `role: undefined` or `role: null`

**Solution:** Backend is not returning the role. Check backend response:
```javascript
// In Login.jsx, add console.log
console.log('Backend Response:', response);
```

#### Issue 2: Role is Different Case
**Problem:** `role: "admin"` (lowercase) instead of `"ADMIN"`

**Solution:** Backend is returning lowercase. Update AdminDashboard.jsx:
```javascript
// Change from:
if (currentUser?.role !== 'ADMIN') {

// To:
if (currentUser?.role?.toUpperCase() !== 'ADMIN') {
```

#### Issue 3: Role is Different Value
**Problem:** `role: "ADMINISTRATOR"` or other value

**Solution:** Update the check to match your backend:
```javascript
if (currentUser?.role !== 'ADMINISTRATOR') {
```

### 4. Test Backend Response

Test the login endpoint directly:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

Check if the response includes the role:
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "ADMIN"  // ← Must be present
  }
}
```

### 5. Manual Fix

If backend is not returning role, you can manually set it:

```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('currentUser'));
user.role = 'ADMIN';
localStorage.setItem('currentUser', JSON.stringify(user));
location.reload();
```

### 6. Check Admin Dashboard Console

When you try to access `/admin`, check the browser console for:
```
Admin Check: {
  isLoggedIn: true,
  currentUser: {...},
  role: "ADMIN",
  isAdmin: true
}
```

If you see:
```
Not admin, redirecting to home
```

Then the role check is failing.

### 7. Verify Backend User

Check your backend database to ensure the user has admin role:

**Example (if using MongoDB):**
```javascript
db.users.findOne({ email: "admin@example.com" })
// Should show: { ..., role: "ADMIN" }
```

**Example (if using SQL):**
```sql
SELECT * FROM users WHERE email = 'admin@example.com';
-- Should show role = 'ADMIN'
```

### 8. Create Admin User

If you don't have an admin user, create one:

**Via Backend API:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin@123456",
    "role": "ADMIN"
  }'
```

**Or update existing user in database:**
```javascript
// MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "ADMIN" } }
)

// SQL
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### 9. Quick Test Script

Run this in browser console after login:

```javascript
// Quick Admin Access Test
(function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const hasToken = !!localStorage.getItem('authToken');
  
  console.log('=== ADMIN ACCESS DEBUG ===');
  console.log('✓ Logged In:', isLoggedIn);
  console.log('✓ Has Token:', hasToken);
  console.log('✓ User Email:', user.email);
  console.log('✓ User Role:', user.role);
  console.log('✓ Is Admin:', user.role === 'ADMIN');
  console.log('========================');
  
  if (!isLoggedIn) {
    console.error('❌ NOT LOGGED IN');
  } else if (!user.role) {
    console.error('❌ ROLE IS MISSING');
    console.log('Fix: Backend must return role in login response');
  } else if (user.role !== 'ADMIN') {
    console.error('❌ ROLE IS NOT ADMIN');
    console.log('Current role:', user.role);
    console.log('Expected role: ADMIN');
  } else {
    console.log('✅ ALL CHECKS PASSED - You should have admin access');
  }
})();
```

### 10. Temporary Bypass (Development Only)

**WARNING: Only for testing!**

To temporarily bypass admin check:

```javascript
// In AdminDashboard.jsx, comment out the check:
useEffect(() => {
  // if (!isLoggedIn || currentUser?.role !== 'ADMIN') {
  //   navigate('/');
  // }
}, [isLoggedIn, currentUser, navigate]);
```

### Solution Steps

1. **Check console logs** when accessing `/admin`
2. **Verify user role** in localStorage
3. **Check backend response** includes role
4. **Update backend** if role is missing
5. **Reload page** after fixing

### Contact Points

If still having issues, provide:
1. Console output from step 1
2. Backend login response
3. Browser console errors
4. Network tab screenshot

---

**Quick Fix Command:**
```javascript
// Run in console to check everything
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Role:', user?.role, '| Expected: ADMIN | Match:', user?.role === 'ADMIN');
```

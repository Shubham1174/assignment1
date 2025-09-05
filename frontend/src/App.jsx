import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AuthGuard from './hooks/useAuthGuard.jsx';
import { useAuth } from './store/auth.js';
import { useEffect } from 'react';

export default function App() {
  const { user, fetchMe } = useAuth();
  useEffect(() => { fetchMe(); }, []);
  return (
    <BrowserRouter>
      <div className="p-4 flex gap-4 border-b">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/admin/products">Admin</Link>
        <span className="ml-auto">{user ? `Hi, ${user.name}` : (<><Link to="/login">Login</Link><span> | </span><Link to="/register">Register</Link></>)}</span>
      </div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<AuthGuard roles={["customer"]}><Cart /></AuthGuard>} />
        <Route path="/orders" element={<AuthGuard roles={["customer", "admin"]}><Orders /></AuthGuard>} />
        <Route path="/admin/products" element={<AuthGuard roles={["admin"]}><AdminProducts /></AuthGuard>} />
      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminCollections from './components/admin/AdminCollections';
import AdminUsers from './components/admin/AdminUsers';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Collections from './pages/Collections';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user || !user.is_admin) return <Navigate to="/login" />;
  return children;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Products />} />

        <Route path="products" element={<Products />} />
        <Route path="collections" element={<Collections />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="checkout" element={
            <ProtectedRoute>
                <Checkout />
            </ProtectedRoute>
        } />
        <Route path="orders" element={
            <ProtectedRoute>
                <Orders />
            </ProtectedRoute>
        } />
        <Route path="profile" element={
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        } />



      </Route>

      <Route path="admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

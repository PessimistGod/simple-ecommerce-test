import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminCreate from "./pages/AdminCreate";

import PublicRoute from "./components/PublicRoute";
import RoleShop from "./components/RoleShop";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public (only when NOT logged in) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Authenticated user */}
<Route
  path="/shop"
  element={
    <ProtectedRoute>
      <RoleShop />
    </ProtectedRoute>
  }
/>


        <Route
          path="/admin/create"
          element={
            <ProtectedRoute>
              <AdminCreate />
            </ProtectedRoute>
          }
        />

        {/* Admin only later */}
        {/*
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        */}
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RoleShop from "./components/RoleShop";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
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

        {/* Protected */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <RoleShop />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

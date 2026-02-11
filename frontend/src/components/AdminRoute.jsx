import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  const user = jwtDecode(token);

  if (user.role !== "ADMIN") return <Navigate to="/shop" />;

  return children;
}

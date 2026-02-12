import {jwtDecode} from "jwt-decode";
import AdminProducts from "../pages/AdminProducts";
import Shop from "../pages/Shop";
import UserLayout from "./UserLayout";

export default function RoleShop() {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  if (user.role === "ADMIN") return <AdminProducts />;

  return (
    <UserLayout>
      <Shop />
    </UserLayout>
  );
}

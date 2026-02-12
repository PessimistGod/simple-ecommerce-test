import { Badge, Button } from "antd";
import { ShoppingCartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function UserLayout({ children }) {
  const nav = useNavigate();
  const [count, setCount] = useState(0);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await apiFetch("/api/shop/cart");
      const data = await res.json();
      setCount(data?.items?.length || 0);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">

        <h1
          className="font-bold text-xl text-[#313860] cursor-pointer"
          onClick={() => nav("/shop")}
        >
          MyStore
        </h1>

        <div className="flex items-center gap-6">

          <Badge count={count} size="small">
            <ShoppingCartOutlined
              className="text-2xl cursor-pointer"
              onClick={() => nav("/cart")}
            />
          </Badge>

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
          />

        </div>
      </div>

      <div className="p-6">
        {children}
      </div>

    </div>
  );
}

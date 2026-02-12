import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { Select, Button, Spin } from "antd";
import { PRODUCT_CATEGORIES } from "../constants/categories";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");

  const fetchProducts = async (p = 1, cat = "") => {
    setLoading(true);

    const url = cat
      ? `/api/shop/products?page=${p}&category=${cat}`
      : `/api/shop/products?page=${p}`;

    const res = await apiFetch(url);
    const d = await res.json();

    setProducts(d.products);
    setTotal(d.total);
    setPage(p);
    setLoading(false);
  };

  const fetchCart = async () => {
    const res = await apiFetch("/api/shop/cart");
    const data = await res.json();
    setCart(data.items || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const add = async id => {
    await apiFetch(`/api/shop/cart/add/${id}`, { method: "POST" });
    fetchCart();
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    await apiFetch(`/api/shop/cart/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: qty })
    });

    fetchCart();
  };

  const getQty = id =>
    cart.find(i => i.product._id === id)?.quantity || 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Shop</h1>

        <Select
          placeholder="Filter by category"
          allowClear
          style={{ width: 220 }}
          onChange={v => {
            setCategory(v || "");
            fetchProducts(1, v || "");
          }}
          options={PRODUCT_CATEGORIES.map(c => ({ value: c, label: c }))}
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {products.map(p => {
            const qty = getQty(p._id);

            return (
              <div key={p._id} className="bg-white rounded-xl shadow overflow-hidden">

                <div className="h-48 bg-gray-100">
                  <img src={p.imageUrl} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 space-y-2">

                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>

                  <p className="font-bold text-xl">₹{p.retailerPrice}</p>

                  <p className="text-xs text-gray-500">
                    {p.uomQuantity} {p.uom}
                  </p>

                  {qty === 0 ? (
                    <Button
                      type="primary"
                      className="w-full bg-[#313860]"
                      onClick={() => add(p._id)}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between border rounded-lg">

                      <button
                        className="px-4 py-2 text-lg"
                        onClick={() => updateQty(p._id, qty - 1)}
                      >
                        −
                      </button>

                      <span className="font-semibold">{qty}</span>

                      <button
                        className="px-4 py-2 text-lg"
                        onClick={() => updateQty(p._id, qty + 1)}
                      >
                        +
                      </button>

                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-8 gap-3">
        {Array.from({ length: Math.ceil(total / 10) }).map((_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${
              page === i + 1 ? "bg-[#313860] text-white" : "bg-white border"
            }`}
            onClick={() => fetchProducts(i + 1, category)}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}

import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { Button } from "antd";
import UserLayout from "../components/UserLayout";

export default function Cart() {
  const [cart, setCart] = useState(null);

  const load = async () => {
    const res = await apiFetch("/api/shop/cart");
    setCart(await res.json());
  };

  useEffect(() => { load(); }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    await apiFetch(`/api/shop/cart/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: qty })
    });
    load();
  };

  const removeItem = async id => {
    await apiFetch(`/api/shop/cart/remove/${id}`, { method: "DELETE" });
    load();
  };

  if (!cart?.items?.length)
    return <p className="text-center text-gray-500 mt-20">Your cart is empty</p>;

  const total = cart.items.reduce(
    (s, i) => s + i.priceSnapshot * i.quantity,
    0
  );

  return (
    <UserLayout>
    <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">

      {/* ITEMS */}
      <div className="col-span-2 space-y-4">

        {cart.items.map(i => (
          <div
            key={i.product._id}
            className="bg-white rounded-xl shadow p-4 flex gap-4"
          >
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
              <img
                src={i.product.imageUrl}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-semibold">{i.product.name}</h3>
              <p className="text-sm text-gray-500">{i.product.category}</p>
              <p className="font-bold">₹{i.priceSnapshot}</p>

              <div className="flex items-center gap-3 mt-2">

                <div className="flex items-center border rounded-lg overflow-hidden">

                  <button
                    className="px-3 py-1"
                    onClick={() => updateQty(i.product._id, i.quantity - 1)}
                  >
                    −
                  </button>

                  <span className="px-4 font-semibold">
                    {i.quantity}
                  </span>

                  <button
                    className="px-3 py-1"
                    onClick={() => updateQty(i.product._id, i.quantity + 1)}
                  >
                    +
                  </button>

                </div>

                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeItem(i.product._id)}
                >
                  Remove
                </button>

              </div>
            </div>

            <div className="font-bold text-lg">
              ₹{i.priceSnapshot * i.quantity}
            </div>
          </div>
        ))}

      </div>

      {/* SUMMARY */}
      <div className="bg-white rounded-xl shadow p-6 h-fit space-y-4">

        <h2 className="text-xl font-semibold">Order Summary</h2>

        <div className="flex justify-between">
          <span>Items</span>
          <span>{cart.items.length}</span>
        </div>

        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">₹{total}</span>
        </div>

        <Button
          type="primary"
          className="bg-[#313860] w-full"
          onClick={checkout}
        >
          Checkout
        </Button>

      </div>

    </div>
    </UserLayout>
  );
}

async function checkout() {
  await apiFetch("/api/shop/checkout", { method: "POST" });
  alert("Order placed successfully");
  window.location.href = "/shop";
}

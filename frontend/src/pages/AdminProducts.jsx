import { Table, Image, Tag, Button, Modal, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import AdminLayout from "../components/AdminLayout";
import { PRODUCT_CATEGORIES } from "../constants/categories";
import { PRODUCT_UOMS } from "../constants/uom";

export default function AdminProducts() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: null,
    mrp: "",
    distributorPrice: "",
    retailerPrice: "",
    stock: "",
    uom: null,
    uomQuantity: "",
    crt: "",
    imageUrl: "",
  });

  const fetchProducts = async (p = 1, cat = "") => {
    setLoading(true);

    const url = cat
      ? `/api/shop/products?page=${p}&category=${cat}`
      : `/api/shop/products?page=${p}`;

    const res = await apiFetch(url);
    const d = await res.json();

    setData(d.products);
    setTotal(d.total);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: null,
      mrp: "",
      distributorPrice: "",
      retailerPrice: "",
      stock: "",
      uom: null,
      uomQuantity: "",
      crt: "",
      imageUrl: "",
    });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      mrp: p.mrp,
      distributorPrice: p.distributorPrice,
      retailerPrice: p.retailerPrice,
      stock: p.stock,
      uom: p.uom,
      uomQuantity: p.uomQuantity,
      crt: p.crt,
      imageUrl: p.imageUrl,
    });
    setOpen(true);
  };

  const submit = async () => {
    const payload = { ...form };

    if (!payload.category || !payload.uom)
      return message.error("Select category & UOM");

    if (editing) {
      await apiFetch(`/api/shop/product/${editing._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      message.success("Updated");
    } else {
      await apiFetch("/api/shop/product", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      message.success("Created");
    }

    setOpen(false);
    fetchProducts(page, categoryFilter);
  };

  const deleteProduct = async (id) => {
    await apiFetch(`/api/shop/product/${id}`, { method: "DELETE" });
    message.success("Deleted");
    fetchProducts(page, categoryFilter);
  };

  const columns = [
    {
      title: "Image",
      render: (r) => (
        <div
          style={{
            width: 60,
            height: 60,
            overflow: "hidden",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
          }}
        >
          <img
            src={r.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt=""
          />
        </div>
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category", render: (c) => <Tag>{c}</Tag> },
    { title: "MRP", dataIndex: "mrp" },
    { title: "Retailer", dataIndex: "retailerPrice" },
    { title: "Stock", dataIndex: "stock" },
    { title: "UOM", render: (r) => `${r.uomQuantity} ${r.uom}` },
    {
      title: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => openEdit(r)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => deleteProduct(r._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout selected="/shop">
      <div className="flex justify-between mb-4">
        <Select
          placeholder="Filter by category"
          style={{ width: 220 }}
          allowClear
          value={categoryFilter || null}
          onChange={(v) => {
            setCategoryFilter(v || "");
            fetchProducts(1, v || "");
          }}
          options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        <Button type="primary" className="bg-[#313860]" onClick={openCreate}>
          + Create Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => fetchProducts(p, categoryFilter),
          showSizeChanger: false,
        }}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText={editing ? "Update" : "Create"}
        title={editing ? "Edit Product" : "Create Product"}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />

          <Select
            placeholder="Category"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />

          <Input
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            placeholder="MRP"
          />
          <Input
            value={form.distributorPrice}
            onChange={(e) =>
              setForm({ ...form, distributorPrice: e.target.value })
            }
            placeholder="Distributor Price"
          />

          <Input
            value={form.retailerPrice}
            onChange={(e) =>
              setForm({ ...form, retailerPrice: e.target.value })
            }
            placeholder="Retailer Price"
          />
          <Input
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
          />

          <Select
            placeholder="UOM"
            value={form.uom}
            onChange={(v) => setForm({ ...form, uom: v })}
            options={PRODUCT_UOMS.map((u) => ({ value: u, label: u }))}
          />

          <Input
            value={form.uomQuantity}
            onChange={(e) => setForm({ ...form, uomQuantity: e.target.value })}
            placeholder="UOM Qty"
          />

          <Input
            value={form.crt}
            onChange={(e) => setForm({ ...form, crt: e.target.value })}
            placeholder="CRT"
          />

          <Input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="Image URL"
            className="col-span-2"
          />
        </div>
      </Modal>
    </AdminLayout>
  );
}

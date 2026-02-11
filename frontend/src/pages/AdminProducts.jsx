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
  const [categoryFilter, setCategoryFilter] = useState("");

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

  const createProduct = async e => {
    e.preventDefault();
    const f = e.target;

    await apiFetch("/api/shop/product", {
      method: "POST",
      body: JSON.stringify({
        name: f.name.value,
        category: f.category.value,
        mrp: f.mrp.value,
        distributorPrice: f.distributor.value,
        retailerPrice: f.retailer.value,
        uom: f.uom.value,
        uomQuantity: f.qty.value,
        crt: f.crt.value,
        stock: f.stock.value,
        imageUrl: f.image.value
      })
    });

    message.success("Product created");
    setOpen(false);
    fetchProducts(page, categoryFilter);
  };

  const columns = [
    {
      title: "Image",
      render: r => <Image width={50} src={r.imageUrl} />
    },
    { title: "Name", dataIndex: "name" },
    {
      title: "Category",
      dataIndex: "category",
      render: c => <Tag color="blue">{c}</Tag>
    },
    { title: "MRP", dataIndex: "mrp" },
    { title: "Retailer", dataIndex: "retailerPrice" },
    { title: "Stock", dataIndex: "stock" },
    {
      title: "UOM",
      render: r => `${r.uomQuantity} ${r.uom}`
    }
  ];

  return (
    <AdminLayout selected="/shop">

      <div className="flex justify-between mb-4">
        <Select
          placeholder="Filter by category"
          style={{ width: 220 }}
          allowClear
          onChange={v => {
            setCategoryFilter(v);
            fetchProducts(1, v || "");
          }}
          options={PRODUCT_CATEGORIES.map(c => ({ value: c }))}
        />

        <Button
          type="primary"
          className="bg-[#313860]"
          onClick={() => setOpen(true)}
        >
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
          onChange: p => fetchProducts(p, categoryFilter),
          showSizeChanger: false
        }}
      />

      {/* CREATE PRODUCT MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Create Product"
      >
        <form onSubmit={createProduct} className="grid grid-cols-2 gap-3">

          <Input name="name" placeholder="Name" />
          <Select name="category" options={PRODUCT_CATEGORIES.map(c => ({ value:c }))} />

          <Input name="mrp" placeholder="MRP" />
          <Input name="distributor" placeholder="Distributor Price" />

          <Input name="retailer" placeholder="Retailer Price" />
          <Input name="stock" placeholder="Stock" />

          <Select name="uom" options={PRODUCT_UOMS.map(u => ({ value:u }))} />
          <Input name="qty" placeholder="UOM Quantity" />

          <Input name="crt" placeholder="CRT" />

          <Input name="image" placeholder="Image URL" className="col-span-2" />

          <Button
            htmlType="submit"
            type="primary"
            className="bg-[#313860] col-span-2"
          >
            Create
          </Button>

        </form>
      </Modal>

    </AdminLayout>
  );
}

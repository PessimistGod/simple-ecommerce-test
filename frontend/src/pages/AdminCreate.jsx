import { Input, Button, Select, message } from "antd";
import AdminLayout from "../components/AdminLayout";
import { apiFetch } from "../services/api";
import { PRODUCT_CATEGORIES } from "../constants/categories";
import { PRODUCT_UOMS } from "../constants/uom";

export default function AdminCreate() {

  const submit = async e => {
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
    e.target.reset();
  };

  return (
    <AdminLayout selected="/admin/create">

      <form onSubmit={submit} className="grid grid-cols-2 gap-4 max-w-3xl">

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

        <Button type="primary" htmlType="submit" className="col-span-2 bg-[#313860]">
          Create Product
        </Button>

      </form>

    </AdminLayout>
  );
}

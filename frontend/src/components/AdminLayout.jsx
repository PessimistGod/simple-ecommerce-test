import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  PlusOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

export default function AdminLayout({ children, selected }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Sider theme="dark">
        <h2 className="text-white text-center py-4 text-xl">Admin</h2>

        <Menu
          theme="dark"
          selectedKeys={[selected]}
          onClick={i => nav(i.key)}
          items={[
            { key: "/shop", icon: <AppstoreOutlined />, label: "Products" },
            { key: "/admin/create", icon: <PlusOutlined />, label: "Create Product" },
            { key: "logout", icon: <LogoutOutlined />, label: "Logout", onClick: logout }
          ]}
        />
      </Sider>

      <Content className="bg-gray-100 p-6">
        {children}
      </Content>

    </Layout>
  );
}

import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { FileImageOutlined, HomeOutlined } from "@ant-design/icons";
import Viewer from "./components/Viewer";

const { Header, Content, Sider } = Layout;

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("home");

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem.key);
  };

  const isHomeSelected = selectedMenuItem === "home";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: "32px", margin: "16px" }} />
        <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuItem]} onClick={handleMenuItemClick}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="viewer" icon={<FileImageOutlined />}>
            Image Viewer
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {isHomeSelected && <h1>Welcome to the Home Page!</h1>}
            {!isHomeSelected && <Viewer />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
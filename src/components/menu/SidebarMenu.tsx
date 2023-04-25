import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import { FileImageOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";

const SidebarMenu: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("home");
  const history = useHistory();

  const handleMenuItemClick = (e: any) => {
    setSelectedMenuItem(e.key);

    switch (e.key) {
      case "home":
        history.push("/");
        break;
      case "viewer":
        history.push("/viewer");
        break;
      case "bookmarks":
        history.push("/bookmarks");
        break;
      default:
        break;
    }
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedMenuItem]}
      onClick={handleMenuItemClick}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>
      <Menu.Item key="viewer" icon={<FileImageOutlined />}>
        Image Viewer
      </Menu.Item>
      <Menu.Item key="bookmarks" icon={<BookOutlined />}>
        Bookmarks
      </Menu.Item>
    </Menu>
  );
};

export default SidebarMenu;

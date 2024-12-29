import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useContext } from "react";
const { Header, Sider, Footer, Content } = Layout;
import logo from "/logo.png";

import routeItems from "../RouteItems/RouteItems";

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
  zIndex: 11,
};

// Debounce function to reduce frequent state updates
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const CustomLayout = ({ pageTitle, menuKey, children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toggleNav();
    navigate("/login");
  };

  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 1024 ? true : false
  );
  const [isSmallDevice, setSmallDevice] = useState(false);

  // Memoize menu items to avoid re-rendering
  const menuItems = useMemo(() => routeItems, []);

  // Handle screen resizing and set small device state
  useEffect(() => {
    const handleResize = debounce(() => {
      setSmallDevice(window.innerWidth < 1024);
    }, 200); // Debounce by 200ms

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to top and set document title based on the page title
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.title = `SkyBlue | ${pageTitle}`;
  }, [pageTitle]);

  // Memoize toggleCollapsed function to avoid unnecessary re-renders
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prevState) => !prevState);
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const paddingValue = isSmallDevice ? 10 : 24; // Improved readability
  const marginInlineStart = isSmallDevice ? 0 : collapsed ? 80 : 250; // Dynamic margin for responsiveness

  // Determine which submenu should be open based on active menuKey
  const getDefaultOpenKeys = (key) => {
    const submenuKeys = {
      sub1: ["2", "3", "4", "5"],
      sub2: ["7", "8", "9"],
      sub3: ["10", "11", "12", "13"],
      sub4: ["14", "15", "16", "17"],
      sub5: ["18", "19"],
      sub6: ["6", "20"],
    };
    for (const submenu in submenuKeys) {
      if (submenuKeys[submenu].includes(key)) {
        return [submenu]; // Open this submenu
      }
    }
    return [];
  };

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (routeItems.some((item) => item.key === latestOpenKey)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }
  };

  const [openKeys, setOpenKeys] = useState(
    isSmallDevice || collapsed ? [] : getDefaultOpenKeys(menuKey)
  );

  // Close menu when collapsed or on a small device
  useEffect(() => {
    if (isSmallDevice || collapsed) {
      setOpenKeys([]);
    } else {
      setOpenKeys(getDefaultOpenKeys(menuKey));
    }
  }, [isSmallDevice, collapsed, menuKey]);

  return (
    <Layout
      style={{
        background: "#001529",
      }}
      hasSider
    >
      <Sider
        trigger={null}
        collapsible
        collapsedWidth={isSmallDevice ? 0 : 80}
        collapsed={collapsed}
        width={250}
        style={siderStyle}
      >
        <div
          style={{
            color: "#87CEEB",
            padding: "20px 0px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "80%",
            }}
            src={logo}
            alt="Logo"
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={menuKey}
          openKeys={openKeys} // Control open keys
          onOpenChange={handleOpenChange} // Handle menu open changes
          items={menuItems}
        />
      </Sider>
      <Layout
        style={{
          background: "#F1FBFF",
          marginInlineStart: marginInlineStart,
          transition: "margin-inline-start 0.2s ease", // Smooth transition
        }}
      >
        <Header
          style={{
            background: "#001529",
            position: "fixed",
            right: "0",
            width: isSmallDevice
              ? "100%"
              : collapsed
              ? "calc(100% - 80px)"
              : "calc(100% - 250px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px 0 0",
            zIndex: 10,
            transition: "width 0.2s ease",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              marginInlineStart: isSmallDevice ? (collapsed ? 0 : 250) : 0,
              transition: "margin-inline-start 0.5s ease", // Smooth transition
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
          {!(isSmallDevice && !collapsed) && (
            <Button type="primary" size="small" danger onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Header>
        <Content
          style={{
            margin: isSmallDevice ? "78px 5px 0px 5px" : "78px 16px 0px 16px",
            overflow: "initial",
          }}
        >
          <div
            style={{
              minHeight: "calc(100vh - 147px)",
              padding: paddingValue,
              background: "#fff",
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            background: "#F1FBFF",
            textAlign: "center",
          }}
        >
          SkyBlue Wholesale ©2024 Created by ByteSync Studio
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;

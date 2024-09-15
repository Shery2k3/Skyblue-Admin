import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
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
};

const CustomLayout = ({ pageTitle, menuKey, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(80)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsedWidth(0);
      } else {
        setCollapsedWidth(80);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.title = `SkyBlue | ${pageTitle}`;

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 867);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageTitle]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsedWidth={collapsedWidth}
        collapsed={collapsed}
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
          items={routeItems}
        />
      </Sider>
      <Layout
        style={{
          background: "#F1FBFF",
          marginInlineStart: collapsed ? collapsedWidth : 200,
          transition: "margin-inline-start 0.3s ease", // Smooth transition
        }}
      >
        <Header
          style={{
            background: "#001529",
            position: "fixed",
            width: "100%",
            padding: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
        </Header>
        <Content
          style={{
            margin: "78px 16px 0px 16px",
            overflow: "initial",
          }}
        >
          <div
            style={{
              minHeight: "calc(100vh - 147px)",
              padding: 24,
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

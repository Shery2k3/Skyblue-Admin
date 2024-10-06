import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const CurrentCarts = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Current Carts" menuKey="8">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Current Carts
      </Title>
    </CustomLayout>
  );
};

export default CurrentCarts;

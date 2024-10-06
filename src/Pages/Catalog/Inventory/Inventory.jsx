import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const Inventory = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Inventory" menuKey="5">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Inventory
      </Title>
    </CustomLayout>
  );
};

export default Inventory;

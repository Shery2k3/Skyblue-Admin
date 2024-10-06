import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const OrderSheet = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Order Sheet" menuKey="17">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Order Sheet
      </Title>
    </CustomLayout>
  );
};

export default OrderSheet;

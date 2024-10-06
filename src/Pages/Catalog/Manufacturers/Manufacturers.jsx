import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const Manufacturers = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Manufacturers" menuKey="4">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Manufacturers
      </Title>
    </CustomLayout>
  );
};

export default Manufacturers;

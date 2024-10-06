import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const Flyer = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Flyer" menuKey="16">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Flyer
      </Title>
    </CustomLayout>
  );
};

export default Flyer;

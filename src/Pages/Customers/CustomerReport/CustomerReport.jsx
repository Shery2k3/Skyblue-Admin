import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const CustomerReport = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Customers Report" menuKey="12">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Customers Report
      </Title>
    </CustomLayout>
  );
};

export default CustomerReport;

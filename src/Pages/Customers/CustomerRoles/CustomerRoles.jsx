import React from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";

const CustomerRoles = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Customer Roles" menuKey="11">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Customer Roles
      </Title>
    </CustomLayout>
  );
};

export default CustomerRoles;

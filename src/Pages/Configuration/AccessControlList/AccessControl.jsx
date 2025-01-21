import React, { useState, useEffect } from "react";
import { Table, Typography, Spin, Row, Col, message, Checkbox } from "antd";
import axiosInstance from "../../../Api/axiosConfig";
import API_BASE_URL from "../../../constants";
import CustomLayout from "../../../Components/Layout/Layout";

const { Title } = Typography;

const AccessControl = () => {
  const [customerRoles, setCustomerRoles] = useState([]);
  const [permissionRecords, setPermissionRecords] = useState([]);
  const [permissionRoleMappings, setPermissionRoleMappings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/admin/content-management/access-list-control`
        );
        const result = response.data.data;
        if (result.success) {
          setCustomerRoles(result.CustomerRoles);
          setPermissionRecords(result.PermissionRecords);
          setPermissionRoleMappings(result.PermissionRoleMappings);
        } else {
          message.error("Failed to fetch access control data");
        }
      } catch (error) {
        console.error("Error fetching access control data:", error);
        message.error("Error fetching access control data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if a permission is mapped to a role
  const isPermissionMapped = (permissionId, roleId) => {
    return permissionRoleMappings.some(
      (mapping) =>
        mapping.PermissionId === permissionId && mapping.RoleId === roleId
    );
  };

  // Handle checkbox toggle (placeholder for now)
  const handleCheckboxChange = (permissionId, roleId, checked) => {
    console.log(
      `PermissionId: ${permissionId}, RoleId: ${roleId}, Checked: ${checked}`
    );
    // Update logic here (e.g., API call to update the mapping)
  };

  // Table columns
  const columns = [
    {
      title: "Permission Name",
      dataIndex: "PermissionName",
      key: "PermissionName",
      render: (text) => <span>{text}</span>,
    },
    ...customerRoles.map((role) => ({
      title: role.RoleName,
      dataIndex: role.RoleSystemName,
      key: role.RoleId,
      render: (_, record) => (
        <Checkbox
          checked={isPermissionMapped(record.PermissionId, role.RoleId)}
          onChange={(e) =>
            handleCheckboxChange(
              record.PermissionId,
              role.RoleId,
              e.target.checked
            )
          }
        />
      ),
    })),
  ];

  const dataSource = permissionRecords.map((permission) => ({
    key: permission.PermissionId,
    PermissionId: permission.PermissionId,
    PermissionName: permission.PermissionName,
  }));

  return (
    <CustomLayout pageTitle="AccessControl List" menuKey="22">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Access Control List
      </Title>
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              bordered
              pagination={false}
              scroll={{ x: true }}
            />
          </Col>
        </Row>
      </div>
    </CustomLayout>
  );
};

export default AccessControl;

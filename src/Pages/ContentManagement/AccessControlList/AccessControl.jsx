import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, Row, Col, message } from 'antd';
import axiosInstance from '../../../Api/axiosConfig';
import API_BASE_URL from '../../../constants';

const { Title } = Typography;

const AccessControl = () => {
  const [customerRoles, setCustomerRoles] = useState([]);
  const [permissionRecords, setPermissionRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/admin/content-management/access-list-control`);
        const result = response.data.data;
        if (result.success) {
          setCustomerRoles(result.CustomerRoles);
          setPermissionRecords(result.PermissionRecords);
        } else {
          message.error("Failed to fetch access control data");
        }
      } catch (error) {
        console.error('Error fetching access control data:', error);
        message.error("Error fetching access control data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Permission Name',
      dataIndex: 'PermissionName',
      key: 'PermissionName',
      render: (text) => <span>{text}</span>,
    },
    ...customerRoles.map((role) => ({
      title: role.RoleName,
      dataIndex: role.RoleSystemName,
      key: role.RoleId,
      render: () => <span>-</span>, // Placeholder for future mapping
    })),
  ];

  const dataSource = permissionRecords.map((permission) => ({
    key: permission.PermissionId,
    PermissionName: permission.PermissionName,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Access Control</Title>
        </Col>
      </Row>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={dataSource}
              bordered
              pagination={false}
              scroll={{ x: true }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AccessControl;

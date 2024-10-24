import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import API_BASE_URL from "../../../constants.js";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import {
  Table,
  Button,
  Modal,
  Checkbox,
  message,
  Input,
  Typography,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";

const CustomerRoles = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);

  const { Title } = Typography;
  const { confirm } = Modal;
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();

  const fetchCustomerRoles = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/roles`)
      );
      const data = response.data.map((role) => ({
        key: role.Id,
        id: role.Id,
        name: role.Name,
        freeShipping: role.FreeShipping,
        taxExempt: role.TaxExempt,
        systemRole: role.IsSystemRole,
        active: role.Active,
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching bestseller data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerRoles();
  }, [retryRequest]);

  const handleAdd = () => {
    setName("");
    setIsActive(false);
    setAddModal(true);
  };

  const handleEdit = (Role) => {
    setSelectedRole(Role);
    setName(Role.name);
    setIsActive(Role.active);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAddModal(false);
  };

  const addRole = async () => {
    if (!name) {
      message.error("Please provide all necessary details");
      return;
    }

    try {
      const payload = {
        Name: name,
        Active: isActive,
      };
      await axiosInstance.post(`${API_BASE_URL}/admin/roles/`, payload);
      message.success("Role added successfully");
      fetchCustomerRoles();
      setAddModal(false);
    } catch (error) {
      console.error("Error adding Role: ", error);
      message.error("Failed to add Role");
    }
  };

  const handleOk = async () => {
    const payload = {};
    if (isActive !== selectedRole.active) {
      payload.Active = isActive;
    }
    if (name !== selectedRole.name) {
      payload.Name = name;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/roles/${selectedRole.id}`,
          payload
        );
        message.success("Role updated successfully");
        fetchCustomerRoles();
      } catch (error) {
        console.error("Error updating Role:", error);
        message.error("Failed to update Role");
      }
    }

    setIsModalVisible(false);
  };

  const handleDelete = (record) => {
    confirm({
      centered: true,
      title: "Are you sure you want to delete this Role?",
      content: `Name: ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axiosInstance.delete(`${API_BASE_URL}/admin/roles/${record.id}`);
          message.success("Role deleted successfully");
          fetchCustomerRoles(); 
        } catch (error) {
          console.error("Error deleting Role:", error);
          message.error("Failed to delete Role");
        }
      },
    });
  };

  const handleTableChange = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Free Shipping",
      dataIndex: "freeShipping",
      key: "freeShipping",
      align: "center",
      render: (freeShipping) =>
        freeShipping ? (
          <CheckCircleFilled style={{ fontSize: "24px", color: "#007FCC" }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: "24px", color: "#FF4D4F" }} />
        ),
    },
    {
      title: "Tax Exempt",
      dataIndex: "taxExempt",
      key: "taxExempt",
      align: "center",
      render: (taxExempt) =>
        taxExempt ? (
          <CheckCircleFilled style={{ fontSize: "24px", color: "#007FCC" }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: "24px", color: "#FF4D4F" }} />
        ),
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (active) =>
        active ? (
          <CheckCircleFilled style={{ fontSize: "24px", color: "#007FCC" }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: "24px", color: "#FF4D4F" }} />
        ),
    },
    {
      title: "Is system role",
      dataIndex: "systemRole",
      key: "systemRole",
      align: "center",
      render: (systemRole) =>
        systemRole ? (
          <CheckCircleFilled style={{ fontSize: "24px", color: "#007FCC" }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: "24px", color: "#FF4D4F" }} />
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="primary" onClick={() => handleDelete(record)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Customer Roles" menuKey="11">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Customer Roles
      </Title>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" size={buttonSize} onClick={handleAdd}>
          Add Role
        </Button>
      </div>
      <br />
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
      />

      {/*To Edit an already existing vendor*/}
      <Modal
        centered
        title="Edit Vendor"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <Checkbox
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        >
          Active
        </Checkbox>
      </Modal>

      {/*To add a new vendor*/}
      <Modal
        centered
        title="Add Vendor"
        open={isAddModalVisible}
        onOk={addRole}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <Checkbox
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        >
          Active
        </Checkbox>
      </Modal>
    </CustomLayout>
  );
};

export default CustomerRoles;

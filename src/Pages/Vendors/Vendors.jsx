import React, { useState, useEffect } from "react";
import CustomLayout from "../../Components/Layout/Layout";
import {
  Table,
  Button,
  Modal,
  Checkbox,
  message,
  Input,
  Tag,
  Typography,
} from "antd";
import useResponsiveButtonSize from "../../Components/ResponsiveSizes/ResponsiveSize";
import API_BASE_URL from "../../constants.js";
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const Vendors = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const { Title } = Typography;
  const { Search } = Input; // Add this line

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (query = "") => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/vendors`, {
          params: { name: query },
        })
      );
      const data = response.data.data.map((vendor) => ({
        key: vendor.Id,
        id: vendor.Id,
        name: vendor.Name,
        email: vendor.Email,
        active: vendor.Active,
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const addVendor = async () => {
    if (!name || !email) {
      message.error("Please provide all necessary details");
      return;
    }

    try {
      const payload = {
        name: name,
        email: email,
        active: isActive,
        description: "Vendor Description",
        adminComment: "Admin Comment",
        displayOrder: 0,
        metaKeywords: "keywords",
        metaDescription: "meta description",
        metaTitle: "meta title",
        pageSize: 10,
        allowCustomersToSelectPageSize: false,
        pageSizeOptions: "10,20,50",
      };
      await axiosInstance.post(`${API_BASE_URL}/admin/create-vendors`, payload);
      message.success("Vendor added successfully");
      fetchVendors();
      setAddModal(false);
    } catch (error) {
      console.error("Error adding vendor: ", error);
      message.error("Failed to add Vendor");
    }
  };

  const handleAdd = () => {
    setName("");
    setEmail("");
    setIsActive(false);
    setAddModal(true);
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setName(vendor.name);
    setIsActive(vendor.active);
    setEmail(vendor.email);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const payload = {};
    if (isActive !== selectedVendor.active) {
      payload.active = isActive;
    }
    if (name !== selectedVendor.name) {
      payload.name = name;
    }
    if (email !== selectedVendor.email) {
      payload.email = email;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/editvendor/${selectedVendor.id}`,
          payload
        );
        message.success("Vendor updated successfully");
        fetchVendors();
      } catch (error) {
        console.error("Error updating Vendor:", error);
        message.error("Failed to update Vendor");
      }
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAddModal(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (active) =>
        active ? (
          <Tag color="green">{"ACTIVE"}</Tag>
        ) : (
          <Tag color="volcano">{"INACTIVE"}</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Vendors" menuKey="6">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Vendors
      </Title>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Search
          placeholder="Search by name"
          enterButton="Search"
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={() => fetchVendors(searchQuery)}
          style={{ maxWidth: 400 }}
        />
      </div>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" size={buttonSize} onClick={handleAdd}>
          Add Vendor
        </Button>
      </div>
      <br />
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />

      {/*To Edit an already existing vendor*/}
      <Modal
        centered
        title="Edit Vendor"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        >
          Active
        </Checkbox>
        <br />
        <br />
        <Input
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>

      {/*To add a new vendor*/}
      <Modal
        centered
        title="Add Vendor"
        open={isAddModalVisible}
        onOk={addVendor}
        onCancel={handleCancel}
      >
        <Checkbox
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        >
          Active
        </Checkbox>
        <br />
        <br />
        <Input
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Vendors;

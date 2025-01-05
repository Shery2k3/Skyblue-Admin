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
  Spin,
} from "antd";
import useResponsiveButtonSize from "../../Components/ResponsiveSizes/ResponsiveSize";
import API_BASE_URL from "../../constants.js";
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const navigate = useNavigate();

  const { Title } = Typography;
  const { Search } = Input;

  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setAddModal] = useState(false);

  //Add Vendor States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (query = "") => {
    setLoading(true); // Set loading to true before fetching
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
    } finally {
      setLoading(false); // Set loading to false after fetching
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
        description: description,
        adminComment: adminComment,
        displayOrder: displayOrder,
        metaKeywords: "",
        metaDescription: "",
        metaTitle: "",
        pageSize: 10,
        allowCustomersToSelectPageSize: false,
        pageSizeOptions: "10,20,50",
      };
      console.log("Payload:", payload);
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
    setDescription("");
    setAdminComment("");
    setDisplayOrder(0);
    setIsActive(false);
    setAddModal(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAddModal(false);
  };

  const handleTableChange = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleViewProduct = (vendorId) => {
    navigate(`/vendors/viewproduct/${vendorId}`);
  };

  const handleEdit = (vendor) => {
    navigate(`/vendors/edit/${vendor.id}`);
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
        <div>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            size={buttonSize}
            style={{ marginLeft: 8 }}
            onClick={() => handleViewProduct(record.id)}
          >
            View Product
          </Button>
        </div>
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
      <Spin spinning={loading}>
        {" "}
        {/* Wrap Table with Spin */}
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
        />
      </Spin>

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
        <br />
        <br />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Admin Comment"
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Display Order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Vendors;

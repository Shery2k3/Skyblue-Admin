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
  Tabs, // Import Spin component
} from "antd";
import useResponsiveButtonSize from "../../Components/ResponsiveSizes/ResponsiveSize";
import API_BASE_URL from "../../constants.js";
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [description, setDescription] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [isSeoModalVisible, setSeoModalVisible] = useState(false);

  // Address States
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  //Edit Vendor States

  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const [loading, setLoading] = useState(false); // Add loading state

  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const { Title } = Typography;
  const { Search } = Input; // Add this line

  const navigate = useNavigate();

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

  const handleEdit = (vendor) => {
    console.log("handle Save", vendor);
    navigate(`/vendors/edit/${vendor.id}`);

    // setSelectedVendor(vendor);
    // setName(vendor.name);
    // setIsActive(vendor.active);
    // setEmail(vendor.email);
    // setDescription(vendor.description);
    // setAdminComment(vendor.adminComment);
    // setDisplayOrder(vendor.displayOrder);
    // setIsModalVisible(true);

    // // Mock data for address; replace with fetched data if necessary
    // setAddressLine1("123 Main St");
    // setCity("New York");
    // setState("NY");
    // setPostalCode("10001");
    // setIsModalVisible(true);
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

  const handleTableChange = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSeo = (vendor) => {
    setSelectedVendor(vendor);
    setMetaTitle(vendor.name);
    setSeoModalVisible(true);
  };

  const handleSeoSave = () => {
    console.log({
      metaTitle,
      metaKeywords,
      metaDescription,
    });
    setSeoModalVisible(false);
  };

  const handleViewProduct = (vendorId) => {
    console.log("Vendor ID:", vendorId);
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
          <Button size={buttonSize} onClick={() => handleSeo(record)}>
            SEO
          </Button>
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

  const handleAddressSave = async () => {
    const payload = {
      addressLine1: addressLine1,
      city: city,
      state: state,
      postalCode: postalCode,
    };
    console.log("Payload:", payload);
  };

  const handleVendorSave = async () => {
    const payload = {
      name,
      email,
      active: isActive,
    };
    console.log("Payload:", payload);
    //  try {
    //    await axiosInstance.patch(
    //      `${API_BASE_URL}/admin/editvendor/${selectedVendor.id}`,
    //      payload
    //    );
    //    message.success("Vendor updated successfully");
    //    fetchVendors();
    //  } catch (error) {
    //    console.error("Error updating vendor:", error);
    //    message.error("Failed to update vendor");
    //  }
  };

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

      {/*To Edit an already existing vendor*/}
      <Modal
        centered
        title="Edit Vendor"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Edit Vendor" key="1">
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
            <Button type="primary" onClick={handleVendorSave}>
              Save Vendor
            </Button>
          </Tabs.TabPane>
          {/* FOr address edit */}
          <Tabs.TabPane tab="Edit Address" key="2">
            <Input
              placeholder="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
            <br />
            <br />
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <br />
            <br />
            <Input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <br />
            <br />
            <Input
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <br />
            <Button type="primary" onClick={handleAddressSave}>
              Save Address
            </Button>
          </Tabs.TabPane>
        </Tabs>
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

      {/* SEO Modal */}
      <Modal
        centered
        title="Manage SEO"
        open={isSeoModalVisible}
        onOk={handleSeoSave}
        onCancel={() => setSeoModalVisible(false)}
      >
        <Input
          placeholder="Meta Title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Meta Keywords"
          value={metaKeywords}
          onChange={(e) => setMetaKeywords(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Vendors;

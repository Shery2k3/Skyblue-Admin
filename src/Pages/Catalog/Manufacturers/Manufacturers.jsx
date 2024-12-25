// @desc This component includes modals for editing, SEO management, New Manufacturer and viewing manufacturer products.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomLayout from "../../../Components/Layout/Layout";
import {
  Table,
  Button,
  Modal,
  Checkbox,
  message,
  Input,
  Tag,
  Typography,
  Spin, // Import Spin component
  Tooltip,
  Row,
  Col,
} from "antd";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import API_BASE_URL from "../../../constants.js";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";

import { Select } from "antd";

const Manufacturers = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [discounts, setDiscounts] = useState([]);
  const [editDisocunt, setEditDiscount] = useState(false);
  const [roles, setRoles] = useState([]);

  const [metaDescription, setMetaDescription] = useState(""); // Meta fields state
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [seoPageName, setSeoPageName] = useState(""); // Search engine-friendly page name
  const [isSEOModalVisible, setIsSEOModalVisible] = useState(false); // SEO modal visibility state

  const { confirm } = Modal;
  const { Title, Text } = Typography;
  const { TextArea, Search } = Input; // Use Input.Search
  const { Option } = Select;
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const navigate = useNavigate();

  useEffect(() => {
    fetchManufacturers();
    fetchDiscounts();
    fetchCustomerRoles();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await retryRequest(
        () => axiosInstance.get(`${API_BASE_URL}/admin/alldiscounts`) // Fetch all discounts
      );
      // Filter the discounts to only include those with DiscountTypeId 3
      const filteredDiscounts = response.data.filter(
        (discount) => discount.DiscountTypeId === 3
      );
      setDiscounts(filteredDiscounts); // Set the filtered discounts
    } catch (error) {
      console.error("Error fetching discounts:", error);
      message.error("Failed to fetch discounts");
    }
  };

  const fetchManufacturers = async (query = "") => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`, {
          params: { name: query },
        })
      );
      console.log(response.data);
      setDataSource(response.data);

      console.log("datad scoure", dataSource);
    } catch (error) {
      console.error("Error fetching manufacturers data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchCustomerRoles = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get("/admin/roles")
      );
      const data = response.data.map((role) => ({
        id: role.Id,
        name: role.Name,
      }));
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleAdd = () => {
    setName("");
    setDescription("");
    setPublished(false);
    setDisplayOrder(0);
    setIsAddModalVisible(true);
  };

  const addManufacturer = async () => {
    if (!name) {
      message.error("Please provide the name");
      return;
    }

    try {
      const payload = {
        Name: name,
        Description: description,
        Published: published,
        DisplayOrder: displayOrder,
      };
      await axiosInstance.post(`${API_BASE_URL}/admin/manufacturer`, payload);
      message.success("Manufacturer added successfully");
      fetchManufacturers();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Error adding manufacturer: ", error);
      message.error("Failed to add Manufacturer");
    }
  };

  const handleEdit = (manufacturer) => {
    console.log("manufacturer", manufacturer);
    setSelectedManufacturer(manufacturer);
    setName(manufacturer.name);
    setDescription(manufacturer.description);
    setPublished(manufacturer.published);
    setDisplayOrder(manufacturer.displayOrder);
    setEditDiscount(manufacturer.discountId); // Set the discountId
    setIsModalVisible(true);
  };

  const updateManufacturer = async () => {
    const payload = {};
    if (published !== selectedManufacturer.published) {
      payload.Published = published;
    }
    if (name !== selectedManufacturer.name) {
      payload.Name = name;
    }
    if (description !== selectedManufacturer.description) {
      payload.Description = description;
    }
    if (displayOrder !== selectedManufacturer.displayOrder) {
      payload.DisplayOrder = displayOrder || 0;
    }
    if (editDisocunt !== selectedManufacturer.discountId) {
      payload.DiscountId = editDisocunt;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/manufacturer/${selectedManufacturer.id}`,
          payload
        );
        message.success("Manufacturer updated successfully");
        fetchManufacturers();
      } catch (error) {
        console.error("Error updating Manufacturer:", error);
        message.error("Failed to update Manufacturer");
      }
    }

    setIsModalVisible(false);
  };

  const handleDelete = (record) => {
    confirm({
      centered: true,
      title: "Are you sure you want to delete this manufacturer?",
      content: `Name: ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axiosInstance.delete(
            `${API_BASE_URL}/admin/manufacturer/${record.id}`
          );
          message.success("Manufacturer deleted successfully");
          fetchManufacturers();
        } catch (error) {
          console.error("Error deleting manufacturer:", error);
          message.error("Failed to delete manufacturer");
        }
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsAddModalVisible(false);
  };

  const handleView = (Manufacturer) => {
    navigate(`/Manufacturer/products/${Manufacturer.id}`);
  };

  const handleSEOClick = (manufacturer) => {
    console.log("Seo Click", manufacturer);
    // Open SEO modal and pre-fill fields with selected manufacturer data
    setSelectedManufacturer(manufacturer);
    setSeoPageName(manufacturer.name); // Set the search engine-friendly page name
    setMetaDescription(manufacturer.metaDescription); // Set default meta description
    setMetaTitle(manufacturer.metaTitle); // Set default meta title
    setMetaKeywords(manufacturer.metaKeywords); // Empty keywords by default
    setIsSEOModalVisible(true);
  };

  const handleSEOModalCancel = () => {
    setIsSEOModalVisible(false);
  };

  const handleSEOUpdate = async () => {
    const payload = {};

    // Only include fields in the payload if they have been modified
    if (metaDescription !== selectedManufacturer.metaDescription) {
      payload.MetaDescription = metaDescription;
    }
    if (metaTitle !== selectedManufacturer.metaTitle) {
      payload.MetaTitle = metaTitle;
    }
    if (metaKeywords !== selectedManufacturer.metaKeywords) {
      payload.MetaKeywords = metaKeywords;
    }

    // If any field was updated, send the request
    if (Object.keys(payload).length > 0) {
      try {
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/manufacturer/${selectedManufacturer.id}`,
          payload
        );
        message.success("SEO updated successfully");
        fetchManufacturers(); // Refresh manufacturers data
      } catch (error) {
        console.error("Error updating SEO:", error);
        message.error("Failed to update SEO");
      }
    }

    // Close the modal after the update
    setIsSEOModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Published",
      dataIndex: "published",
      key: "published",
      align: "center",
      render: (active) =>
        active ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="volcano">Unpublished</Tag>
        ),
    },
    {
      title: "Display Order",
      dataIndex: "displayOrder",
      key: "displayOrder",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleView(record)} style={{ marginRight: 8 }}>
            View Product
          </Button>
          <Button
            type="primary"
            onClick={() => handleSEOClick(record)}
            style={{ marginRight: 8 }}
          >
            SEO
          </Button>
          <Button type="primary" onClick={() => handleDelete(record)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Manufacturers" menuKey="4">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Manufacturers
      </Title>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Search
          placeholder="Search by name"
          enterButton="Search"
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={() => fetchManufacturers(searchQuery)}
          style={{ maxWidth: 400 }}
        />
      </div>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" size={buttonSize} onClick={handleAdd}>
          Add Manufacturer
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
        />
      </Spin>

      {/* Modal for editing a manufacturer */}
      <Modal
        centered
        title="Edit Manufacturer"
        open={isModalVisible}
        onOk={updateManufacturer}
        onCancel={handleCancel}
      >
        <div style={{ padding: "20px" }}>
          {/* Manufacturer Name */}
          <Row>
            <Col span={24}>
              <Text strong>Manufacturer Name:</Text>
              <Input
                placeholder="Enter Manufacturer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "15px" }}
              />
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col span={24}>
              <Text strong>Description:</Text>
              <TextArea
                rows={5}
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ marginBottom: "15px" }}
              />
            </Col>
          </Row>

          {/* Discount Selection */}
          <Row>
            <Col span={24}>
              <Text strong>Discount:</Text>
              <Tooltip title="Select a discount to apply to this manufacturer. You can manage discounts by selecting discounts on the Promotion menu.">
                <span style={{ cursor: "pointer", marginLeft: 8 }}>?</span>
              </Tooltip>
              <Select
                placeholder="Select Discount"
                value={editDisocunt}
                onChange={(value) => setEditDiscount(value)}
                style={{ width: "100%", marginBottom: "15px" }}
              >
                {discounts.map((discount) => (
                  <Option key={discount.Id} value={discount.Id}>
                    {discount.Name} ${discount.DiscountAmount}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Limited to Customers */}
          <Row>
            <Col span={24}>
              <Text strong>Limited to Customers:</Text>
              <Select
                placeholder="Select Customer Role"
                style={{ width: "100%", marginBottom: "15px" }}
              >
                <Option value="0">All</Option>
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Display Order */}
          <Row>
            <Col span={24}>
              <Text strong>Display Order:</Text>
              <Input
                placeholder="Enter Display Order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                style={{ marginBottom: "15px" }}
              />
            </Col>
          </Row>

          {/* Published Checkbox */}
          <Row>
            <Col span={24}>
              <Checkbox
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                style={{ marginBottom: "15px" }}
              >
                Published
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* SEO Modal */}
      <Modal
        centered
        title="SEO Settings"
        visible={isSEOModalVisible}
        onOk={handleSEOUpdate}
        onCancel={handleSEOModalCancel}
      >
        <Row>
          <Col span={24}>
            <Text strong>Page Name (SEO-Friendly URL):</Text>
            <Input value={seoPageName} disabled />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text strong>Meta Title:</Text>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text strong>Meta Description:</Text>
            <TextArea
              rows={4}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text strong>Meta Keywords:</Text>
            <Input
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>

      {/* Modal for adding a manufacturer */}
      <Modal
        centered
        title="Add Manufacturer"
        open={isAddModalVisible}
        onOk={addManufacturer}
        onCancel={handleCancel}
      >
        <br />
        <Text>Manufacturer Name:</Text>
        <Input
          placeholder="Manufacturer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <Text>Description:</Text>
        <TextArea
          rows={10}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <br />
        <Text>Display Order:</Text>
        <Input
          placeholder="Display Order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
        />
        <br />
        <br />
        <Checkbox
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        >
          Published
        </Checkbox>
      </Modal>
    </CustomLayout>
  );
};

export default Manufacturers;

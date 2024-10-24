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
} from "antd";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import API_BASE_URL from "../../../constants.js";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";

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

  const { confirm } = Modal;
  const { Title, Text } = Typography;
  const { TextArea, Search } = Input; // Use Input.Search
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const navigate = useNavigate();

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async (query = "") => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`, {
          params: { name: query },
        })
      );
      const data = response.data.map((manufacturer) => ({
        key: manufacturer.Id,
        id: manufacturer.Id,
        name: manufacturer.Name,
        description: manufacturer.Description,
        published: manufacturer.Published,
        displayOrder: manufacturer.DisplayOrder,
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching manufacturers data:", error);
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
    setSelectedManufacturer(manufacturer);
    setName(manufacturer.name);
    setDescription(manufacturer.description);
    setPublished(manufacturer.published);
    setDisplayOrder(manufacturer.displayOrder);
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: 'left',
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
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />

      {/* Modal for editing a manufacturer */}
      <Modal
        centered
        title="Edit Manufacturer"
        open={isModalVisible}
        onOk={updateManufacturer}
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

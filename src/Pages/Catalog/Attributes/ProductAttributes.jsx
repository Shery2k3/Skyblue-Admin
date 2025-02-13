import React, { useEffect, useState, useCallback } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Button, message, Table, Modal, Input, Tabs, Popconfirm, Space } from "antd";
import axiosInstance from "../../../Api/axiosConfig";
import API_BASE_URL from "../../../constants";
import useRetryRequest from "../../../Api/useRetryRequest";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { use } from "react";

export const GetUsedProductAttribute = async (attributeId) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/admin/usedBy-ProductAttribute/${attributeId}`
    );

    if (response.status === 200 && response.data.success) {
      return response.data.result;
    } else {
      throw new Error("Failed to fetch used products");
    }
  } catch (error) {
    console.error("Error fetching used products:", error);
    return [];
  }
};

const ProductAttributes = () => {
  const [loading, setLoading] = useState(false);
  const [productAttributes, setProductAttributes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [usedProducts, setUsedProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAttribute, setNewAttribute] = useState({ Name: "", Description: "" });

  const retryRequest = useRetryRequest();

  const fetchProductAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-attributes`)
      );
      if (response?.status === 200) {
        setProductAttributes(response.data.result);
      } else {
        message.error("Failed to fetch product attributes");
      }
    } catch (error) {
      console.error("Error fetching product attributes:", error);
      message.error("Network or server error");
    } finally {
      setLoading(false);
    }
  }, [retryRequest]);

  useEffect(() => {
    fetchProductAttributes();
  }, [fetchProductAttributes]);

  const handleEdit = useCallback(async (attribute) => {
    setEditingAttribute({ ...attribute });
    setIsModalOpen(true);

    try {
      const products = await GetUsedProductAttribute(attribute.Id);
      setUsedProducts(products);
    } catch (error) {
      message.error("Failed to fetch used products");
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/edit-product-attribute/${editingAttribute.Id}`,
          editingAttribute
        )
      );
      message.success("Attribute updated successfully");
      setIsModalOpen(false);
      fetchProductAttributes();
    } catch (error) {
      message.error("Failed to update attribute");
    }
  }, [editingAttribute, fetchProductAttributes, retryRequest]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingAttribute(null);
    setUsedProducts([]);
  }, []);

  const handleDelete = async (attributeId) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/admin/delete-product-attribute/${attributeId}`);
      message.success("Attribute deleted successfully");
      fetchProductAttributes();
    } catch (error) {
      console.error("Error deleting attribute:", error);
      message.error("Failed to delete attribute");
    }
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const columns = [
    { title: "Name", dataIndex: "Name", key: "Name" },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) => stripHtmlTags(text) || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this attribute?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const addNewAttribute = () => {
    setNewAttribute({ Name: "", Description: "" });
    setIsAddModalOpen(true);
  };

  const handleAddSave = async () => {
    if (!newAttribute.Name.trim()) {
      message.error("Name is required");
      return;
    }

    try {
      await axiosInstance.post(
        `${API_BASE_URL}/admin/add-new-product-attribute`,
        newAttribute
      );
      message.success("Attribute added successfully");
      setIsAddModalOpen(false);
      fetchProductAttributes();
    } catch (error) {
      message.error("Failed to add attribute");
    }
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  return (
    <CustomLayout pageTitle="Product Attributes" menuKey="23">
      <h1>Product Attributes</h1>
      <Button type="primary" onClick={addNewAttribute} style={{ marginBottom: 16 }}>
        Add New
      </Button>

      <Table
        columns={columns}
        dataSource={productAttributes}
        loading={loading}
        rowKey="Id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Add New Attribute"
        open={isAddModalOpen}
        onOk={handleAddSave}
        onCancel={handleAddCancel}
      >
        <label>Name:</label>
        <Input
          value={newAttribute.Name}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, Name: e.target.value })
          }
          style={{ marginBottom: 16 }}
        />
        <label>Description:</label>
        <ReactQuill
          theme="snow"
          value={newAttribute.Description}
          onChange={(value) =>
            setNewAttribute({ ...newAttribute, Description: value })
          }
        />
      </Modal>

      <Modal
        title="Edit Attribute"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Info" key="1">
            <label>Name:</label>
            <Input
              value={editingAttribute?.Name}
              onChange={(e) =>
                setEditingAttribute({
                  ...editingAttribute,
                  Name: e.target.value,
                })
              }
              style={{ marginBottom: 16 }}
            />
            <label>Description:</label>
            <ReactQuill
              theme="snow"
              value={editingAttribute?.Description || ""}
              onChange={(value) =>
                setEditingAttribute({ ...editingAttribute, Description: value })
              }
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Used by Product" key="2">
            <ul>
              {usedProducts.length > 0 ? (
                usedProducts.map((product, index) => (
                  <li key={index}>{product.Name}</li> 
                ))
              ) : (
                <p>No products using this attribute</p>
              )}
            </ul>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </CustomLayout>
  );
};

export default ProductAttributes;
import React, { useCallback, useEffect, useState } from "react";
import useRetryRequest from "../../../../Api/useRetryRequest";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import {
  message,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Alert,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const EditProductAttribute = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allAttributes, setAllAttributes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchProductAttributes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/admin/product/attribute-product/${id}`
      );
      if (!response.data?.data?.length) {
        message.info("No product attributes found.");
        setAttributes([]);
        return;
      }
      setAttributes(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      setAttributes([]);
      message.error("Failed to fetch product attributes");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-attributes`)
      );
      if (response?.status === 200) {
        setAllAttributes(response.data.result);
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

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/admin/product/delete-product-attribute/${id}`,
        {
          data: { id: record.id },
        }
      );
      if (!response.data.success) {
        message.error(response.data.message);
        return;
      }
      message.success("Attribute deleted successfully");
      fetchProductAttributes();
    } catch (error) {
      console.error("Error deleting attribute:", error);
      message.error("Failed to delete attribute");
    }
  };

  const handleAddAttribute = async () => {
    try {
      const values = await form.validateFields();
      values.isRequired = values.isRequired || false;
      const response = await retryRequest(() =>
        axiosInstance.post(
          `${API_BASE_URL}/admin/product/add-product-attribute/${id}`,
          values
        )
      );
      if (response.data.success === false) {
        message.error(response.data.message);
        return;
      }
      message.success("Attribute added successfully");
      fetchProductAttributes();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding attribute:", error);
      message.error("Failed to add attribute");
    }
  };

  const handleEdit = (record) => {
    setEditingKey(record.id);
    setEditedData(record);
  };

  const handleChange = (key, value) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditedData({});
  };

  const handleSave = async (record) => {
    try {
      const updatedData = { ...record, ...editedData };
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/product/update-product-attribute/${id}`,
        updatedData
      );
      console.log("response", response);
      if (response?.data?.success) {
        message.success("Product attribute updated successfully");
        fetchProductAttributes();
        setEditingKey(null);
        setEditedData({});
      } else {
        throw new Error(response?.data?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error updating attribute:", error);
      message.error(
        error.response?.data?.message || "Failed to update product attribute"
      );
    }
  };

  useEffect(() => {
    fetchProductAttributes();
    fetchAllAttributes();
  }, [id, fetchAllAttributes]);


  const handleNavigate = (record) => {
    console.log("record", record);
    navigate(`/product/edit/product-attributes/${record.id}`);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        editingKey === record.id ? (
          <Select
            value={editedData.attributeid || record.attributeid}
            onChange={(value) => handleChange("attributeid", value)}
          >
            {allAttributes.map((attr) => (
              <Option key={attr.Id} value={attr.Id}>
                {attr.Name}
              </Option>
            ))}
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "Text Prompt",
      dataIndex: "textPrompt",
      key: "textPrompt",
      render: (text, record) =>
        editingKey === record.id ? (
          <Input
            value={editedData.textPrompt || record.textPrompt}
            onChange={(e) => handleChange("textPrompt", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Is Required",
      dataIndex: "isRequired",
      key: "isRequired",
      render: (value, record) =>
        editingKey === record.id ? (
          <Switch
            checked={editedData.isRequired ?? record.isRequired}
            onChange={(checked) => handleChange("isRequired", checked)}
          />
        ) : value ? (
          "Yes"
        ) : (
          "No"
        ),
    },
    {
      title: "Attribute Value",
      dataIndex: "attributeValues",
      key: "attributeValues",
      render: (_, record) => (
        <div>
          <Button type="default" onClick={() => handleNavigate(record)}>
            Edit
          </Button>
          <span style={{ marginLeft: 8 }}>
            Total Number of Values: {record.valuesLength}
          </span>
        </div>
      ),
    },
    {
      title: "Control Type",
      dataIndex: "attributeControlTypeId",
      key: "attributeControlTypeId",
      render: (value) => (value === 1 ? "Drop-Down" : value),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          {editingKey === record.id ? (
            <>
              <Button type="primary" onClick={() => handleSave(record)}>
                Save
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={() => handleEdit(record)}>
                Edit
              </Button>
              <Button type="danger" onClick={() => handleDelete(record)}>
                Delete
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Product Attributes</h1>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setIsModalVisible(true);
          form.resetFields();
        }}
        disabled={loading}
      >
        Add Attribute
      </Button>

      {loading ? (
        <p>Loading attributes...</p>
      ) : attributes.length === 0 ? (
        <p>No attributes found for this product.</p>
      ) : (
        <Table columns={columns} dataSource={attributes} rowKey="id" scroll={{ x: 'max-content' }}  />
      )}

      <Modal
        title="Add Attribute"
        visible={isModalVisible}
        onOk={handleAddAttribute}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="attribute"
            label="Attribute"
            rules={[{ required: true, message: "Please select an attribute!" }]}
          >
            <Select placeholder="Select an attribute">
              {allAttributes.map((attr) => (
                <Option key={attr.Id} value={attr.Id}>
                  {attr.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="textPrompt"
            label="Text Prompt"
            rules={[{ required: true, message: "Please enter a text prompt!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isRequired"
            label="Is Required"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="controlType"
            label="Control Type"
            rules={[{ required: true, message: "Please select a control type!" }]}
          >
            <Select placeholder="Select a control type">
              <Option value={1}>Drop-Down-List</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditProductAttribute;
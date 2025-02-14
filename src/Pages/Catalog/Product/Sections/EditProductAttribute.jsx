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
} from "antd";
import { useParams } from "react-router-dom";

const { Option } = Select;

const EditProductAttribute = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allAttributes, setallAttributes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchProductAttributes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/admin/product/attribute-product/${id}`
      );
  
      console.log("response", response.data);
  
      if (!response.data?.data?.length) {
        message.info("No product attributes found.");
        setAttributes([]);
        return;
      }
  
      setAttributes(response.data.data); // Fixed: Directly using the array
    } catch (error) {
      console.error(error);
      setAttributes([]); // Reset attributes on error
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
        setallAttributes(response.data.result);
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

  const handleDelete = (record) => {
    //console.log("Delete", record);
    message.success("Deleted successfully");
  };

  const handleEdit = (record) => {
    //console.log("Edit", record);
    message.success("Edit successfully");
  };

  const handleAddAttribute = async () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log("values", values);
        try {
          const response = await retryRequest(
            () =>
              axiosInstance.post(
                `${API_BASE_URL}/admin/product/add-product-attribute/${id}`,
                values
              ) 
          );
          message.success("Attribute added successfully");
          fetchProductAttributes();
          setIsModalVisible(false);
          form.resetFields();
        } catch (error) {
          console.error("Error adding attribute:", error);
          message.error("Failed to add attribute");
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    fetchProductAttributes();
    fetchAllAttributes();
  }, [id]);

  //console.log("allAttributes", allAttributes);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Text Prompt", dataIndex: "textPrompt", key: "textPrompt" },
    {
      title: "Is Required",
      dataIndex: "isRequired",
      key: "isRequired",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Control Type",
      dataIndex: "attributeControlTypeId",
      key: "attributeControlTypeId",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="default"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  //console.log("attributes", allAttributes);
  return (
    <div>
      <h1>Product Attributes</h1>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
        disabled={loading} // Disable while loading
      >
        Add Attribute
      </Button>

      {loading ? (
        <p>Loading attributes...</p>
      ) : (
        <Table columns={columns} dataSource={attributes} rowKey="id" />
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
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="controlType"
            label="Control Type"
            rules={[
              { required: true, message: "Please select a control type!" },
            ]}
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

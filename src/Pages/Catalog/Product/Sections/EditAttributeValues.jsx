import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Switch,
  message,
  Modal,
  Form,
  Radio,
  Select,
  Tooltip,
  InputNumber,
} from "antd";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import useRetryRequest from "../../../../Api/useRetryRequest";
import CustomLayout from "../../../../Components/Layout/Layout";
import { Image } from "antd";

const { Option } = Select;

const EditAttributeValues = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attributeValues, setAttributeValues] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [form] = Form.useForm();
  const retryRequest = useRetryRequest();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [attrResponse, imgResponse] = await Promise.all([
        axiosInstance.get(
          `${API_BASE_URL}/admin/product/get-product-attribute-values/${id}`
        ),
        retryRequest(() =>
          axiosInstance.get(
            `${API_BASE_URL}/admin/product/predefined-attribute-images-product/${id}`
          )
        ),
      ]);

      if (attrResponse.status === 200 && attrResponse.data.success) {
        setAttributeValues(attrResponse.data.result || []);
      } else {
        message.error("Failed to fetch attribute values");
      }

      setExistingImages(imgResponse.data.result || []);
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [id, retryRequest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(
    async (recordId) => {
      try {
        await axiosInstance.delete(
          `${API_BASE_URL}/admin/product/delete-predefined-product-value/${recordId}`
        );
        message.success("Attribute value deleted successfully");
        fetchData();
      } catch {
        message.error("Failed to delete attribute value");
      }
    },
    [fetchData]
  );

  const handleAdd = useCallback(async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const response = await axiosInstance.post(
        `${API_BASE_URL}/admin/product/add-predefined-product-value/${id}`,
        values
      );

      if (response.status === 200 && response.data.success) {
        message.success("Attribute value added successfully");
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to add attribute value");
      }
    } catch {
      message.error("Failed to add attribute value");
    }
  }, [form, id, fetchData]);

  const handleEdit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/product/update-predefined-product-value/${currentRecord.Id}`,
        values
      );

      if (response.status === 200 && response.data.success) {
        message.success("Attribute value updated successfully");
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to update attribute value");
      }
    } catch {
      message.error("Failed to update attribute value");
    }
  }, [form, currentRecord, fetchData]);

  const handleImageChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const selectedImage = existingImages.find(
        (img) => img.pictureId === selectedId
      );
      setPreviewImage(selectedImage ? selectedImage.url : null);
    } else {
      setPreviewImage(null);
    }
  };

  const openEditModal = (record) => {
    setIsEditMode(true);
    setCurrentRecord(record);
    setPreviewImage(record.ImageUrl || null);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = useMemo(
    () => [
      {
        title: "Value Type",
        dataIndex: "AttributeValueTypeId",
        key: "AttributeValueTypeId",
        render: (value) => (value === 0 ? "Simple" : value),
      },
      { title: "Name", dataIndex: "Name", key: "Name" },
      {
        title: "Associated Product",
        dataIndex: "AssociatedProductId",
        key: "AssociatedProductId",
      },
      {
        title: "Price Adjustment",
        dataIndex: "PriceAdjustment",
        key: "PriceAdjustment",
      },
      {
        title: "Weight Adjustment",
        dataIndex: "WeightAdjustment",
        key: "WeightAdjustment",
      },
      {
        title: "Is Preselected",
        dataIndex: "IsPreSelected",
        key: "IsPreSelected",
        render: (value) => <Switch checked={value} disabled />,
      },
      {
        title: "Picture",
        dataIndex: "ImageUrl",
        key: "ImageUrl",
        render: (url) =>
          url ? (
            <img src={url} alt="Attribute" style={{ width: 80, height: 80 }} />
          ) : (
            <div style={{ width: 80, height: 80 }} />
          ),
      },
      {
        title: "Display Order",
        dataIndex: "DisplayOrder",
        key: "DisplayOrder",
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <div>
            <Button type="primary" onClick={() => openEditModal(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleDelete(record.Id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" style={{ marginLeft: 8 }}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <CustomLayout pageTitle="Products" menuKey="3">
      <Button onClick={() => navigate(-1)}>Go Back</Button>
      <h1>Attribute Values for Product {id}</h1>
      <Button
        type="primary"
        onClick={() => {
          setIsEditMode(false);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add New
      </Button>
      <Table
        columns={columns}
        dataSource={attributeValues}
        rowKey="Id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={isEditMode ? "Edit Attribute Value" : "Add New Attribute Value"}
        visible={isModalVisible}
        onOk={isEditMode ? handleEdit : handleAdd}
        onCancel={() => setIsModalVisible(false)}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Value Type"
            name="AttributeValueTypeId"
            rules={[{ required: true, message: "Please select a value type" }]}
          >
            <Select placeholder="Select a value type">
              <Option value={0}>Simple</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price Adjustment"
            name="PriceAdjustment"
            initialValue={0.0}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Weight Adjustment"
            name="WeightAdjustment"
            initialValue={0.0}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Is Preselected"
            name="IsPreSelected"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Display Order" name="DisplayOrder" initialValue={0}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Picture" name="PictureId">
            <Radio.Group onChange={handleImageChange}>
              <Radio key="none" value={null}>
                None
              </Radio>
              {existingImages.map((image) => (
                <Radio key={image.pictureId} value={image.pictureId}>
                  <Tooltip title={image.url}>
                    <img
                      src={image.url}
                      alt="Picture"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        margin: 5,
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          {previewImage && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <h4>Preview</h4>
              <Image
                src={previewImage}
                alt="Selected Preview"
                width={120}
                height={120}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          )}
        </Form>
      </Modal>
    </CustomLayout>
  );
};

export default EditAttributeValues;

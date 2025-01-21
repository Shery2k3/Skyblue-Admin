import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  message,
  Space,
  Upload,
  Image,
  Card,
  Checkbox,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import useRetryRequest from "../../../../Api/useRetryRequest";

const ImagePreviewBox = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 16px;
`;

const EditCategory = ({
  id,
  form,
  previewImage,
  dataSource,
  discounts,
  imageFile,
  handleImageRemove,
  handleImageUpload,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const retryRequest = useRetryRequest();

  const { Option } = Select;

  const getRoles = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/customer/roles`)
      );
      setRoles(response.data);
    } catch (error) {
      console.error("error fetching roles");
    }
  };

  const saveCategory = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("ParentCategoryId", values.parentId || 0);
      formData.append("ShowOnHomePage", values.showOnHomePage || false);
      formData.append("Description", values.description || "");
      formData.append("Published", values.published);
      formData.append("DiscountId", values.discountId || null);
      formData.append("limitedToCustomerRoles", values.limitedtoRoles || null);
      formData.append("removedImage", values.removedImage || false);
      formData.append("MetaKeywords", values.MetaKeywords);
      formData.append("MetaDescription", values.MetaDescription || 0);
      formData.append("MetaTitle", values.MetaTitle || false);

      if (imageFile) {
        formData.append("Image", imageFile);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (id !== "create") {
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/category/edit/${id}`,
          formData,
          config
        );
        message.success("Category updated successfully");
      } else {
        await axiosInstance.post(
          `${API_BASE_URL}/admin/category/add/`,
          formData,
          config
        );
        message.success("Category added successfully");
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    }
  };

  useEffect(() => {
    getRoles();
  }, [id]);
  return (
    <Card
      title={`Category Info`}
      extra={
        <Button
          type="primary"
          onClick={() => {
            saveCategory();
          }}
        >
          Save
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item name="image" label="Image" style={{ marginBottom: 24 }}>
          <ImagePreviewBox>
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Category"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                preview={{
                  visible: previewVisible,
                  onVisibleChange: (visible) => setPreviewVisible(visible),
                }}
              />
            ) : (
              <p>No image</p>
            )}
          </ImagePreviewBox>
          <Space>
            <Upload
              beforeUpload={() => false}
              onChange={handleImageUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {previewImage && (
              <>
                <Button
                  onClick={handleImageRemove}
                  icon={<DeleteOutlined />}
                  type="danger"
                >
                  Remove
                </Button>
              </>
            )}
          </Space>
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter meta description" rows={6} />
        </Form.Item>
        <Form.Item name="parentId" label="Parent Category">
          <Select
            allowClear
            placeholder="Select parent category"
            showSearch
            optionFilterProp="children"
          >
            <Option value={0}>None</Option>
            {dataSource &&
              dataSource.length > 0 &&
              dataSource.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.path}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="showOnHomePage" valuePropName="checked">
          <Checkbox>Show on Home Page</Checkbox>
        </Form.Item>
        <Form.Item name="discountId" label="Discount">
          <Select
            allowClear
            placeholder="Select discount"
            showSearch
            optionFilterProp="children"
          >
            <Option value={null}>None</Option>
            {discounts &&
              discounts.length > 0 &&
              discounts.map((discount) => (
                <Option key={discount.Id} value={discount.Id}>
                  {discount.Name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="limitedtoRoles" label="Limited to customer roles">
          <Select
            mode="multiple"
            allowClear
            placeholder="Select parent category"
            showSearch
            optionFilterProp="children"
          >
            {roles &&
              roles.length > 0 &&
              roles.map((role) => (
                <Option key={role.Id} value={role.Id}>
                  {role.Name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="published" label="Published" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditCategory;

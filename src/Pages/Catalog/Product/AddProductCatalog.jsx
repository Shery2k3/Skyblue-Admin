import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Card,
  Space,
  Typography,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import CustomLayout from "../../../Components/Layout/Layout";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddProductCatalog = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  const retryRequest = useRetryRequest();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const buttonSize = useResponsiveButtonSize();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchRoles(),
        fetchDiscounts(),
        fetchManufacturers(),
      ]);
    };
    fetchData();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/discount/product`)
      );
      setDiscounts(response.data);
    } catch (error) {
      message.error("Failed to fetch discounts");
    }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`)
      );
      setManufacturers(response.data);
    } catch (error) {
      message.error("Failed to fetch manufacturers");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/category/all`)
      );
      const flattenedCategories = flattenCategories(response.data);
      setCategories(flattenedCategories);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const flattenCategories = (categories, parentPath = "") => {
    let flatData = [];
    categories.forEach((category) => {
      const currentPath = parentPath
        ? `${parentPath} >> ${category.Name}`
        : category.Name;
      flatData.push({
        id: category.Id,
        name: currentPath,
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(
          flattenCategories(category.children, currentPath)
        );
      }
    });
    return flatData;
  };

  const fetchRoles = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/customer/roles`)
      );
      setRoles(response.data);
    } catch (error) {
      message.error("Failed to fetch user roles");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
        }
      });

      if (newImage) {
        formData.append("images", newImage);
      }

      await axiosInstance.post(`${API_BASE_URL}/admin/product/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Product added successfully");
      navigate("/products");
    } catch (error) {
      message.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = ({ file }) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setNewImage(file);
    }
  };

  const styles = {
    formContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: isSmallScreen ? "10px" : "20px",
    },
    imageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
    },
    productImage: {
      width: isSmallScreen ? "80%" : "200px",
      height: "auto",
      objectFit: "cover",
      marginBottom: "10px",
    },
    formItem: {
      marginBottom: "20px",
    },
    tierPriceContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
      flexDirection: isSmallScreen ? "column" : "row",
    },
    tierPriceItem: {
      flex: 1,
      marginRight: isSmallScreen ? "0" : "10px",
      marginBottom: isSmallScreen ? "10px" : "0",
      width: isSmallScreen ? "100%" : "auto",
    },
  };

  return (
    <CustomLayout pageTitle="Add Product" menuKey="3">
      <Title level={2} style={{ textAlign: "center" }}>
        Add Product
      </Title>
      <Card size="small">
        <div style={styles.formContainer}>
          <div style={styles.imageContainer}>
            {imageUrl && (
              <img src={imageUrl} alt="Product" style={styles.productImage} />
            )}
            <Upload
              beforeUpload={() => false}
              onChange={handleImageChange}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} size={buttonSize}>
                {imageUrl ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              VisibleIndividually: true,
              Published: true,
              MarkAsNew: false,
              OrderMinimumQuantity: 1,
              OrderMaximumQuantity: 10000,
              StockQuantity: 10000,
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Form.Item
                name="Name"
                label="Name"
                rules={[{ required: true }]}
                style={styles.formItem}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="ShortDescription"
                label="Short Description"
                style={styles.formItem}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="FullDescription"
                label="Full Description"
                style={styles.formItem}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="CategoryId"
                label="Category"
                style={styles.formItem}
              >
                <Select placeholder="Select a category">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ManufacturerId"
                label="Manufacturer"
                style={styles.formItem}
              >
                <Select placeholder="Select a manufacturer">
                  {manufacturers.map((manufacturer) => (
                    <Option key={manufacturer.Id} value={manufacturer.Id}>
                      {manufacturer.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Form.Item
                  name="Price"
                  label="Price"
                  rules={[{ required: true }]}
                  style={styles.formItem}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="OldPrice"
                  label="Old Price"
                  style={styles.formItem}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="DiscountId"
                  label="Discount"
                  style={styles.formItem}
                >
                  <Select placeholder="Select a discount" style={{ width: "100%" }}>
                    {discounts.map((discount) => (
                      <Option key={discount.Id} value={discount.Id}>
                        {discount.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>

              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Form.Item
                  name="StockQuantity"
                  label="Stock Quantity"
                  style={styles.formItem}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="OrderMinimumQuantity"
                  label="Minimum Order Quantity"
                  style={styles.formItem}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="OrderMaximumQuantity"
                  label="Maximum Order Quantity"
                  style={styles.formItem}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Space>

              <Form.Item
                name="AllowedQuantities"
                label="Allowed Quantities"
                style={styles.formItem}
              >
                <Input placeholder="Comma-separated values, e.g. 1, 5, 10" />
              </Form.Item>

              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Form.Item name="Barcode" label="Barcode" style={styles.formItem}>
                  <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="Barcode2"
                  label="Box Barcode"
                  style={styles.formItem}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Space>

              <Form.Item
                name="ItemLocation"
                label="Item Location"
                style={styles.formItem}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="BoxQty"
                label="Box Quantity"
                style={styles.formItem}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="AdminComment"
                label="Admin Comment"
                style={styles.formItem}
              >
                <TextArea rows={2} />
              </Form.Item>

              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Form.Item
                  name="Published"
                  valuePropName="checked"
                  label="Published"
                  style={styles.formItem}
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="VisibleIndividually"
                  valuePropName="checked"
                  label="Visible Individually"
                  style={styles.formItem}
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="MarkAsNew"
                  valuePropName="checked"
                  label="Mark as New"
                  style={styles.formItem}
                >
                  <Switch />
                </Form.Item>
              </Space>

              <Title level={4}>Tier Prices</Title>
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} style={styles.tierPriceContainer}>
                  <Form.Item
                    name={`Role${index}`}
                    label={`Role ${index}`}
                    style={styles.tierPriceItem}
                  >
                    <Select style={{ width: "100%" }}>
                      {roles.map((role) => (
                        <Option key={role.Id} value={role.Id}>
                          {role.Name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={`Price${index}`}
                    label={`Price ${index}`}
                    style={styles.tierPriceItem}
                  >
                    <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              ))}

              <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Add Product
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </div>
      </Card>
    </CustomLayout>
  );
};

export default AddProductCatalog;
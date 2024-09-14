import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CustomLayout from '../../Components/Layout/Layout';
import API_BASE_URL from '../../constants';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchRoles();
    fetchDiscounts();
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/discount/product`);
      setDiscounts(response.data);
    } catch (error) {
      message.error('Failed to fetch discounts');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/category/all`);
      const flattenedCategories = flattenCategories(response.data);
      setCategories(flattenedCategories);
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  const flattenCategories = (categories, parentPath = '') => {
    let flatData = [];
    categories.forEach(category => {
      const currentPath = parentPath ? `${parentPath} >> ${category.Name}` : category.Name;
      flatData.push({
        id: category.Id,
        name: currentPath,
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(flattenCategories(category.children, currentPath));
      }
    });
    return flatData;
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/customer/roles`);
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch user roles');
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/product/${id}`);
      const product = response.data;
      const formValues = {
        Name: product.Name,
        Price: product.Price,
        FullDescription: product.FullDescription,
        ShortDescription: product.ShortDescription,
        OrderMinimumQuantity: product.OrderMinimumQuantity,
        OrderMaximumQuantity: product.OrderMaximumQuantity,
        StockQuantity: product.StockQuantity,
        Published: product.Published,
        CategoryId: product.Category?.Id,
        VisibleIndividually: product.VisibleIndividually,
        MarkAsNew: product.MarkAsNew,
        AllowedQuantities: product.AllowedQuantities,
        Barcode: product.Barcode,
        Barcode2: product.Barcode2,
        AdminComment: product.AdminComment,
        OldPrice: product.OldPrice,
        ItemLocation: product.ItemLocation,
        BoxQty: product.BoxQty,
        DiscountId: product.Discount?.Id,
      };

      // Set tier prices
      product.TierPrices.forEach((tp, index) => {
        formValues[`Price${index + 1}`] = tp.Price;
        formValues[`Role${index + 1}`] = tp.CustomerRoleId;
      });

      setInitialValues(formValues);
      form.setFieldsValue(formValues);
      setImageUrl(product.ImageUrl);
    } catch (error) {
      message.error('Failed to fetch product details');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updatedFields = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== initialValues[key]) {
          updatedFields[key] = values[key];
        }
      });

      // Handle tier prices
      for (let i = 1; i <= 5; i++) {
        const roleKey = `Role${i}`;
        const priceKey = `Price${i}`;
        if (values[roleKey] !== initialValues[roleKey] || values[priceKey] !== initialValues[priceKey]) {
          updatedFields[roleKey] = values[roleKey];
          updatedFields[priceKey] = values[priceKey];
        }
      }

      const formData = new FormData();
      Object.keys(updatedFields).forEach(key => {
        formData.append(key, updatedFields[key]);
      });

      if (newImage) {
        formData.append('images', newImage);
      }

      // Log the form data
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (id) {
        await axios.patch(`${API_BASE_URL}/admin/product/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Product updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/admin/product`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Product added successfully');
      }
      navigate('/products');
    } catch (error) {
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
      setNewImage(info.file.originFileObj);
    }
  };

  return (
    <CustomLayout pageTitle={id ? 'Edit Product' : 'Add Product'} menuKey={3}>
      <Card>
        <Title level={2}>{id ? 'Edit Product' : 'Add Product'}</Title>
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
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {imageUrl && (
              <img src={imageUrl} alt="Product" style={{ maxWidth: '200px', marginBottom: '20px' }} />
            )}
            <Upload
              accept="image/*"
              showUploadList={false}
              onChange={handleImageChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload New Image</Button>
            </Upload>

            <Form.Item name="Name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="ShortDescription" label="Short Description">
              <Input />
            </Form.Item>

            <Form.Item name="FullDescription" label="Full Description">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="CategoryId" label="Category">
              <Select placeholder="Select a category">
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Space>
              <Form.Item name="Price" label="Price" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} />
              </Form.Item>

              <Form.Item name="OldPrice" label="Old Price">
                <InputNumber min={0} step={0.01} />
              </Form.Item>

              <Form.Item name="DiscountId" label="Discount">
                <Select placeholder="Select a discount">
                  {discounts.map(discount => (
                    <Option key={discount.Id} value={discount.Id}>{discount.Name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>

            <Space>
              <Form.Item name="StockQuantity" label="Stock Quantity">
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item name="OrderMinimumQuantity" label="Minimum Order Quantity">
                <InputNumber min={1} />
              </Form.Item>

              <Form.Item name="OrderMaximumQuantity" label="Maximum Order Quantity">
                <InputNumber min={1} />
              </Form.Item>
            </Space>

            <Form.Item name="AllowedQuantities" label="Allowed Quantities">
              <Input placeholder="Comma-separated values, e.g. 1, 5, 10" />
            </Form.Item>

            <Space>
              <Form.Item name="Barcode" label="Barcode">
                <Input />
              </Form.Item>

              <Form.Item name="Barcode2" label="Barcode 2">
                <Input />
              </Form.Item>
            </Space>

            <Form.Item name="ItemLocation" label="Item Location">
              <Input />
            </Form.Item>

            <Form.Item name="BoxQty" label="Box Quantity">
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="AdminComment" label="Admin Comment">
              <TextArea rows={2} />
            </Form.Item>

            <Space>
              <Form.Item name="Published" valuePropName="checked" label="Published">
                <Switch />
              </Form.Item>

              <Form.Item name="VisibleIndividually" valuePropName="checked" label="Visible Individually">
                <Switch />
              </Form.Item>

              <Form.Item name="MarkAsNew" valuePropName="checked" label="Mark as New">
                <Switch />
              </Form.Item>
            </Space>

            {/* Tier Prices */}
            <Title level={4}>Tier Prices</Title>
            {[1, 2, 3, 4, 5].map((index) => (
              <Space key={index}>
                <Form.Item name={`Role${index}`} label={`Role ${index}`}>
                  <Select style={{ width: 120 }}>
                    {roles.map(role => (
                      <Option key={role.Id} value={role.Id}>{role.Name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name={`Price${index}`} label={`Price ${index}`}>
                  <InputNumber min={0} step={0.01} />
                </Form.Item>
              </Space>
            ))}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {id ? 'Update Product' : 'Add Product'}
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </CustomLayout>
  );
};

export default EditProduct;
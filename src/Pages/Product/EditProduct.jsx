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
} from 'antd';
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

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/product/${id}`);
      const product = response.data;
      form.setFieldsValue({
        Name: product.Name,
        Price: product.Price,
        FullDescription: product.FullDescription,
        ShortDescription: product.ShortDescription,
        OrderMinimumQuantity: product.OrderMinimumQuantity,
        OrderMaximumQuantity: product.OrderMaximumQuantity,
        StockQuantity: product.StockQuantity,
        Published: product.Published,
        CategoryId: product.Category?.Id,
        VisibleIndividually: true, // Default value
        MarkAsNew: false, // Default value
        AllowedQuantities: '',
        Barcode: '',
        Barcode2: '',
        AdminComment: '',
        OldPrice: 0,
        ItemLocation: '',
        BoxQty: 0,
      });
      // Set tier prices
      product.TierPrices.forEach((tp, index) => {
        form.setFieldsValue({
          [`Price${index + 1}`]: tp.Price,
          [`Role${index + 1}`]: tp.CustomerRoleId,
        });
      });
    } catch (error) {
      message.error('Failed to fetch product details');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (id) {
        await axios.patch(`${API_BASE_URL}/admin/product/${id}`, values);
        message.success('Product updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/admin/product`, values);
        message.success('Product added successfully');
      }
      navigate('/products');
    } catch (error) {
      message.error('Failed to save product');
    } finally {
      setLoading(false);
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
                {/* Add category options here */}
                <Option value="1">Category 1</Option>
                <Option value="2">Category 2</Option>
              </Select>
            </Form.Item>

            <Space>
              <Form.Item name="Price" label="Price" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} />
              </Form.Item>

              <Form.Item name="OldPrice" label="Old Price">
                <InputNumber min={0} step={0.01} />
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
                    <Option value={6}>Role 6</Option>
                    <Option value={7}>Role 7</Option>
                    <Option value={8}>Role 8</Option>
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
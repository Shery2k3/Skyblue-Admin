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
  Popconfirm,
} from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomLayout from '../../Components/Layout/Layout';
import API_BASE_URL from '../../constants';
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

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
  const [disabledPrices, setDisabledPrices] = useState({});
  const [deletingTierPrice, setDeletingTierPrice] = useState(false);

  const retryRequest = useRetryRequest();

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
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/discount/product`)
      );
      setDiscounts(response.data);
    } catch (error) {
      message.error('Failed to fetch discounts');
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
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/customer/roles`)
      );
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch user roles');
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/${id}`)
      );
      const product = response.data;

      // Extract the discount ID from the product details
      const discountId = product.Discount?.[0]?.Discount_Id;

      // Find the discount name from the discounts state
      const discount = discounts.find(d => d.Id === discountId);
      const discountName = discount ? discount.Name : '';

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
        CategoryName: product.Category?.Name,
        VisibleIndividually: product.VisibleIndividually,
        MarkAsNew: product.MarkAsNew,
        AllowedQuantities: product.AllowedQuantities,
        Barcode: product.Barcode,
        Barcode2: product.Barcode2,
        AdminComment: product.AdminComment,
        OldPrice: product.OldPrice,
        ItemLocation: product.ItemLocation,
        BoxQty: product.BoxQty,
        DiscountId: discountId,
        DiscountName: discountName,
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
        if (values[roleKey] !== initialValues[roleKey] || values[priceKey] !== initialValues[priceKey] || disabledPrices[i]) {
          updatedFields[roleKey] = values[roleKey];
          updatedFields[priceKey] = disabledPrices[i] ? 0 : values[priceKey];
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
        await axiosInstance.patch(`${API_BASE_URL}/admin/product/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Product updated successfully');
      } else {
        await axiosInstance.post(`${API_BASE_URL}/admin/product/add`, formData, {
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

  const handleImageChange = ({ file }) => {
    // Preview new image before sending
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result); // Preview the new image
      };
      reader.readAsDataURL(file);
      setNewImage(file); // Store the new image file
    }
  };

  const handleDisablePrice = (index, checked) => {
    setDisabledPrices(prev => ({ ...prev, [index]: checked }));
    if (checked) {
      form.setFieldsValue({
        [`Price${index}`]: 0,
        [`Role${index}`]: null
      });
    }
  };

  const handleDeleteTierPrice = async (index) => {
    const roleId = form.getFieldValue(`Role${index}`);
    if (!roleId) {
      message.error('Please select a role before deleting');
      return;
    }

    setDeletingTierPrice(true);
    try {
      await axiosInstance.delete(`${API_BASE_URL}/admin/product/tier-price`, {
        data: {
          customerRoleId: roleId,
          productId: id
        }
      });
      message.success('Tier price deleted successfully');

      // Shift remaining tier prices up
      const newValues = { ...form.getFieldsValue() };
      for (let i = index; i < 5; i++) {
        newValues[`Role${i}`] = newValues[`Role${i + 1}`] || null;
        newValues[`Price${i}`] = newValues[`Price${i + 1}`] || null;
      }
      // Clear the last tier price
      newValues[`Role5`] = null;
      newValues[`Price5`] = null;

      form.setFieldsValue(newValues);
    } catch (error) {
      message.error('Failed to delete tier price');
    } finally {
      setDeletingTierPrice(false);
    }
  };

  const styles = {
    formContainer: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    imageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    productImage: {
      width: '200px',
      height: '200px',
      objectFit: 'cover',
      marginBottom: '10px',
    },
    formItem: {
      marginBottom: '20px',
    },
    tierPriceContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    tierPriceItem: {
      flex: 1,
      marginRight: '10px',
    },
    deleteButton: {
      color: '#ff4d4f',
    },
  };

  return (
    <CustomLayout pageTitle={id ? 'Edit Product' : 'Add Product'} menuKey={3}>
      <Card>
        <div style={styles.formContainer}>
          <Title level={2} style={{ textAlign: 'center' }}>
            {id ? 'Edit Product' : 'Add Product'}
          </Title>

          <div style={styles.imageContainer}>
            {imageUrl && <img src={imageUrl} alt="Product" style={styles.productImage} />}
            <Upload
              beforeUpload={() => false}
              onChange={handleImageChange}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                {imageUrl ? 'Change Image' : 'Upload Image'}
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
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Form.Item name="Name" label="Name" rules={[{ required: true }]} style={styles.formItem}>
                <Input />
              </Form.Item>

              <Form.Item name="ShortDescription" label="Short Description" style={styles.formItem}>
                <Input />
              </Form.Item>

              <Form.Item name="FullDescription" label="Full Description" style={styles.formItem}>
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item name="CategoryId" label="Category" initialValue={initialValues.CategoryId} style={styles.formItem}>
                <Select placeholder={initialValues.CategoryName || "Select a category"}>
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Form.Item name="Price" label="Price" rules={[{ required: true }]} style={styles.formItem}>
                  <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="OldPrice" label="Old Price" style={styles.formItem}>
                  <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="DiscountId" label="Discount" initialValue={initialValues.DiscountId} style={styles.formItem}>
                  <Select placeholder={initialValues.DiscountName || "Select a discount"} style={{ width: '100%' }}>
                    {discounts.map(discount => (
                      <Option key={discount.Id} value={discount.Id}>{discount.Name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Form.Item name="StockQuantity" label="Stock Quantity" style={styles.formItem}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="OrderMinimumQuantity" label="Minimum Order Quantity" style={styles.formItem}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="OrderMaximumQuantity" label="Maximum Order Quantity" style={styles.formItem}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Space>

              <Form.Item name="AllowedQuantities" label="Allowed Quantities" style={styles.formItem}>
                <Input placeholder="Comma-separated values, e.g. 1, 5, 10" />
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Form.Item name="Barcode" label="Barcode" style={styles.formItem}>
                  <Input style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="Barcode2" label="Barcode 2" style={styles.formItem}>
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              </Space>

              <Form.Item name="ItemLocation" label="Item Location" style={styles.formItem}>
                <Input />
              </Form.Item>

              <Form.Item name="BoxQty" label="Box Quantity" style={styles.formItem}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="AdminComment" label="Admin Comment" style={styles.formItem}>
                <TextArea rows={2} />
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Form.Item name="Published" valuePropName="checked" label="Published" style={styles.formItem}>
                  <Switch />
                </Form.Item>

                <Form.Item name="VisibleIndividually" valuePropName="checked" label="Visible Individually" style={styles.formItem}>
                  <Switch />
                </Form.Item>

                <Form.Item name="MarkAsNew" valuePropName="checked" label="Mark as New" style={styles.formItem}>
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
                    <Select
                      style={{ width: '100%' }}
                      onChange={() => form.setFieldsValue({ [`Price${index}`]: null })}
                    >
                      {roles.map(role => (
                        <Option key={role.Id} value={role.Id}>{role.Name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={`Price${index}`}
                    label={`Price ${index}`}
                    style={styles.tierPriceItem}
                  >
                    <InputNumber
                      min={0}
                      step={0.01}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Popconfirm
                    title="Are you sure you want to delete this tier price?"
                    onConfirm={() => handleDeleteTierPrice(index)}
                    okText="Yes"
                    cancelText="No"
                    disabled={!form.getFieldValue(`Role${index}`)}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      style={{
                        ...styles.deleteButton,
                        opacity: form.getFieldValue(`Role${index}`) ? 1 : 0.5,
                      }}
                      type="text"
                      disabled={!form.getFieldValue(`Role${index}`)}
                      loading={deletingTierPrice}
                    />
                  </Popconfirm>
                </div>
              ))}

              <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {id ? 'Update Product' : 'Add Product'}
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </div>
      </Card>
    </CustomLayout>
  );
};

export default EditProduct;
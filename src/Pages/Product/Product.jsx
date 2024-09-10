import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Pagination, Tag, Space, Typography, Card } from 'antd';
import { SearchOutlined, DollarCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import CustomLayout from '../../Components/Layout/Layout';
import API_BASE_URL from '../../constants';

const { Option } = Select;
const { Title, Text } = Typography;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [published, setPublished] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/product/search`, {
        params: { category, product, published, size: 20, page },
      });
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      align: 'center',
      render: (text) => (
        <img
          src={text}
          alt="product"
          style={{ width: '100%', height: 'auto', maxWidth: 70, maxHeight: 70, objectFit: 'contain' }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      align: 'center',
      render: (text) => (
        <Text style={{ fontSize: '14px', color: '#000000', fontWeight: 'bold' }}>
          ${text}
        </Text>
      )
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'StockQuantity',
      key: 'StockQuantity',
      align: 'center',
      render: (text) => (
        <Text style={{ fontSize: '14px', color: '#000000', fontWeight: 'bold' }}>
          ${text}
        </Text>
      )
    },
    {
      title: 'Published',
      dataIndex: 'Published',
      key: 'Published',
      align: 'center',
      render: (text) =>
        text ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="red">Unpublished</Tag>
        ),
    },
  ];

  return (
    <CustomLayout pageTitle="Products" menuKey={3}>
      <Card style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <Space size="large" wrap>
            <Input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Input
              placeholder="Product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Select
              value={published}
              onChange={(value) => setPublished(value)}
              style={{ width: 200 }}
            >
              <Option value="1">Published</Option>
              <Option value="0">Unpublished</Option>
              <Option value="">All</Option>
            </Select>
            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
              Search
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="Id"
          pagination={false}
          scroll={{ x: "max-content" }}
          style={{ marginBottom: 24 }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={20}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </Card>
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>
          {error.message}
        </div>
      )}
    </CustomLayout>
  );
};

export default Product;
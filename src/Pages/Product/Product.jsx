import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Pagination, Tag } from 'antd';
import axios from 'axios';
import CustomLayout from '../../Components/Layout/Layout';
import API_BASE_URL from '../../constants';

const { Option } = Select;

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
      render: (text) => <img src={text} alt="product" style={{ width: 50 }} />,
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'StockQuantity',
      key: 'StockQuantity',
    },
    {
      title: 'Published',
      dataIndex: 'Published',
      key: 'Published',
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
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: 200, marginRight: 8 }}
        />
        <Select
          value={published}
          onChange={(value) => setPublished(value)}
          style={{ width: 200, marginRight: 8 }}
        >
          <Option value="1">Published</Option>
          <Option value="0">Unpublished</Option>
          <Option value="">All</Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="Id"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={20}
        onChange={handlePageChange}
        style={{ marginTop: 16 }}
        showSizeChanger={false}
      />
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </CustomLayout>
  );
};

export default Product;
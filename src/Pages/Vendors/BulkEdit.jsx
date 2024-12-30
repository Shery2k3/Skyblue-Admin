import React, { useState, useEffect } from 'react';
import CustomLayout from '../../Components/Layout/Layout';
import axiosInstance from '../../Api/axiosConfig';
import { Spin, Table, message } from 'antd';

const BulkEdit = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,  // Fetch 25 items per page
    total: 0,
  });

  // Fetch products API
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/admin/bulk-products?page=${page}&pageSize=${pagination.pageSize}`
      );
      if (response?.data?.success) {
        const { products, totalItems } = response.data.data;
        setProducts(products);
        setPagination((prev) => ({
          ...prev,
          current: page,
          total: totalItems,
        }));
      } else {
        message.error('Failed to fetch products.');
      }
    } catch (error) {
      message.error('An error occurred while fetching products.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount and pagination change
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle table pagination
  const handleTableChange = (pagination) => {
    fetchProducts(pagination.current);
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'StockQuantity',
      key: 'StockQuantity',
    },
    {
      title: 'Item Location',
      dataIndex: 'ItemLocation',
      key: 'ItemLocation',
    },
    {
      title: 'Box Quantity',
      dataIndex: 'BoxQty',
      key: 'BoxQuantity',
    },
    {
      title: 'Published',
      dataIndex: 'Published',
      key: 'Published',
      render: (published) => (published ? 'Yes' : 'No'),
    },
    {
      title: 'Vendor Name',  // Add Vendor Name column
      dataIndex: 'VendorName',
      key: 'VendorName',
    },
  ];

  return (
    <CustomLayout pageTitle="Bulk Edit" menuKey="20">
      <div>
        <h1>Bulk Edit</h1>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            dataSource={products}
            columns={columns}
            rowKey="Id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
          />
        )}
      </div>
    </CustomLayout>
  );
};

export default BulkEdit;

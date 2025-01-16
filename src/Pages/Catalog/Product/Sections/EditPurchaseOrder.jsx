import React, { useEffect, useState, useCallback } from 'react';
import { Button, message, Space, Table, Spin } from 'antd';
import API_BASE_URL from '../../../../constants';
import useRetryRequest from '../../../../Api/useRetryRequest';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../Api/axiosConfig';

const EditPurchaseOrder = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const retryRequest = useRetryRequest();
  const navigate = useNavigate();

  // Fetch the purchased products once the component is mounted
  const fetchPurchasedProduct = useCallback(async () => {
    try {
      setLoading(true); // Set loading state
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/purchasedwithorder/${id}`)
      );
      console.log('response', response.data.result);
      setOrders(response.data.result || []); // Fallback to empty array if result is undefined
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch product');
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [id, retryRequest]);

  // Trigger fetch on component mount
  useEffect(() => {
    fetchPurchasedProduct();
  }, [fetchPurchasedProduct]);

  // Navigate to the order details page
  const handleNavigateToOrder = (orderId) => {
    console.log('Navigate to order details page for OrderId:', orderId);
    navigate(`/orders/${orderId}`);
  };

  // Table columns definition
  const columns = [
    {
      title: 'Customer Email',
      dataIndex: 'CustomerEmail',
      key: 'CustomerEmail',
    },
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
    },
    {
      title: 'Order Status',
      dataIndex: 'OrderStatus',
      key: 'OrderStatus',
    },
    {
      title: 'Shipping Status',
      dataIndex: 'ShippingStatus',
      key: 'ShippingStatus',
    },
    {
      title: 'Payment Status',
      dataIndex: 'PaymentStatus',
      key: 'PaymentStatus',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleNavigateToOrder(record.OrderId)}>
            View Order
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Purchase Order</h2>
      <p>Here you can see a list of orders in which this product was purchased.</p>

      {loading ? (
        <Spin tip="Loading orders..." size="large" />
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="OrderId"
          pagination={{
            pageSize: 10, // You can adjust this based on how many items you want per page
          }}
          bordered
        />
      )}
    </div>
  );
};

export default EditPurchaseOrder;

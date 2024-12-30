import { Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import useRetryRequest from '../../../../Api/useRetryRequest';
import axiosInstance from '../../../../Api/axiosConfig';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../../../constants';

const Orders = () => {
  const { id } = useParams(); // Get customer ID from route params
  const retryRequest = useRetryRequest();
  const [orders, setOrders] = useState([]); // State to hold orders data
  const [loading, setLoading] = useState(true); // Loading state

  // Status mapping with labels and colors
  const statusMapping = {
    10: { label: "Pending", color: "#ff7300" },
    20: { label: "Processing", color: "#108ee9" },
    30: { label: "Completed", color: "#5bab37" },
    40: { label: "Canceled", color: "#d43b3b" },
  };

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/edit-customer-order/${id}`)
      );

      const { data } = response.data; // Extract the orders array from response

      // Format the data for the table
      const formattedOrders = data.map(order => ({
        key: order.Id,
        orderNumber: order.CustomOrderNumber,
        orderTotal: `$${order.OrderTotal.toFixed(2)}`,
        orderStatus: order.OrderStatusId,
        paymentStatus: order.PaymentStatusId,
        createdOn: new Date(order.CreatedOnUtc).toLocaleString(),
      }));

      setOrders(formattedOrders); // Update state with formatted data
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Define columns for Ant Design table
  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Order Total',
      dataIndex: 'orderTotal',
      key: 'orderTotal',
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: statusId => {
        const status = statusMapping[statusId] || { label: "Unknown", color: "#d9d9d9" };
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: statusId => {
        const paymentStatuses = {
          10: { label: "Pending", color: "#ffbf00" },
          20: { label: "Paid", color: "#5bab37" },
          30: { label: "Unpaid", color: "#d43b3b" },
        };
        const status = paymentStatuses[statusId] || { label: "Unknown", color: "#d9d9d9" };
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <a href={`/orders/${record.key}`} style={{ color: "#1890ff" }}>
          View Details
        </a>
      ),
    },
  ];

  return (
    <div>
      <h2>Orders</h2>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{ pageSize: 10 }} // Set pagination
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default Orders;

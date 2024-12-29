import React, { useEffect, useState } from 'react';
import { Typography, Table, Spin, Alert, Button, message } from 'antd';
import axiosInstance from '../../../../Api/axiosConfig';
import { useParams } from 'react-router-dom';
import useRetryRequest from '../../../../Api/useRetryRequest';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UsageHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const retryRequest = useRetryRequest();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch usage history from API
  const fetchUsageHistory = async () => {
    try {
      const response = await retryRequest(() => axiosInstance.get(`/admin/usage-discount/${id}`));
      setData(response.data.result || []);  // Ensure response.data.result exists
    } catch (err) {
      setError('Failed to load usage history');
    } finally {
      setLoading(false);  // End loading
    }
  };

  // Format CreatedOnUtc to a readable format
  const formatDate = (dateString) => dayjs(dateString).format('MMM D, YYYY, h:mm A');

  // Handle deletion of discount usage
  const handleDelete = async (discountId, orderId) => {
    try {
      const response = await axiosInstance.delete(`/admin/discount-usage/${discountId}`, {
        data: { orderId },
      });
      if (response.data.success) {
        setData((prevData) => prevData.filter((item) => item.DiscountId !== discountId || item.OrderId !== orderId));
        message.success('Discount usage deleted successfully');
      } else {
        message.error('Failed to delete discount usage');
      }
    } catch (error) {
      message.error('An error occurred while deleting the discount usage');
    }
  };

  // Columns for the Ant Design Table
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
      render: (orderId) => (
        <Button type="link" onClick={() => navigate(`/order/${orderId}`)}>
          {orderId}
        </Button>
      ),
    },
    {
      title: 'Created On',
      dataIndex: 'CreatedOnUtc',
      key: 'CreatedOnUtc',
      render: formatDate,
    },
    {
      title: 'Order Total',
      dataIndex: 'OrderTotal',
      key: 'OrderTotal',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.DiscountId, record.OrderId)}>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchUsageHistory();
  }, [id]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Usage History
      </Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="Id"
        pagination={{ pageSize: 10 }}
        style={{ margin: '0 20px' }}
      />
    </div>
  );
};

export default UsageHistory;

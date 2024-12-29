import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Spin, Alert, Button } from 'antd';
import useRetryRequest from '../../../../Api/useRetryRequest';
import axiosInstance from '../../../../Api/axiosConfig';
import API_BASE_URL from '../../../../constants';

const Address = () => {
  const { id } = useParams(); // Retrieve the customer ID from the route
  const retryRequest = useRetryRequest();
  const navigate = useNavigate(); // For navigation
  const [addressData, setAddressData] = useState(null); // State to store address data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

  // Fetch the customer address
  const fetchAddress = async () => {
    try {
      setLoading(true);
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/customer-details/${id}`)
      );
  
      // Debugging the API response structure
      console.log("This is response", response);
  
      // Check if the response contains the address data
      if (response.data?.Id && response.data?.Email) {
        // Set the address data directly from response.data (not nested under result)
        setAddressData([response.data]); // Store the address in an array
      } else {
        setError('Failed to fetch address data');
      }
    } catch (err) {
      setError('An error occurred while fetching address data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on component mount
  useEffect(() => {
    fetchAddress();
  }, [id]);

  // Render loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin tip="Loading address data..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ margin: '20px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  // Define columns for the table
  const columns = [
    { title: 'First Name', dataIndex: 'FirstName', key: 'FirstName' },
    { title: 'Last Name', dataIndex: 'LastName', key: 'LastName' },
    { title: 'Email', dataIndex: 'Email', key: 'Email' },
    { title: 'Company', dataIndex: 'Company', key: 'Company', render: text => text || 'N/A' },
    { title: 'City', dataIndex: 'City', key: 'City' },
    { title: 'Address 1', dataIndex: 'Address1', key: 'Address1' },
    { title: 'Address 2', dataIndex: 'Address2', key: 'Address2', render: text => text || 'N/A' },
    { title: 'Postal Code', dataIndex: 'ZipPostalCode', key: 'ZipPostalCode' },
    { title: 'Phone Number', dataIndex: 'PhoneNumber', key: 'PhoneNumber' },
    { title: 'Created On', dataIndex: 'CreatedOnUtc', key: 'CreatedOnUtc', render: text => new Date(text).toLocaleString() },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/edit/${record.Id}`)} // Navigate to the /edit route with the customer ID
        >
          Edit
        </Button>
      ),
    },
  ];

  // Render address details using Ant Design Table
  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Addresses</h2>
      {addressData?.length > 0 ? (
        <Table
          dataSource={addressData}
          columns={columns}
          rowKey="Id"
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
        />
      ) : (
        <Alert
          message="No Data"
          description="No address data available for this customer."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default Address;

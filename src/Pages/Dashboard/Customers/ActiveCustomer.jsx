import { useState, useEffect } from "react";
import { Table, message, Pagination, Card, Badge } from "antd";
import axios from "axios"; // Assuming you're using axios for API calls

const ActiveCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // Adjust the page size as needed

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        message.error('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <strong>{email}</strong>,
    },
    {
      title: 'Approved',
      dataIndex: 'approved', // This field doesn't exist in the API data
      key: 'approved',
      render: () => <Badge status="success" text="Yes" />, // Assuming approved
    },
    {
      title: 'Product Count',
      dataIndex: 'Product Count',
      key: 'Product Count',
      render: () => <Badge count={Math.floor(Math.random() * 10) + 1} />,
    },
    {
      title: 'Buy Amount',
      dataIndex: 'Buy Amount',
      key: 'Buy Amount',
      render: () => `$${(Math.random() * 1000).toFixed(2)}`,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <div>
          {address?.street || 'N/A'}
          <br />
          {address?.city || ''}, {address?.state || ''} {address?.zipcode || ''}
        </div>
      ),
    },
  ];

  return (
    <Card bordered={false} style={{ marginTop: '20px' }}>
      {loading ? (
        <div>Loading customers...</div>
      ) : (
        <div>
          <Table
            dataSource={displayedCustomers}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.id}
          />
          <Pagination
            style={{ marginTop: '20px', textAlign: 'center' }}
            current={currentPage}
            pageSize={pageSize}
            total={customers.length}
            onChange={handlePageChange}
          />
        </div>
      )}
    </Card>
  );
};

export default ActiveCustomer;

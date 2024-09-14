import  { useState, useEffect } from "react";
import { Table, Button, Pagination, Card } from "antd";
import axios from "axios"; // Assuming you're using axios for API calls

import API_BASE_URL from '../../../constants.js'

const BestSellerByAmount = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Default page size

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.example.com/best-sellers/amount');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: 'Total Amount (Excl. Tax)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Button type="link" onClick={() => window.location.href = `/product/${record.id}`}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Card bordered={false} title="Best Sellers by Amount" style={{ marginBottom: '20px' }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table
            dataSource={displayedData}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.id}
            scroll={{ x: "max-content" }}
          />
          <Pagination
            style={{ marginTop: '20px', textAlign: 'center' }}
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};

export default BestSellerByAmount;

import { useState, useEffect } from "react";
import { Table, Button, Pagination, Card, Spin } from "antd";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook

const BestSellerByQuantity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Default page size

  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch best sellers data with retry logic
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/bestSellerByQuantity")
        );
        //console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [retryRequest]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Total Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          type="link"
          onClick={() =>
            (window.location.href = `/edit-product/${record.ProductId}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      title="Best Sellers by Quantity"
      style={{ marginBottom: "20px" }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            dataSource={displayedData}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.ProductId}
            scroll={{ x: "max-content" }}
          />
          <Pagination
            style={{ marginTop: "20px", textAlign: "center" }}
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

export default BestSellerByQuantity;

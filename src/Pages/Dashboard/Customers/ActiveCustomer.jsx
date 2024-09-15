import { useState, useEffect } from "react";
import { Table, message, Pagination, Card, Spin, Badge } from "antd";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook

const ActiveCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Adjust the page size as needed

  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch customer data with retry logic
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/activeCustomers")
        );
        console.log("Response:", response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [retryRequest]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Email",
      dataIndex: "Email", // Note: "Email" is case-sensitive based on your API data.
      key: "Email",
      render: (email) => <strong>{email}</strong>,
    },
    {
      title: "Approved",
      dataIndex: "approved",
      key: "approved",
      render: () => <Badge status="success" text="Yes" />, // Assuming every customer is approved
    },
    {
      title: "Quantity Count",
      key: "Quantity Count",
      render: (record) => {
        // Summing total quantity of products from all orders for each customer
        const totalQuantity = record.orders.reduce(
          (total, order) => total + order.totalQuantity,
          0
        );
        return <Badge count={totalQuantity} />;
      },
    },
    {
      title: "Amount Excl Tax",
      key: "Buy Amount",
      render: (record) => {
        // Summing the order subtotal for each customer
        const totalAmount = record.orders.reduce(
          (total, order) => total + order.orderSubtotalExclTax,
          0
        );
        return `$${totalAmount.toFixed(2)}`;
      },
    },
    {
      title: "Order Count",
      key: "Order Count",
      render: (record) => {
        console.log("Record", record);
        return record.orders.length; // Assuming 'orders' is an array from the backend
      },
    },
  ];

  return (
    <Card bordered={false} style={{ marginTop: "20px" }}>
      {loading ? (
        <Spin tip="Loading customers..." size="large" />
      ) : (
        <>
          <Table
            dataSource={displayedCustomers}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.Email}
            scroll={{ x: "max-content" }}
          />
          <Pagination
            style={{ marginTop: "20px", textAlign: "center" }}
            current={currentPage}
            pageSize={pageSize}
            total={customers.length}
            onChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};

export default ActiveCustomer;

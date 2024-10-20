import CustomLayout from "../../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook

const Orders = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const retryRequest = useRetryRequest(); // Use the retry logic hook
  const { Title } = Typography;

  // Status mapping
  const statusMapping = {
    10: { label: "Pending", color: "#FFA500" }, // Orange
    20: { label: "Processing", color: "#007BFF" }, // Blue
    30: { label: "Completed", color: "#28A745" }, // Green
    40: { label: "Canceled", color: "#DC3545" }, // Red
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch orders with retry logic
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/all-orders?size=10000`)
        );
        console.log(response);
        const data = response.data.data.map((order) => ({
          key: order.Id,
          id: order.Id,
          orderNo: order.Id,
          customer: order.CustomerEmail,
          createdOn: new Date(order.CreatedonUtc).toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }),
          orderTotal: "$" + order.OrderTotal.toFixed(2),
          status: statusMapping[order.OrderStatusId] || { label: "Unknown", color: "#6c757d" }, // Default to gray
        }));
        setDataSource(data);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [retryRequest]);

  const handleView = (order) => {
    navigate(`/orders/${order.orderNo}`);
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNo",
      key: "orderNo",
      align: "center",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
      align: "center",
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      key: "orderTotal",
      align: "center",
    },
    {
      title: "Status", // New Status Column
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span style={{ color: status.color }}>{status.label}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleView(record)}>View</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Orders" menuKey="7">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Orders
      </Title>
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
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: "max-content" }}
        />
      )}
    </CustomLayout>
  );
};

export default Orders;

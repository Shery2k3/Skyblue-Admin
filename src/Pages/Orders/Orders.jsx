import CustomLayout from "../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const Orders = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const retryRequest = useRetryRequest(); // Use the retry logic hook
  const { Title } = Typography;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch orders with retry logic
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/all-orders?size=10000`)
        );
        console.log(response)
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
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleView(record)}>View</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Orders" menuKey="5">
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

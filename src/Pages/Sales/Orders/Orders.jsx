import CustomLayout from "../../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Spin,
  Button,
  Select,
  DatePicker,
  Pagination,
  Space,
  Typography,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import { useMediaQuery } from "react-responsive";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const Orders = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStartDate] = useState("");
  const [end, setEndDate] = useState("");
  const [orderStatusId, setOrderStatus] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const { Option } = Select;

  const buttonSize = useResponsiveButtonSize();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const retryRequest = useRetryRequest(); // Use the retry logic hook
  const { Title } = Typography;

  // Status mapping
  const statusMapping = {
    10: { label: "Pending", color: "#ff7300" },
    20: { label: "Processing", color: "#108ee9" },
    30: { label: "Completed", color: "#5bab37" },
    40: { label: "Canceled", color: "#d43b3b" },
  };

  const handleStartDateChange = (date) => {
    setStartDate(date ? dayjs(date).utc().format() : "");
  };

  const handleEndDateChange = (date) => {
    setEndDate(date ? dayjs(date).utc().format() : "");
  };

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      // Use retryRequest to fetch orders with retry logic
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/all-orders`, {
          params: { orderStatusId, start, end, size: 20, page },
        })
      );
      console.log('API Response Data:', response.data);
      const data = response.data.data.map((order) => ({
        key: order.Id,
        id: order.Id,
        orderNo: order.Id,
        customer: order.CustomerEmail,
        customerName: `${order.CustomerFirstName} ${order.CustomerLastName}`,  // New field for full name
        orderStatus: order.OrderStatusId,
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
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [retryRequest]);

  const handlePageChange = (page) => {
    fetchOrders(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (order) => {
    navigate(`/orders/${order.orderNo}`);
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNo",
      key: "orderNo",
      align: "center",
      fixed: "left",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (status) => {
        const statusInfo = statusMapping[status] || {
          label: "Unknown",
          color: "gray",
        };
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
    },
    {
      title: "Customer Name", // New column for first and last name
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
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
    <CustomLayout pageTitle="Orders" menuKey="7">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Orders
      </Title>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Space
          size={buttonSize}
          align="center"
          style={{ justifyContent: "center" }}
          wrap
        >
          <DatePicker
            onChange={handleStartDateChange}
            placeholder="Start Date"
            format="M/D/YYYY"
          />
          <DatePicker
            onChange={handleEndDateChange}
            placeholder="End Date"
            format="M/D/YYYY"
          />
          <Select
            placeholder="Select Order Status"
            onChange={(value) => setOrderStatus(value || "")}
            allowClear
            style={{ width: isSmallScreen ? "100%" : 200 }}
          >
            <Option value="10">Pending</Option>
            <Option value="20">Processing</Option>
            <Option value="30">Completed</Option>
            <Option value="40">Canceled</Option>
          </Select>
          <Button
            type="primary"
            onClick={() => {
              fetchOrders(1);
            }}
            style={{ width: isSmallScreen ? "100%" : "auto" }}
          >
            Search
          </Button>
        </Space>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey="key"
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginBottom: 24 }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={20}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
          size={isSmallScreen ? "small" : "default"}
          simple={isSmallScreen}
        />
      </div>
    </CustomLayout>
  );
};

export default Orders;

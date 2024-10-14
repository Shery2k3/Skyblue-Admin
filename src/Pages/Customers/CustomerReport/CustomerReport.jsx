import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import CustomLayout from "../../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import { useMediaQuery } from "react-responsive";
import {
  Table,
  Button,
  Select,
  DatePicker,
  Pagination,
  Space,
  Typography,
} from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const CustomerReport = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [sortBy, setSortBy] = useState("order_total");
  const [start, setStartDate] = useState("");
  const [end, setEndDate] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { Title } = Typography;
  const { Option } = Select;
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  const fetchCustomerReport = async (page = 1) => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/customer-report`, {
          params: { start, end, sortBy, size: 20, page },
        })
      );
      const products = response.data.data;
      const productData = products.map((item) => ({
        key: item.CustomerId,
        customer: item.Email,
        orderTotal:
          "$" +
          item.OrderTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        orderCount: item.TotalOrders,
      }));
      setDataSource(productData);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching Customer Report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerReport(1);
  }, [retryRequest, sortBy]);

  const handlePageChange = (page) => {
    fetchCustomerReport(page);
  };

  const handleSearch = () => {
    fetchCustomerReport(1);
  };

  const handleView = (customer) => {
    navigate(`/edit-customer/${customer.key}`);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date ? dayjs(date).utc().format() : "");
  };

  const handleEndDateChange = (date) => {
    setEndDate(date ? dayjs(date).utc().format() : "");
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      key: "orderTotal",
      align: "center",
    },
    {
      title: "Number of Orders",
      dataIndex: "orderCount",
      key: "orderCount",
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
    <CustomLayout pageTitle="Customers Report" menuKey="12">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Customers Report
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
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            style={{ width: isSmallScreen ? "100%" : 200 }}
          >
            <Option value="order_total">Order Total</Option>
            <Option value="order_count">Number of Orders</Option>
          </Select>
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
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<LineChartOutlined />}
            style={{ width: isSmallScreen ? "100%" : "auto" }}
          >
            Run Report
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

export default CustomerReport;

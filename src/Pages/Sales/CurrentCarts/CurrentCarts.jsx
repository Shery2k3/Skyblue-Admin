import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import { useNavigate } from "react-router-dom";
import useRetryRequest from "../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";
import {
  Table,
  Button,
  Pagination,
  Typography,
} from "antd";

const CurrentCarts = () => {
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { Title } = Typography;
  const navigate = useNavigate()
  const retryRequest = useRetryRequest();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/current-carts`, {
          params: { size: 20, page },
        } )
      );
      const products = response.data.data;
      const productData = products.map((item) => ({
        key: item.CustomerId,
        email: item.Email,
        totalItems: item.TotalItems,
        totalQuantity: item.TotalQuantity,
      }));
      setDataSource(productData);
      setTotalItems(response.data.TotalItems);
      setCurrentPage(response.data.CurrentPage);
    } catch (error) {
      console.error("Error fetching bestseller data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchCustomers(page);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleView = (customer) => {
    navigate(`/current-carts/${customer.key}`);
  };

  const handleEmailClick = (customer) => {
    navigate(`/customer/edit/${customer.key}`);
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "email",
      key: "email",
      render: (_, record) => (
        <a onClick={() => handleEmailClick(record)}>{record.email}</a>
      ),
    },
    {
      title: "Total Items",
      dataIndex: "totalItems",
      key: "totalItems",
      align: "center",
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleView(record)}>View Products</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Current Carts" menuKey="8">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Current Carts
      </Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey="Id"
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

export default CurrentCarts;

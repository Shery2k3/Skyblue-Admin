import React, { useEffect, useState } from "react";
import CustomLayout from "../../Components/Layout/Layout";
import { Button, Table, Tag, Typography } from "antd";
import useRetryRequest from "../../Api/useRetryRequest";
import API_BASE_URL from "../../constants";
import axiosInstance from "../../Api/axiosConfig";
import { useParams } from "react-router-dom";

const VendorProduct = () => {
  const { id } = useParams();
  const { Title } = Typography;
  const retryRequest = useRetryRequest();

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0, // total number of items
  });

  const fetchVendorsProduct = async (page = 1, pageSize = 10) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(
          `${API_BASE_URL}/admin/vendor-products/${id}?page=${page}&pageSize=${pageSize}`
        )
      );
      const { data, meta } = response.data;
      console.log("Data:", data, "Meta:", meta);
      const formattedData = data.map((vendor) => ({
        key: vendor.Id,
        id: vendor.Id,
        name: vendor.Name,
        email: vendor.Email,
        active: vendor.Active,
      }));

      console.log("Formatted Data:", formattedData);

      setDataSource(formattedData);
      setPagination({
        current: meta.page,
        pageSize: meta.pageSize,
        total: meta.totalItems, // Assuming API returns the total items
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    fetchVendorsProduct(current, pageSize);
  };

  const handleView = (record) => {
    console.log(record);
  };

  const columns = [
    {
      title: "Product Id",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Is Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      align: "center",
      render: (active) =>
        active ? (
          <Tag color="green">Featured</Tag>
        ) : (
          <Tag color="volcano">Not Featured</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button onClick={() => handleView(record)}>View</Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchVendorsProduct(pagination.current, pagination.pageSize);
  }, []);

  return (
    <CustomLayout pageTitle="Vendors" menuKey="6">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Vendors Products
      </Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true, // Enable changing page size
        }}
        onChange={handleTableChange}
        bordered
      />
    </CustomLayout>
  );
};

export default VendorProduct;

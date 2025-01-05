import React, { useEffect, useState } from "react";
import CustomLayout from "../../Components/Layout/Layout";
import { Button, Table, Tag, Typography, Dropdown, Menu } from "antd";
import useRetryRequest from "../../Api/useRetryRequest";
import API_BASE_URL from "../../constants";
import axiosInstance from "../../Api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const VendorProduct = () => {
  const { id } = useParams();
  const { Title } = Typography;
  const navigate = useNavigate();
  const retryRequest = useRetryRequest();

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // State to manage the filter

  const fetchVendorsProduct = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/vendor-products/${id}`)
      );
      const data = response.data.data.map((product) => ({
        key: product.Id,
        id: product.Id,
        name: product.Name,
        published: product.Published,
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleView = (record) => {
    navigate(`/edit-product/${record.id}`);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status); // Update the filter status
  };

  // Filter the data based on the selected filter
  const filteredData = dataSource.filter((product) => {
    if (filterStatus === "all") return true;
    return filterStatus === "published" ? product.published : !product.published;
  });

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
      title: "Published",
      dataIndex: "published",
      key: "published",
      align: "center",
      render: (published) =>
        published ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="volcano">Not Published</Tag>
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
    fetchVendorsProduct();
  }, []);

  // Create the dropdown menu for filtering
  const menu = (
    <Menu onClick={(e) => handleFilterChange(e.key)}>
      <Menu.Item key="all">All</Menu.Item>
      <Menu.Item key="published">Published</Menu.Item>
      <Menu.Item key="unpublished">Not Published</Menu.Item>
    </Menu>
  );

  return (
    <CustomLayout pageTitle="Vendors" menuKey="6">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Vendors Products
      </Title>

      {/* Filter Dropdown */}
      <Dropdown overlay={menu} trigger={['click']} style={{ marginBottom: 20 }}>
        <Button>Filter: {filterStatus === 'all' ? 'All' : filterStatus === 'published' ? 'Published' : 'Not Published'}</Button>
      </Dropdown>
      <br/>
      <br/>

      {/* Table displaying filtered products */}
      <Table
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        scroll={{ x: 'max-content' }} 
        bordered
      />
    </CustomLayout>
  );
};

export default VendorProduct;

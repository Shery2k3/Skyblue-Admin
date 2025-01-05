import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchVendorsProduct = useCallback(async () => {
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
      console.error("Error fetching vendor products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [id, retryRequest]);

  useEffect(() => {
    fetchVendorsProduct();
  }, [fetchVendorsProduct]);

  const handleView = (record) => {
    navigate(`/edit-product/${record.id}`);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status); // Update the filter status
    setPagination({ current: 1, pageSize: 10 }); // Reset pagination when filter changes
  };

  // Memoize the filtered data to optimize performance and avoid re-rendering
  const filteredData = useMemo(() => {
    return dataSource.filter((product) => {
      if (filterStatus === "all") return true;
      return filterStatus === "published" ? product.published : !product.published;
    });
  }, [dataSource, filterStatus]);

  // Memoize columns to prevent re-rendering
  const columns = useMemo(() => [
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
        <Button type="link" onClick={() => handleView(record)}>View</Button>
      ),
    },
  ], []);

  // Create the dropdown menu for filtering
  const menu = (
    <Menu onClick={(e) => handleFilterChange(e.key)}>
      <Menu.Item key="all">All</Menu.Item>
      <Menu.Item key="published">Published</Menu.Item>
      <Menu.Item key="unpublished">Not Published</Menu.Item>
    </Menu>
  );

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  return (
    <CustomLayout pageTitle="Vendors" menuKey="6">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Vendors Products
      </Title>

      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button type="primary" onClick={() => navigate(-1)}>Go Back</Button>

        {/* Filter Dropdown */}
        <Dropdown overlay={menu} trigger={['click']}>
          <Button>
            Filter: {filterStatus === 'all' ? 'All' : filterStatus === 'published' ? 'Published' : 'Not Published'}
          </Button>
        </Dropdown>
      </div>

      {/* Table displaying filtered products */}
      <Table
        dataSource={filteredData.slice(
          (pagination.current - 1) * pagination.pageSize,
          pagination.current * pagination.pageSize
        )}
        columns={columns}
        loading={loading}
        scroll={{ x: 'max-content' }} // Enable horizontal scroll for larger tables
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filteredData.length,
          onChange: handlePaginationChange,
        }}
      />
    </CustomLayout>
  );
};

export default VendorProduct;

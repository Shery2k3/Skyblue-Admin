import React, { useState, useEffect } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import {
    Table,
    Button,
    Modal,
    Checkbox,
    message,
    Input,
    Tag,
    Typography,
  } from "antd";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";

const ManufacturerDetail = () => {
  const [dataSource, setDataSource] = useState([]);
  const { Title } = Typography;
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/manufacturer/products/${id}`)
        );
        const data = response.data.map((product) => ({
            key: product.Id,
            id: product.Id,
            name: product.Name,
            isFeatured: product.IsFeaturedProduct,
          }));
          setDataSource(data);
      } catch (error) {
        console.error("Error fetching manufacturer data:", error);
      }
    };
    fetchProducts();
  }, [retryRequest]);

  const handleTableChange = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleView = (product) => {
    navigate(`/edit-product/${product.key}`);
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
        <Button onClick={() => handleView(record)}>View</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Manufacturer Detail" menuKey="4">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Manufacturer's Products
      </Title>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" size={buttonSize}>
          Add Product
        </Button>
      </div>
      <br />
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
      />
    </CustomLayout>
  );
};

export default ManufacturerDetail;

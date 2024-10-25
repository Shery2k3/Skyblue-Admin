import React, { useState, useEffect } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import {
    Table,
    Button,
    Tag,
    Typography, message
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

  const handleDelete = async (productId, manufacturerId) => {
    try {
      console.log("Ids",productId, manufacturerId);
      const response = await axiosInstance.delete(`/admin/manufacturer/product/${productId}/${manufacturerId}`);
      message.success(response.data.message);
      // Refresh the data after successful deletion
      setDataSource((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete the product.");
    }
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
          <Button onClick={() => handleDelete(record.id, id)} type="danger" style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleAddProduct = () => {
    navigate(`/manufacturer/products/add/${id}`);
  };

  return (
    <CustomLayout pageTitle="Manufacturer Detail" menuKey="4">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Manufacturer's Products
      </Title>
      <div style={{ textAlign: "right" }}>
        <Button onClick={handleAddProduct} type="primary" size={buttonSize}>
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

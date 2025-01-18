import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Button, Spin, Typography, Skeleton } from "antd";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import moment from "moment";

const { Title } = Typography;

const ImageWithSkeleton = ({ src, alt, style }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: "relative", ...style }}>
      {loading && (
        <Skeleton.Image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          active
        />
      )}
      <img
        src={src}
        alt={alt}
        style={{ ...style, display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const CurrentCartDetails = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const retryRequest = useRetryRequest();
  const { id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/specific-cart/${id}`)
        );
        const products = response.data;
        const productData = products.map((item) => ({
          key: item.ProductId,
          name: item.Name,
          quantity: item.Quantity,
          unitPrice: "$" + item.Price,
          total: "$" + (item.Price * item.Quantity).toFixed(2),
          createdOn: item.CreatedOnUTC,
        }));
        setDataSource(productData);
      } catch (error) {
        console.error("Error fetching cart details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [retryRequest, id]);

  const handleTableChange = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNameClick = (product) => {
    navigate(`/products/${product.key}`);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <a onClick={() => handleNameClick(record)}>{record.name}</a>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
      align: "center",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "N/A"),
    },
  ];

  return (
    <CustomLayout pageTitle="Cart Details" menuKey="8">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Cart Details
      </Title>
      <Table
        dataSource={dataSource}
        loading={loading}
        columns={columns}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
      />
    </CustomLayout>
  );
};

export default CurrentCartDetails;
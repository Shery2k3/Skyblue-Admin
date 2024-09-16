import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Typography, Skeleton } from 'antd';
import CustomLayout from '../../Components/Layout/Layout';
import axiosInstance from '../../Api/axiosConfig';
import useRetryRequest from '../../Api/useRetryRequest';

const { Title } = Typography;

const ImageWithSkeleton = ({ src, alt, style }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: 'relative', ...style }}>
      {loading && (
        <Skeleton.Image
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          active
        />
      )}
      <img
        src={src}
        alt={alt}
        style={{ ...style, display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const BestSeller = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const retryRequest = useRetryRequest();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/bestseller?size=100`)
        );
        const products = response.data;
        const productData = products.map((item) => ({
          key: item.Id,
          imageUrl: item.Images[0],
          productName: item.Name,
          quantity: item.Quantity,
          total: "$" + item.Amount.toFixed(2),
        }));
        setDataSource(productData);
      } catch (error) {
        console.error("Error fetching bestseller data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [retryRequest]);

  const handleView = (product) => {
    navigate(`/edit-product/${product.key}`);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (imageUrl) => (
        <ImageWithSkeleton src={imageUrl} alt="product-img" style={{ height: 50 }} />
      ),
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Total Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
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
    <CustomLayout pageTitle="Best Sellers" menuKey="6">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Best Sellers
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

export default BestSeller;
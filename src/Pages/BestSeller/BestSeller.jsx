import CustomLayout from "../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spin } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const BestSeller = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch products with retry logic
        const response = await retryRequest(() => axiosInstance.get(`/admin/bestseller?size=100`));
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
        <img alt="product-img" src={imageUrl} style={{ height: 50 }} />
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
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
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

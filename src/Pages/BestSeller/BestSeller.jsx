import CustomLayout from "../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../constants.js";

const BestSeller = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/bestseller?size=100`);
      const products = response.data;

      const productData = products.map((item) => ({
        key: item.Id,
        imageUrl: item.Images[0],
        productName: item.Name,
        quantity: item.Quantity,
        total: "$"+item.Amount.toFixed(2),
      }));

      setDataSource(productData);
    } catch (error) {
      console.error("Error fetching Order data:", error);
    }
  };

  const handleView = (product) => {
    navigate(`/orders/${product.Id}`);
  };

  const columns = [
    {
      title: "image",
      dataIndex: "imageUrl",
      render: (theImageURL) => (
        <img alt="product-img" src={theImageURL} style={{ height: 50 }} />
      ),
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Total quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Total amount",
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
    <CustomLayout pageTitle="Order Details">
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </CustomLayout>
  );
};

export default BestSeller;

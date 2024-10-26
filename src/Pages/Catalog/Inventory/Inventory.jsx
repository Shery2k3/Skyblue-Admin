import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import { useMediaQuery } from "react-responsive";
import useRetryRequest from "../../../Api/useRetryRequest";
import {
  Table,
  Input,
  Button,
  Select,
  Pagination,
  Space,
  Typography,
  Image,
  Skeleton,
  message,
} from "antd";

import {
  SearchOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

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
      <Image
        src={src}
        alt={alt}
        style={{ ...style, display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [published, setPublished] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editStock, setEditStock] = useState({});

  const { Title } = Typography;
  const { Option } = Select;
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/inventory?`, {
          params: { category, product, published, size: 20, page },
        })
      );
      const products = response.data.products;
      const productData = products.map((item) => ({
        key: item.Id,
        imageUrl: item.imageUrl,
        productName: item.Name,
        stock: item.StockQuantity,
        productCost: item.ProductCost,
        total: "$" + (item.StockQuantity * item.ProductCost).toFixed(2),
      }));
      setDataSource(productData);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching bestseller data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEditStock = (key) => {
    setEditStock((prev) => ({
      ...prev,
      [key]: dataSource.find((item) => item.key === key).stock,
    }));
  };

  const handleSaveStock = async (key) => {
    try {
      const stockQuantity = editStock[key];

      // Call the API to update stock quantity
      const response = await axiosInstance.patch(
        `/admin/product-stock/${key}`,
        {
          stockQuantity,
        }
      );

      if (response.data.success) {
        // Update the dataSource with the new stock quantity
        setDataSource((prevDataSource) =>
          prevDataSource.map((item) =>
            item.key === key ? { ...item, stock: stockQuantity } : item
          )
        );
        message.success("Stock quantity updated successfully");
        // Clear edit state
        setEditStock((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      } else {
        console.error("Failed to update stock quantity");
      }
    } catch (error) {
      console.error("Error updating stock quantity:", error);
    }
  };
  const handleIncrement = (key) => {
    setEditStock((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const handleDecrement = (key) => {
    setEditStock((prev) => ({
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0),
    }));
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      fixed: "left",
      render: (imageUrl) => (
        <ImageWithSkeleton
          src={imageUrl}
          alt="product-img"
          style={{
            maxHeight: 50,
            maxWidth: 100,
            height: "auto",
            width: "auto",
          }}
        />
      ),
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      render: (stock, record) =>
        editStock[record.key] !== undefined ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              icon={<MinusOutlined />}
              onClick={() => handleDecrement(record.key)}
            />
            <Input
              value={editStock[record.key]}
              onChange={(e) =>
                setEditStock((prev) => ({
                  ...prev,
                  [record.key]: Number(e.target.value),
                }))
              }
              style={{ width: 60, textAlign: "center", margin: "0 5px" }}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleIncrement(record.key)}
            />
          </div>
        ) : (
          <div>{stock}</div>
        ),
    },
    {
      title: "Product Cost",
      dataIndex: "productCost",
      key: "productCost",
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) =>
        editStock[record.key] !== undefined ? (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => handleSaveStock(record.key)}
          >
            Save
          </Button>
        ) : (
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditStock(record.key)}
          >
            Edit
          </Button>
        ),
    },
  ];

  return (
    <CustomLayout pageTitle="Inventory" menuKey="5">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Inventory
      </Title>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Space
          size={buttonSize}
          align="center"
          style={{ justifyContent: "center" }}
          wrap
        >
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ width: isSmallScreen ? "100%" : 200 }}
            prefix={<SearchOutlined />}
          />
          <Input
            placeholder="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ width: isSmallScreen ? "100%" : 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            value={published}
            onChange={(value) => setPublished(value)}
            style={{ width: isSmallScreen ? "100%" : 200 }}
          >
            <Option value="1">Published</Option>
            <Option value="0">Unpublished</Option>
            <Option value="">All</Option>
          </Select>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            style={{ width: isSmallScreen ? "100%" : "auto" }}
          >
            Search
          </Button>
        </Space>
      </div>
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

export default Inventory;

//@desc ToBe Done: Disable button of "Select" from search table if product is already associated with discount
//@desc ToBe Done: Issue on Delete button, ahve to refresh after clicking delete, to update ui
//@desc ToBe Done: Make Modal responsive for mobile view "HeHe @_@"

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Pagination,
  Space,
  Typography,
  Card,
  Modal,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const AppliedToProduct = () => {
  const retryRequest = useRetryRequest();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const { id } = useParams();

  // State management
  const [productsSearch, setProductsSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState();
  const [published, setPublished] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch manufacturers on load
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/manufacturer")
        );
        setManufacturers(response.data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      }
    };
    fetchManufacturers();
  }, [retryRequest]);

  // Fetch products for search modal
  const fetchProductsSearch = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        category,
        product,
        published,
        size: 20,
        page,
        manufacturer: selectedManufacturer,
      };

      const response = await retryRequest(() =>
        axiosInstance.get("/admin/product/search", { params })
      );

      const { products, totalItems, currentPage } = response.data;
      setProductsSearch(products);
      setTotalItems(totalItems);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch associated products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/get-discount-to-product/${id}`)
      );
      const { success, result } = response.data;
      if (success && result) {
        setAllProducts(
          result.map((product) => ({
            ...product,
            key: product.Product_Id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component load
  useEffect(() => {
    fetchProductsSearch();
    fetchProducts();
  }, []);

  // Handlers
  const handleSearch = () => fetchProductsSearch(1);
  const handleKeyPress = (e) => e.key === "Enter" && handleSearch();
  const handlePageChange = (page) => fetchProductsSearch(page);
  const handleAddProductClick = () => setIsModalVisible(true);
  const handleModalCancel = () => setIsModalVisible(false);

  const handleProductSelection = async (productId) => {
    try {
      setLoading(true);
      const response = await retryRequest(() =>
        axiosInstance.post(`/admin/applyDiscountToProduct/${id}`, {
          productIds: [productId],
        })
      );

      if (response.data.success) {
        console.log("Discount applied to product successfully.");
        fetchProducts();
        setIsModalVisible(false);
      } else {
        console.error("Failed to apply discount:", response.data.message);
      }
    } catch (error) {
      console.error("Error applying discount to product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleViewProduct = (productId) => {
    try {
      navigate(`/edit-product/${productId}`);
    } catch (error) {
      console.error("Error viewing product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true); // Optionally show a loading state
      console.log("productId", productId);
  
      // Call the backend to remove the discount from the product
      await retryRequest(() =>
        axiosInstance.post(`/admin/removeDiscountFromProduct/${id}`, {
          productIds: [productId], // Send the product ID in the body
        })
      );
      
      message("Discount successfully removed from product.");
  
      setAllProducts((prevProducts) =>
        prevProducts.filter((product) => product.Product_Id !== productId)
      );
  
    } catch (error) {
      console.error("Error removing discount from product:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };
  
  

  // Columns
  const searchColumns = [
    { title: "Name", dataIndex: "Name", key: "Name", align: "center" },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
      align: "center",
    },
    { title: "ID", dataIndex: "Id", key: "Id", align: "center" },
    {
      title: "Published",
      key: "Published",
      align: "center",
      render: (_, record) => <span>{record.Published ? "Yes" : "No"}</span>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleProductSelection(record.Id)}
        >
          Select
        </Button>
      ),
    },
  ];

  const displayColumns = [
    { title: "Product Name", dataIndex: "Name", key: "Name", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewProduct(record.Product_Id)}
          >
            View
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteProduct(record.Product_Id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Product Management
      </Title>

      <Button
        type="primary"
        onClick={handleAddProductClick}
        style={{ marginBottom: 20 }}
      >
        Add Product
      </Button>

      <Table
        columns={displayColumns}
        dataSource={allProducts}
        loading={loading}
        rowKey="Id"
        pagination={false}
      />

      <Modal
        title="Add Product"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Space
            align="center"
            style={{
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 16,
            }}
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
              placeholder="Manufacturer"
              value={selectedManufacturer}
              onChange={setSelectedManufacturer}
              style={{ width: 200 }}
            >
              {manufacturers.map((manufacturer) => (
                <Option key={manufacturer.Id} value={manufacturer.Id}>
                  {manufacturer.Name}
                </Option>
              ))}
            </Select>
            <Select
              value={published}
              onChange={setPublished}
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
        </Card>

        <Table
          columns={searchColumns}
          dataSource={productsSearch}
          loading={loading}
          rowKey="Id"
          pagination={false}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px 0",
          }}
        >
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={20}
            onChange={handlePageChange}
            showSizeChanger={false}
            size={isSmallScreen ? "small" : "default"}
          />
        </div>
      </Modal>
    </>
  );
};

export default AppliedToProduct;

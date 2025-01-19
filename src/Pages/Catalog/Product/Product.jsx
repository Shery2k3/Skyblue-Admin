//@desc: "Dwonlaod as catalog button" work properly and download the pdf file of product list

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Pagination,
  Tag,
  Space,
  Typography,
  Card,
  Popconfirm,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ZoomInOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import jsPDF from "jspdf";
import "jspdf-autotable";

import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import CustomLayout from "../../../Components/Layout/Layout";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState();
  const [selectedVendor, setSelectedVendor] = useState(); // New state for selected vendor
  const [published, setPublished] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [hoveredImage, setHoveredImage] = useState(null); // New state for hovered image
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const navigate = useNavigate();
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        category,
        product,
        published,
        size: 20,
        page,
      };

      if (selectedManufacturer) {
        params.manufacturer = selectedManufacturer;
      }

      if (selectedVendor) {
        params.vendor = selectedVendor;
      }

      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/search`, { params })
      );
      console.log("response", response.data.products);
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`)
        );
        setManufacturers(response.data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      }
    };

    fetchManufacturers();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/vendors`)
        );
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
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

  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/admin/product/${productId}`);
      // Refresh the product list after successful deletion
      fetchProducts(currentPage);
    } catch (err) {
      setError(err);
    }
  };

  const handleDownloadCatalog = async (page = 1) => {
    try {
      const params = {
        category,
        product,
        published,
        size: 50000, //50 thousand
        page,
      };
      // Fetch all products
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/search`, { params })
      );
      console.log("response", response.data.products);
      const allProducts = response.data.products;

      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Define columns for the table
      const columns = ["ID", "Name", "Price", "Stock Quantity", "Published"];

      // Map products to rows
      const rows = allProducts.map((product) => [
        product.Id,
        product.Name,
        product.Price,
        product.StockQuantity,
        product.Published,
      ]);

      // Generate table in the PDF
      doc.autoTable({
        startY: 20,
        head: [columns],
        body: rows,
      });

      // Save the PDF
      doc.save("ProductList.pdf");
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to download catalog");
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleManufacturerChange = (value) => {
    setSelectedManufacturer(value);
  };

  const handleVendorChange = (value) => {
    setSelectedVendor(value);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      fixed: "left",
      render: (text) => (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
          onMouseEnter={() => setHoveredImage(text)}
          onMouseLeave={() => setHoveredImage(null)}
          onClick={() => handleImageClick(text)}
        >
          <img
            src={text}
            alt="product"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 70,
              maxHeight: 70,
              objectFit: "contain",
              filter: hoveredImage === text ? "grayscale(100%)" : "none",
              transition: "filter 0.1s ease-in-out", // Add a quick transition
            }}
          />
          {hoveredImage === text && (
            <ZoomInOutlined
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
                color: "rgba(0, 0, 0, 0.5)",
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      align: "center",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      align: "center",
      render: (text) => (
        <Text
          style={{ fontSize: "14px", color: "#000000", fontWeight: "bold" }}
        >
          ${text}
        </Text>
      ),
    },
    {
      title: "SKU",
      dataIndex: "SKU",
      key: "SKU",
      align: "center",
      render: (text) => (
        <Text
          style={{ fontSize: "14px", color: "#000000", fontWeight: "bold" }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Barcode",
      dataIndex: "Barcode",
      key: "Barcode",
      align: "center",
      render: (text) => (
        <Text
          style={{ fontSize: "14px", color: "#000000", fontWeight: "bold" }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Box Barcode",
      dataIndex: "BoxBarcode",
      key: "BoxBarcode",
      align: "center",
      render: (text) => (
        <Text
          style={{ fontSize: "14px", color: "#000000", fontWeight: "bold" }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Published",
      dataIndex: "Published",
      key: "Published",
      align: "center",
      render: (text) =>
        text ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="red">Unpublished</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              console.log(`Navigating to /edit-product/${record.Id}`);
              navigate(`/edit-product/${record.Id}`);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const exportMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => console.log("Export to XML")}>
        Export to XML
      </Menu.Item>
      <Menu.Item key="2" onClick={() => console.log("Export to Excel (All)")}>
        Export to Excel (All)
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => console.log("Export to Excel (Selected)")}
      >
        Export to Excel (Selected)
      </Menu.Item>
    </Menu>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleDeleteSelected = () => {
    console.log("Delete Selected IDs:", selectedRowKeys);
  };

  const handleUnpublishSelected = async () => {
    console.log("Unpublish Selected IDs:", selectedRowKeys);
  };

  const handlepPublishSelected = async () => {
    console.log("Publish Selected IDs:", selectedRowKeys);
  };

  return (
    <CustomLayout pageTitle="Products" menuKey="3">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Products
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
            placeholder={
              <div style={{ display: "flex", alignItems: "center" }}>
                <SearchOutlined style={{ color: "black" }} />
                <p style={{ margin: 0, paddingLeft: "5px" }}>Manufacturer</p>
              </div>
            }
            value={selectedManufacturer}
            onChange={handleManufacturerChange}
            style={{ width: 200 }}
          >
            <Select.Option value={null}>
              <span style={{ color: "red" }}>Remove Manufacturer</span>
            </Select.Option>
            {manufacturers.map((manufacturer) => (
              <Select.Option key={manufacturer.Id} value={manufacturer.Id}>
                {manufacturer.Name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder={
              <div style={{ display: "flex", alignItems: "center" }}>
                <SearchOutlined style={{ color: "black" }} />
                <p style={{ margin: 0, paddingLeft: "5px" }}>Vendor</p>
              </div>
            }
            value={selectedVendor}
            onChange={handleVendorChange}
            style={{ width: 200 }}
          >
            <Select.Option value={null}>
              <span style={{ color: "red" }}>Remove Vendor</span>
            </Select.Option>
            {vendors.map((vendor) => (
              <Select.Option key={vendor.Id} value={vendor.Id}>
                {vendor.Name}
              </Select.Option>
            ))}
          </Select>
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

      <div
        style={{
          textAlign: "right",
          marginTop: "40px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button
          type="primary"
          onClick={() => navigate("/edit-product")}
          size="small"
        >
          Add Product
        </Button>
        <Dropdown overlay={exportMenu}>
          <Button size="small">
            Export <DownOutlined />
          </Button>
        </Dropdown>
        <Button size="small" onClick={handleDownloadCatalog}>
          Download as Catalog
        </Button>
        <Button size="small" danger onClick={handleDeleteSelected}>
          Delete Selected
        </Button>
        <Button size="small" onClick={handleUnpublishSelected}>
          Unpublish Selected
        </Button>
        <Button size="small" onClick={handlepPublishSelected}>
          Publish Selected
        </Button>
      </div>

      <Card
        style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
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
      </Card>
      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: 16 }}>
          {error.message}
        </div>
      )}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        centered
      >
        <img
          src={selectedImage}
          alt="Preview"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "500px", // Set a maximum width
            maxHeight: "500px", // Set a maximum height
            objectFit: "contain", // Ensure the image maintains its aspect ratio
          }}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Product;

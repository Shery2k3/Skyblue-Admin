import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
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
} from "@ant-design/icons";
import CustomLayout from "../../../Components/Layout/Layout";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const { Title, Text } = Typography;

const CategoryDetails = () => {
  const { id } = useParams();
  const [catagoryId, setCatagoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [hoveredImage, setHoveredImage] = useState(null); // New state for hovered image
  const navigate = useNavigate();
  const retryRequest = useRetryRequest();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [dataSource, setDataSource] = useState([]);

  const flattenCategories = (categories, parentPath = "", level = 0) => {
    let flatData = [];
    categories.forEach((category) => {
      const currentPath = parentPath
        ? `${parentPath} >> ${category.Name}`
        : category.Name;
      flatData.push({
        key: category.Id,
        id: category.Id,
        name: category.Name,
        path: currentPath,
        parentId: category.ParentId,
        published: category.Published,
        level,
        discountName: category.DiscountName,
        discountId: category.DiscountId,
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(
          flattenCategories(category.children, currentPath, level + 1)
        );
      }
    });
    return flatData;
  };
  const fetchCategories = async (search = "") => {
    setLoading(true); // Set loading to true
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/category/all`, {
          params: { search },
        })
      );
      const flatData = flattenCategories(response.data);
      setDataSource(flatData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      if (id) {
        const params = {
          category,
          size: 20,
          page,
        };

        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/product/search`, { params })
        );
        setProducts(response.data.products);
        setTotalItems(response.data.totalItems);
        setCurrentPage(response.data.currentPage);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
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
  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const matchedCategory = dataSource.find((item) => item.id === Number(id));
      if (matchedCategory) {
        setCatagoryId(id);
      } else {
        navigate("/categories/");
      }
    }
  }, [id, dataSource]);
  return (
    <CustomLayout pageTitle="catagories" menuKey="2">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Catagories
      </Title>
      <Input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ width: isSmallScreen ? "100%" : 200 }}
        prefix={<SearchOutlined />}
      />
      {/* <div
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
          float: "center",
        }}
      >
        <Button
          type="primary"
          onClick={() => navigate("/edit-product")}
          size="small"
        >
          Add Product
        </Button>
      </div> */}
      <Card
        style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Table
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

export default CategoryDetails;

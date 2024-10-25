import { useState, useEffect } from "react";
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
import { SearchOutlined, ZoomInOutlined } from "@ant-design/icons";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";
import CustomLayout from "../../../Components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const AddProductManufacturer = () => {
  const { customerId, manufacturerid } = useParams(); // Removed orderId from params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [published, setPublished] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const retryRequest = useRetryRequest();
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

      // The manufacturer filter can be removed since it's not being used
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/search`, { params })
      );
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error(err);
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
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProduct({ ...product, customerId }); // Removed orderId from here
    setIsModalVisible(true);
  };

  const handleSaveProduct = async () => {
    try {
      const payload = {
        productId: selectedProduct.Id,
        isFeaturedProduct: false, // or true if needed
        displayOrder: 0, // Set dynamically if necessary
      };

      await axiosInstance.post(
        `${API_BASE_URL}/admin/add-manufacturer-product/${manufacturerid}`, // Using manufacturerid from params
        payload
      );

      message.success("Product successfully added to manufacturer!");
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product to manufacturer:", error);
      message.error("Failed to add product to manufacturer.");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      render: (text) => (
        <div style={{ position: "relative", display: "inline-block", cursor: "pointer", width: "100%", height: "100%" }}>
          <img
            src={text}
            alt="product"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 70,
              maxHeight: 70,
              objectFit: "contain",
            }}
          />
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
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() =>
            handleAddProduct({
              Id: record.Id,
              Name: record.Name,
              imageUrl: record.imageUrl,
            })
          }
        >
          Add
        </Button>
      ),
    },
  ];

  return (
    <>
      <CustomLayout pageTitle="Order Details" menuKey="4">
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Add Product To Manufacturer
        </Title>
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: 24,
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
        </Card>

        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            rowKey="Id"
            pagination={false}
            scroll={{ x: "max-content" }}
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

        <Modal
          title="Add Product"
          visible={isModalVisible}
          onOk={handleSaveProduct}
          onCancel={() => setIsModalVisible(false)}
          okText="Save"
          cancelText="Cancel"
          destroyOnClose
        >
          <p>Product: {selectedProduct?.Name}</p>
          
        </Modal>
      </CustomLayout>
    </>
  );
};

export default AddProductManufacturer;

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
  Alert,
} from "antd";
import { SearchOutlined, ZoomInOutlined } from "@ant-design/icons";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";
import CustomLayout from "../../../../Components/Layout/Layout";
import { useParams } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const AddProduct = () => {
  const { orderId, customerId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState();
  const [published, setPublished] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

      if (selectedManufacturer) {
        params.manufacturer = selectedManufacturer;
      }

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
    setSelectedProduct({ ...product, orderId, customerId });
    setIsModalVisible(true);
    setQuantity(1);
  };

  const handleSaveProduct = async () => {
    if (selectedProduct) {
      const productData = {
        customerId: selectedProduct.customerId, // from selectedProduct
        quantity, // quantity from state
      };

      try {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/admin/orders/${orderId}/add-product/${selectedProduct.Id}`,
          productData
        );
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error saving product:", error);
      }
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      render: (text) => (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
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
      <CustomLayout pageTitle="Order Details" menuKey="7">
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Add Product
        </Title>
        {/* Warning Alert */}
        <Alert
          message="Please be sure to update the Price Details tab to avoid conflicts."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }} // Add some space below the alert
        />
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
              placeholder="Manufacturer"
              value={selectedManufacturer}
              onChange={(value) => setSelectedManufacturer(value)}
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
          footer={null}
          onCancel={() => setIsModalVisible(false)}
          centered
          width={400}
        >
          {selectedProduct && (
            <div style={{ textAlign: "center" }}>
              {/* Warning Alert in Modal */}
              <Alert
                message="Please be sure to update the Price Details tab to avoid conflicts."
                type="warning"
                showIcon
                style={{ marginBottom: 16 }} // Add some space below the alert
              />

              <Title level={4}>Product Details</Title>
              <Text strong>ID: {selectedProduct.Id}</Text>
              <br />
              <Text>Name: {selectedProduct.Name}</Text>
              <br />
              <Text>Order ID: {selectedProduct.orderId}</Text>
              <br />
              <Text>Customer ID: {selectedProduct.customerId}</Text>
              <br />

              {/* Quantity Input */}
              <Text>Quantity:</Text>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ marginTop: 8, width: "100%" }} // Adjust margin for spacing
                placeholder="Enter quantity"
              />
              <Button
                type="primary"
                onClick={handleSaveProduct}
                style={{ marginTop: 20 }}
              >
                Save Product
              </Button>
            </div>
          )}
        </Modal>
      </CustomLayout>
    </>
  );
};

export default AddProduct;

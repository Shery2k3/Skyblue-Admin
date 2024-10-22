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
  message, // Import Ant Design message
} from "antd";
import { SearchOutlined, ZoomInOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";
import CustomLayout from "../../../Components/Layout/Layout";

const { Option } = Select;
const { Title, Text } = Typography;

const Addflyer = () => {
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

  const navigate = useNavigate();
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
    setSelectedProduct({ ...product });
    setIsModalVisible(true);
    setQuantity(1);
  };

  const handleSaveProduct = async () => {
    if (selectedProduct) {
      const productData = {
        ProductId: selectedProduct.Id,
        Price: 0, // Fixed value
        DisplayOrder: 1, // Fixed value
        StoreId: 0, // Fixed value
      };

      console.log("productData", productData);
      try {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/admin/flyers/add-flyer`,
          productData
        );
        console.log("Response from server:", response.data);

        // Show success message after product is successfully added
        message.success("Product successfully added to flyer");

        setIsModalVisible(false);
      } catch (error) {
        console.error("Error saving product:", error);
        message.error("Failed to add product to flyer");
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
      <CustomLayout pageTitle="Order Details" menuKey="16">
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Add Product For Flyer
        </Title>

        {/* "Go Back" Button */}
        <div style={{ marginBottom: 20 }}>
          <Button onClick={() => navigate("/flyer")}>Go Back</Button>
        </div>

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
          onOk={handleSaveProduct}
          onCancel={() => setIsModalVisible(false)}
        >
          <p>Selected Product: {selectedProduct?.Name}</p>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Quantity"
          />
        </Modal>
      </CustomLayout>
    </>
  );
};

export default Addflyer;

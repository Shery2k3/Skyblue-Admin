import {
  Button,
  Card,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { useMediaQuery } from "react-responsive";

const { Text } = Typography;

const CatrgoryProducts = ({ id }) => {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const retryRequest = useRetryRequest();

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const fetchCategoryProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(
          `${API_BASE_URL}/admin/product/search?categoryId=${id}&&page=${page}`
        )
      );
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Try Again");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchCategoryProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [id]);

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
              filter: hoveredImage === text ? "grayscale(1%)" : "none",
              transition: "filter 0.1s ease-in-out", 
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
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 200,
      render: (text, record) => (
        <Space>
          <Button
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
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Card title={"Products"}>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="Id"
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
            maxWidth: "500px",
            maxHeight: "500px",
            objectFit: "contain",
          }}
        />
      </Modal>
    </Card>
  );
};

export default CatrgoryProducts;

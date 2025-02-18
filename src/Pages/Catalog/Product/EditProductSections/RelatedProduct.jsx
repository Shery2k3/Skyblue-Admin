import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../../Api/useRetryRequest";
import axiosInstance from "../../../../Api/axiosConfig";
import { message, Table, Card, Button, Popconfirm, Modal, Select, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from "../../../../constants";
import { useMediaQuery } from "react-responsive";

const RelatedProduct = () => {
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [published, setPublished] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const retryRequest = useRetryRequest();

  const fetchRelatedProduct = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/related-products/${id}`)
      );
      setRelatedProducts(response.data.result);
    } catch (error) {
      message.error("Failed to fetch related products");
    }
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/search`, {
          params: { size: 10, page, category, product, published },
        })
      );
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRelatedProduct();
  }, [id]);

  const handleDelete = async (record) => {
    console.log(record);  // For debugging
    try {
      // Ensure the body is correctly passed for the DELETE request
      await axiosInstance.delete(
        `${API_BASE_URL}/admin/product/delete-related-products/${id}`,
        {
          data: { relatedProductId: record.ProductId2 },  // Use `data` for sending the body in DELETE requests
        }
      );
  
      message.success("Related product deleted successfully");
      fetchRelatedProduct();
    } catch (error) {
      console.error(error);  
      message.error("Failed to delete related product");
    }
  };
  

  const handleAdd = async (record) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/admin/product/add-related-products/${id}`, {
        relatedProductId: record.Id,
      });

      if (response.data.success) {
        message.success(response.data.result.message || "Related product added successfully");
        fetchRelatedProduct();
        setIsModalOpen(false);
      } else {
        message.warning(response.data.result.message || "Related product already exists");
      }
    } catch (error) {
      message.error("Failed to add related product");
    }
  };

  const columns = [
    { title: "Product Name", dataIndex: "ProductName", key: "ProductName" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" style={{ marginLeft: 8 }}>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? <strong key={index}>{part}</strong> : part
    );
  };

  const modalColumns = [
    {
      title: "Product Name",
      dataIndex: "Name",
      key: "Name",
      render: (text) => highlightText(text, searchTerm),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAdd(record)}>
          Add
        </Button>
      ),
    },
  ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setSearchTerm(product);
    fetchProducts(1);
  };

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  return (
    <Card title="Related Products">
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Add New
      </Button>
      
      <Table
        columns={columns}
        dataSource={relatedProducts}
        rowKey="ProductId2"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Add Related Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
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

        <Table
          columns={modalColumns}
          dataSource={products}
          rowKey="Id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalItems,
            onChange: (page) => fetchProducts(page),
          }}
        />
      </Modal>
    </Card>
  );
};

export default RelatedProduct;
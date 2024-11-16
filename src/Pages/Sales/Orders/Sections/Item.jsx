import {
  Table,
  Input,
  Button,
  Space,
  Skeleton,
  Image,
  message,
  Spin,
  Divider,
  Alert,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";

const ImageWithSkeleton = ({ src, alt, style }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
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
      <img
        src={src}
        alt={alt}
        style={{ ...style, display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const ItemTable = ({ dataSource }) => {
  const { id } = useParams(); // Destructure to get orderId from the route
  const [editingKey, setEditingKey] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract customerId from dataSource if available
  const customerId = dataSource.length > 0 ? dataSource[0].customerId : null;

  useEffect(() => {
    setEditedData(dataSource);
  }, [dataSource]);

  const handleInputChange = (value, key, field) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );
  };

  const onEditClick = (key) => {
    setEditingKey(key);
  };

  const handleSave = async (key) => {
    const productToSave = editedData.find((item) => item.key === key); // Find the product by the key
    if (!productToSave) {
      message.error("Product not found");
      return;
    }

    const {
      productid, // Destructure productid from productToSave
      quantity,
      unitpriceincltax: unitPriceInclTax,
      unitpriceexcltax: unitPriceExclTax,
      priceincltax: priceInclTax,
      priceexcltax: priceExclTax,
      discountamountincltax: discountAmountInclTax,
      discountamountexcltax: discountAmountExclTax,
      originalproductcost: originalProductCost,
    } = productToSave;

    setLoading(true);

    try {
      await axiosInstance.patch(
        `/admin/orders/${id}/order-items/${productToSave.productid}`, // Use the correct productid here
        {
          quantity,
          unitPriceInclTax,
          unitPriceExclTax,
          priceInclTax,
          priceExclTax,
          discountAmountInclTax,
          discountAmountExclTax,
          originalProductCost,
        }
      );
      message.success("Product details updated successfully");
      setEditingKey(null);
    } catch (error) {
      console.error("Failed to update product details", error);
      message.error("Failed to update product details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      fixed: "left",
      render: (imageUrl) => (
        <ImageWithSkeleton
          src={imageUrl}
          alt="product"
          style={{ maxHeight: 75, maxWidth: 75 }}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "gray" }}>{record.vendor}</div>
        </>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (text, record) => (
        <>
          <div>
            Excl. Tax:{" "}
            {editingKey === record.key ? (
              <Input
                value={record.priceexcltax}
                onChange={(e) =>
                  handleInputChange(e.target.value, record.key, "priceexcltax")
                }
                style={{ width: 70 }}
                size="small"
              />
            ) : (
              `$${record.priceexcltax}`
            )}
          </div>
          <div>
            Incl. Tax:{" "}
            {editingKey === record.key ? (
              <Input
                value={record.priceincltax}
                onChange={(e) =>
                  handleInputChange(e.target.value, record.key, "priceincltax")
                }
                style={{ width: 70 }}
                size="small"
              />
            ) : (
              `$${record.priceincltax}`
            )}
          </div>
        </>
      ),
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      render: (text, record) => (
        <>
          <div>
            Excl. Tax:{" "}
            {editingKey === record.key ? (
              <Input
                value={record.unitpriceexcltax}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    record.key,
                    "unitpriceexcltax"
                  )
                }
                style={{ width: 70 }}
                size="small"
              />
            ) : (
              `$${record.unitpriceexcltax}`
            )}
          </div>
          <div>
            Incl. Tax:{" "}
            {editingKey === record.key ? (
              <Input
                value={record.unitpriceincltax}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    record.key,
                    "unitpriceincltax"
                  )
                }
                style={{ width: 70 }}
                size="small"
              />
            ) : (
              `$${record.unitpriceincltax}`
            )}
          </div>
        </>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) =>
        editingKey === record.key ? (
          <Input
            value={record.quantity}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "quantity")
            }
            style={{ width: 50 }}
            size="small"
          />
        ) : (
          text
        ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) => (
        <div style={{ textAlign: "center", fontSize: "13px" }}>{location}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          {editingKey === record.key ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={() => handleSave(record.key)}
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Save"}
              </Button>
              <Button
                type="default"
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditClick(record.key)}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const navigate = useNavigate();

  // Adding new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (customerId) {
      navigate(`/orders/${id}/addproduct/${customerId}`);
    } else {
      message.error("Customer ID is not available");
    }
  };

  return (
    <>
      <Divider orientation="left">Product Details</Divider>

      <Button
        type="primary"
        onClick={handleAddProduct}
        style={{ marginBottom: 16 }}
      >
        Add New Product
      </Button>

      {editingKey && (
        <Alert
          message="Please be sure to update the PriceDetail Tab as well to avoid conflicts"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        dataSource={editedData}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey={(record) => record.key}
        pagination={false}
        size="small"
        bordered
        style={{
          backgroundColor: "#f0f2f5",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </>
  );
};

ItemTable.propTypes = {
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      priceexcltax: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      priceincltax: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      unitpriceexcltax: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      unitpriceincltax: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      quantity: PropTypes.number.isRequired,
      vendor: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      customerId: PropTypes.string, // Optional if customerId can be missing
    })
  ).isRequired,
};

export default ItemTable;

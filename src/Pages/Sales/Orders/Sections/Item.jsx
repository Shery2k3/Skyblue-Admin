import { Table, Input, Button, Space, Image, message, Spin, Divider } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ItemTable = ({ dataSource }) => {
  const [editingKey, setEditingKey] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    const productToSave = editedData.find((item) => item.key === key);
    setLoading(true);

    try {
      await axios.post("/price/order/update", { productData: productToSave });
      message.success("Product details updated successfully");
      setEditingKey(null);
    } catch (error) {
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
      render: (imageUrl) => (
        <Image
          width={50}
          src={imageUrl}
          alt="Product"
          style={{ borderRadius: "5px" }}
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
                  handleInputChange(e.target.value, record.key, "unitpriceexcltax")
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
                  handleInputChange(e.target.value, record.key, "unitpriceincltax")
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
      render: (text, record) => (
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
        )
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

  return (
    <>
      <Divider orientation="left">Product Details</Divider>
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
      unitpriceexcltax: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      unitpriceincltax: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      quantity: PropTypes.number.isRequired,
      vendor: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ItemTable;

import { Button, Descriptions, Divider, Input, Space, message, Spin } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const Price = ({ priceDetail }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedPrice, setEditedPrice] = useState(priceDetail); // Local state for edits
  const [loading, setLoading] = useState(false); // For showing spinner during save

  // Toggle edit mode
  const onEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes
  const handleInputChange = (value, key) => {
    setEditedPrice((prevPrice) =>
      prevPrice.map((item) =>
        item.key === key ? { ...item, children: value } : item
      )
    );
  };

  // Save changes
  const handleSave = async () => {
    setLoading(true); // Start spinner

    try {
      const response = await axios.post("/price/order/update", { priceDetail: editedPrice });
      message.success("Price details updated successfully");
      setIsEditing(false); // Exit edit mode after successful save
    } catch (error) {
      message.error("Failed to update price details");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <>
      <Divider orientation="left">Price Details</Divider>
      <Descriptions layout="horizontal" size="small" bordered>
        {editedPrice.map((item) => (
          <Descriptions.Item
            key={item.key}
            label={item.label}
            span={item.span}
          >
            {isEditing ? (
              <Input
                value={item.children}
                onChange={(e) => handleInputChange(e.target.value, item.key)}
              />
            ) : (
              item.children
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>

      <Space style={{ marginTop: "15px" }}>
        {isEditing ? (
          <>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="small"
              onClick={handleSave}
              disabled={loading} // Disable button when loading
            >
              {loading ? <Spin size="small" /> : "Save"}
            </Button>
            <Button
              type="default"
              icon={<CloseOutlined />}
              size="small"
              onClick={onEditClick}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={onEditClick}
          >
            Edit Price
          </Button>
        )}
      </Space>
    </>
  );
};

Price.propTypes = {
  priceDetail: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      span: PropTypes.number,
      children: PropTypes.node,
    })
  ).isRequired,
};

export default Price;

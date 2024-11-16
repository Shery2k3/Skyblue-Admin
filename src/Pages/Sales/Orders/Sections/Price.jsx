import {
  Button,
  Descriptions,
  Divider,
  Input,
  Space,
  message,
  Spin,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";

const Price = ({ priceDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(priceDetail);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  // Toggle edit mode
  const onEditClick = () => {
    setIsEditing(!isEditing);
  };

  const extractNumeric = (value) => {
    const match = value.match(/([\D]*)(\d+\.?\d*)([\D]*)/);
    return match
      ? {
        prefix: match[1] || "",
        number: match[2] || "",
        suffix: match[3] || "",
      }
      : { prefix: "", number: value, suffix: "" };
  };

  // Update the local state for the edited price
  const handleInputChange = (value, key) => {
    // Update the editedPrice state with the new numeric value
    setEditedPrice((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, children: `$${value}` } : item // Add dollar sign
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToUpdate = {};

    // Populate dataToUpdate based on editedPrice
    editedPrice.forEach(item => {
      if (item.children) {
        const numericValue = extractNumeric(item.children).number; // Extract numeric part
        switch (item.label) {
          case 'Order Subtotal(Excl Tax)':
            dataToUpdate.orderSubtotalExclTax = parseFloat(numericValue);
            break;
          case 'Order Subtotal (Incl Tax)':
            dataToUpdate.orderSubtotalInclTax = parseFloat(numericValue);
            break;
          case 'Order Tax':
            dataToUpdate.orderTax = parseFloat(numericValue);
            break;
          case 'Order Discount':
            dataToUpdate.orderDiscount = parseFloat(numericValue);
            break;
          case 'Order Total':
            dataToUpdate.orderTotal = parseFloat(numericValue);
            break;
          default:
            break;
        }
      }
    });

    if (Object.keys(dataToUpdate).length === 0) {
      message.error("No changes detected to save.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.patch(`/admin/editprice/${id}`, dataToUpdate);
      message.success("Price details updated successfully");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update price details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Divider orientation="left">Price Details</Divider>
      <Descriptions layout="horizontal" size="small" bordered>
        {editedPrice.map((item) => (
          <Descriptions.Item key={item.key} label={item.label} span={item.span}>
            {isEditing ? (
              <Input
                value={extractNumeric(item.children).number} // Show only the numeric part for editing
                onChange={(e) => handleInputChange(e.target.value, item.key)}
              />
            ) : (
              item.children // Display with dollar sign when not editing
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
              disabled={loading}
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

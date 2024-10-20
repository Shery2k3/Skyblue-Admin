import { Button, Descriptions, Divider, Input, Space, message, Spin } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";

const Price = ({ priceDetail }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedPrice, setEditedPrice] = useState(priceDetail); // Local state for edits
  const [loading, setLoading] = useState(false); // For showing spinner during save

  console.log("priceDetail", priceDetail);

  const { id } = useParams();

  // Toggle edit mode
  const onEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Extract numeric part from price, keeping symbols
  const extractNumeric = (value) => {
    const match = value.match(/([\D]*)(\d+\.?\d*)([\D]*)/); // Match numbers surrounded by non-digit characters
    return match ? { prefix: match[1], number: match[2], suffix: match[3] } : { prefix: '', number: value, suffix: '' };
  };

  // Handle input changes - only allow editing the numeric portion
  const handleInputChange = (value, key) => {
    setEditedPrice((prevPrice) =>
      prevPrice.map((item) => {
        if (item.key === key) {
          const { prefix, suffix } = extractNumeric(item.children);
          return { ...item, children: `${prefix}${value}${suffix}` }; // Update only numeric part
        }
        return item;
      })
    );
  };

  // Save changes
  const handleSave = async () => {
    setLoading(true); // Start spinner

    // Extract the fields to update dynamically using 'field' property
    const dataToUpdate = {};
    editedPrice.forEach((item) => {
      if (item.editable && item.field) {
        const { number } = extractNumeric(item.children); // Save only the numeric portion to the database
        dataToUpdate[item.field] = number;
      }
    });

    try {
      console.log("dataToUpdate", dataToUpdate); // Debugging output

      // Send a PATCH request to update the order details
      const response = await axiosInstance.patch(`/admin/editprice/${id}`, dataToUpdate);

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
          <Descriptions.Item key={item.key} label={item.label} span={item.span}>
            {isEditing ? (
              <Input
                value={extractNumeric(item.children).number} // Show only the numeric part for editing
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
            <Button type="default" icon={<CloseOutlined />} size="small" onClick={onEditClick}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={onEditClick}>
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

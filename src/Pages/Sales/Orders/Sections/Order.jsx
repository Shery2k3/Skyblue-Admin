import { Button, Descriptions, Divider, Input, Space, message, Spin, Select } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const { Option } = Select;

const Order = ({ orderDetail }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedOrder, setEditedOrder] = useState(orderDetail); // Local state for edits
  const [loading, setLoading] = useState(false); // For showing spinner during save

  // Status Mapping for `orderStatusId`
  const statusMapping = {
    10: "Pending",
    20: "Processing",
    30: "Completed",
    40: "Cancelled",
  };

  // Toggle edit mode
  const onEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes
  const handleInputChange = (value, key) => {
    setEditedOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.key === key ? { ...item, children: value } : item
      )
    );
  };


  {/*INTEGRATE THE API HERE LATER */}


  // Save changes
  const handleSave = async () => {
    setLoading(true); // Start spinner
    try {
      const response = await axios.post("/edit/order", { orderDetail: editedOrder });
      message.success("Order updated successfully");
      setIsEditing(false); // Exit edit mode after successful save
    } catch (error) {
      message.error("Failed to update order");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <>
      <Divider orientation="left">Order Details</Divider>
      <Descriptions layout="horizontal" size="small" bordered>
        {editedOrder.map((item) => (
          <Descriptions.Item
            key={item.key}
            label={item.label}
            span={item.span}
            style={{ backgroundColor: isEditing ? "#f9f9f9" : "white" }} // Highlight editable fields
          >
            {isEditing && item.label === "Order Status" ? (
              // If editing the "Order Status", show dropdown
              <Select
                value={item.children}
                onChange={(value) => handleInputChange(value, item.key)}
                style={{ width: "100%" }}
              >
                {Object.entries(statusMapping).map(([key, value]) => (
                  <Option key={key} value={parseInt(key)}>
                    {value}
                  </Option>
                ))}
              </Select>
            ) : item.label === "Order Status" ? (
              // Display status text based on orderStatusId
              statusMapping[item.children] || "Unknown Status"
            ) : isEditing ? (
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
            Edit Order
          </Button>
        )}
      </Space>
    </>
  );
};

Order.propTypes = {
  orderDetail: PropTypes.array.isRequired,
};

export default Order;

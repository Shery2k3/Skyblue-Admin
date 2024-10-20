//tw api will be inegrated here, had to add firstname n last name text, will be dropdown of cntry and state province selection


import { Button, Descriptions, Divider, Input, Space, message, Spin } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

const User = ({ userDetail }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedUser, setEditedUser] = useState(userDetail); // Local state for edits
  const [loading, setLoading] = useState(false); // For showing spinner during save

  const [firstName, setFirstName] = useState(""); // For splitting full name
  const [lastName, setLastName] = useState(""); // For splitting full name

  useEffect(() => {
    // Initialize first and last name by splitting the full name
    const fullNameObj = userDetail.find((item) => item.label === "Full Name");
    if (fullNameObj) {
      const nameParts = fullNameObj.children.split(" ");
      setFirstName(nameParts[0]);
      setLastName(nameParts.slice(1).join(" "));
    }
  }, [userDetail]);

  // Toggle edit mode
  const onEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes for regular fields
  const handleInputChange = (value, key) => {
    setEditedUser((prevUser) =>
      prevUser.map((item) =>
        item.key === key ? { ...item, children: value } : item
      )
    );
  };

  // Save changes
  const handleSave = async () => {
    setLoading(true); // Start spinner

    // Combine first and last name before saving
    const updatedUser = editedUser.map((item) =>
      item.label === "Full Name"
        ? { ...item, children: `${firstName} ${lastName}` }
        : item
    );

    try {
      const response = await axios.post("/edit/shipping-billing", { userDetail: updatedUser });
      message.success("User details updated successfully");
      setIsEditing(false); // Exit edit mode after successful save
    } catch (error) {
      message.error("Failed to update user details");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <>
      <Divider orientation="left">Shipping and Billing Info</Divider>
      <Descriptions layout="horizontal" size="small" bordered>
        {editedUser.map((item) => (
          <Descriptions.Item
            key={item.key}
            label={item.label}
            span={item.span}
          >
            {/* Special case for "Full Name" */}
            {isEditing && item.label === "Full Name" ? (
              <Space>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: "48%" }}
                />
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: "48%" }}
                />
              </Space>
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
            Edit Info
          </Button>
        )}
      </Space>
    </>
  );
};

User.propTypes = {
  userDetail: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      span: PropTypes.number,
      children: PropTypes.node,
    })
  ).isRequired,
};

export default User;

import React, { useState, useEffect } from "react";
import { Select, Input, Button, Row, Col, Form, Spin } from "antd";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";

const { Option } = Select;

const FlyerGenerate = () => {
  const [selectedType, setSelectedType] = useState("Select");
  const [priceRole, setPriceRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");

  // Fetch roles data from backend
  const fetchCustomerRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/roles");
      const data = response.data.map((role) => ({
        id: role.Id,
        name: role.Name,
      }));
      console.log("response", data);
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle type selection change
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  // Handle price role selection change
  const handlePriceRoleChange = (value) => {
    setPriceRole(value);
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchCustomerRoles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={24}>
        {/* Left Section */}
        <Col span={12}>
          <h3>Select Type</h3>
          <Form.Item>
            <Select defaultValue="Select" onChange={handleTypeChange}>
              <Option value="Select">Select</Option>
              <Option value="SpecialPrice">SpecialPrice</Option>
              <Option value="PriceGroup">PriceGroup</Option>
            </Select>
          </Form.Item>

          {selectedType === "PriceGroup" && (
            <Form.Item label="Price Role:">
              <Select placeholder="Select Price Role" onChange={handlePriceRoleChange}>
                {roles
                  .filter((role) => role.name && role.name.startsWith("P")) 
                  .map((role) => (
                    <Option key={role.id} value={role.name}>
                      {role.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" style={{ marginRight: "10px" }}>
              FlyerPreview
            </Button>
            <Button type="default">Export PDF</Button>
          </Form.Item>
        </Col>

        {/* Right Section */}
        <Col span={12}>
          <h3>Subject</h3>
          <Form.Item>
            <Input
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Item>

          <h3>Roles</h3>
          <Form.Item>
            {loading ? (
              <Spin />
            ) : (
              <Select placeholder="Select a Role">
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default FlyerGenerate;

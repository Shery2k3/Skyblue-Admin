{
  /*

  File Brief
  FlyerGenerate component allows users to select flyer type and price role, 
  Fetches available roles from the backend, and previews flyer data in a modal.
  
  THING TOBE DONE
  1) Improve the Ui/Ux of Preview Flyer
  2) Implement the funtionality of Export PDF
  3) Adjust responsive design for mobile view
  
*/
}

import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Button,
  Row,
  Col,
  Form,
  Spin,
  Typography,
  DatePicker,
} from "antd";
import dayjs from 'dayjs';
import axiosInstance from "../../../../Api/axiosConfig";
import { pdf } from "@react-pdf/renderer";
import Flyer from "../../../../Components/Flyer/Flyer";

const { Option } = Select;
const { Title } = Typography;

const FlyerGenerate = () => {
  const [selectedType, setSelectedType] = useState("Select");
  const [priceRole, setPriceRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [start, setStartDate] = useState("");
  const [end, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [flyerData, setFlyerData] = useState(null);

  // Fetch roles data from backend
  const fetchCustomerRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/roles");
      const data = response.data.map((role) => ({
        id: role.Id,
        name: role.Name,
      }));
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
    // Reset price role when changing type
    if (value !== "PriceGroup") {
      setPriceRole(""); // Resetting the price role
    }
  };

  // Handle Start Date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // Handle End Date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
    console.log(end)
  };

  // Handle price role selection change
  const handlePriceRoleChange = (value) => {
    setPriceRole(value);
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchCustomerRoles();
  }, []);

  // Function to preview flyer
  const fetchFlyerData = async () => {
    setLoading(true);
    try {
      const roleId = priceRole
        ? roles.find((role) => role.name === priceRole)?.id
        : null;
      // Construct query parameters
      const params = roleId
        ? { role: JSON.stringify({ id: roleId, name: priceRole }) }
        : {};

      const response = await axiosInstance.get("/admin/flyers/flyer-preview", {
        params: params, // Pass params directly
      });

      setFlyerData(response.data.data);
    } catch (error) {
      console.error("Error fetching flyer preview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlyerData();
  }, [priceRole]);

  const previewFlyer = async () => {
    try {
      const blob = await pdf(
        <Flyer
          flyerData={flyerData}
          startDate={dayjs(start).format('MM-DD-YYYY')}
          endDate={ dayjs(end).format('MM-DD-YYYY') }
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank"); // Open the PDF in a new tab
    } catch (error) {
      console.error("Error generating flyer preview:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={24}>
        {/* Left Section */}
        <Col span={12}>
          <Form.Item label="Select Type:">
            <Select defaultValue="Select" onChange={handleTypeChange}>
              <Option value="Select">Select</Option>
              <Option value="SpecialPrice">SpecialPrice</Option>
              <Option value="PriceGroup">PriceGroup</Option>
            </Select>
          </Form.Item>

          {selectedType === "SpecialPrice" && (
            <div>
              <Form.Item label="Start Date:">
                <DatePicker
                  onChange={handleStartDateChange}
                  placeholder="Start Date"
                  format="M/D/YYYY"
                />
              </Form.Item>
              <Form.Item label="End Date:">
                <DatePicker
                  onChange={handleEndDateChange}
                  placeholder="Start Date"
                  format="M/D/YYYY"
                />
              </Form.Item>
            </div>
          )}

          {selectedType === "PriceGroup" && (
            <Form.Item label="Price Role:">
              <Select
                placeholder="Select Price Role"
                onChange={handlePriceRoleChange}
                value={priceRole}
              >
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
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={previewFlyer}
            >
              Flyer Preview
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

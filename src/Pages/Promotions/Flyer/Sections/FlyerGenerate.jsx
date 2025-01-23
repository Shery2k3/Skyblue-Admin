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
  Card,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../../../Api/axiosConfig";
import { pdf } from "@react-pdf/renderer";
import Flyer from "../../../../Components/Flyer/Flyer";
import { useMediaQuery } from "react-responsive";

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

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

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
    console.log(end);
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
          startDate={dayjs(start).format("MM/DD/YYYY")}
          endDate={dayjs(end).format("MM/DD/YYYY")}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank"); // Open the PDF in a new tab
    } catch (error) {
      console.error("Error generating flyer preview:", error);
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section */}

        <Col span={isSmallScreen ? 24 : 12}>
          <Card title="Flyer's Setting">
            <Form.Item style={{ marginBottom: "16px" }}>
              <h3 style={{ fontWeight: "500" }}>Select Type:</h3>
              <Select defaultValue="Select" onChange={handleTypeChange}>
                <Option value="Select">Select</Option>
                <Option value="SpecialPrice">Special Price</Option>
                <Option value="PriceGroup">Price Group</Option>
              </Select>
            </Form.Item>

            {selectedType === "SpecialPrice" && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Form.Item style={{ margin: "0 16px 16px 0" }}>
                  <h3 style={{ fontWeight: "500" }}>Start Date:</h3>
                  <DatePicker
                    onChange={handleStartDateChange}
                    placeholder="Start Date"
                    format="M/D/YYYY"
                  />
                </Form.Item>
                <Form.Item>
                  <h3 style={{ fontWeight: "500" }}>End Date:</h3>
                  <DatePicker
                    onChange={handleEndDateChange}
                    placeholder="Start Date"
                    format="M/D/YYYY"
                  />
                </Form.Item>
              </div>
            )}

            {selectedType === "PriceGroup" && (
              <Form.Item>
                <h3 style={{ fontWeight: "500" }}>Price Role:</h3>
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
          </Card>
        </Col>

        {/* Right Section */}

        <Col span={isSmallScreen ? 24 : 11}>
          <Card
            title="Send Flyers to Customer"
            style={{ marginTop: isSmallScreen && "12px" }}
          >
            {loading ? (
              <div
                style={{
                  width: "100%",
                  height: "195.44px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin />
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: "500" }}>Subject</h3>
                <Form.Item>
                  <Input
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Form.Item>

                <h3 style={{ fontWeight: "500" }}>Roles</h3>
                <Form.Item>
                  <Select placeholder="Select a Role">
                    {roles.map((role) => (
                      <Option key={role.id} value={role.id}>
                        {role.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button icon={<EditOutlined />} type="primary">
                  Send Emails
                </Button>
              </>
            )}
          </Card>
        </Col>
      </div>
    </div>
  );
};

export default FlyerGenerate;

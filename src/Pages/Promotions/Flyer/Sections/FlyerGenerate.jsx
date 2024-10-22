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
  Modal,
  Typography,
  Card,
} from "antd";
import axiosInstance from "../../../../Api/axiosConfig";

const { Option } = Select;
const { Title } = Typography;

const FlyerGenerate = () => {
  const [selectedType, setSelectedType] = useState("Select");
  const [priceRole, setPriceRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [flyerData, setFlyerData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  // Handle price role selection change
  const handlePriceRoleChange = (value) => {
    setPriceRole(value);
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchCustomerRoles();
  }, []);

  // Function to preview flyer
  const handlePreviewFlyer = async () => {
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

      console.log(response.data.data);

      setFlyerData(response.data.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching flyer preview:", error);
    } finally {
      setLoading(false);
    }
  };

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
              onClick={handlePreviewFlyer}
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

      {/* Modal to show flyer preview */}
      <Modal
        title="Flyer Preview"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800} // Optional: Adjust width
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {flyerData ? (
            flyerData.map((flyer) => {
              const { Id, ProductName, TierPrice, ImageUrls } = flyer;
              const showFullCard =
                priceRole && roles.some((role) => role.name === priceRole);

              return (
                <Card
                  key={Id}
                  style={{
                    marginBottom: "20px",
                    width: "30%",
                    textAlign: "center",
                  }}
                >
                  {ImageUrls && ImageUrls.length > 0 && (
                    <img
                      src={ImageUrls[0]}
                      alt={ProductName}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <div>
                    ID: <strong>{Id}</strong>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <strong>Name:</strong> {ProductName}
                  </div>
                  {showFullCard ? (
                    <div>
                      <strong>Tier Price:</strong> {"$" + TierPrice || "N/A"}
                    </div>
                  ) : null}
                </Card>
              );
            })
          ) : (
            <p>No flyer data available.</p>
          )}
        </div>
        {/* Disclaimer at the bottom of the modal */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          <strong>DISCLAIMER:</strong> For price match or any other issue(s) please call at
          416-841-9595 or 647-482-2582
        </div>
      </Modal>
    </div>
  );
};

export default FlyerGenerate;

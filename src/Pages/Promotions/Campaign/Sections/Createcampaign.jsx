import React, { useEffect, useState } from 'react';
import CustomLayout from "../../../../Components/Layout/Layout";
import axiosInstance from "../../../../Api/axiosConfig";
import { Form, Input, Button, DatePicker, Select, message, Typography } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import useRetryRequest from "../../../../Api/useRetryRequest"; // Import the hook

const { Option } = Select;
const { Title } = Typography;

const CreateCampaign = () => {
  const [form] = Form.useForm();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  
  const navigate = useNavigate();
  const retryRequest = useRetryRequest(); // Use the retry request hook

  // Fetch customer roles from the API
  const fetchCustomerRoles = async () => {
    try {
      const response = await retryRequest(() => axiosInstance.get("/admin/roles"));
      const data = response.data.map((role) => ({
        id: role.Id,
        name: role.Name,
      }));
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        Body: body, // Include Quill editor content
      };

      const response = await  axiosInstance.post(`/admin/campaigns/create-campaign`, payload);

      if (response.data.success) {
        message.success("Campaign created successfully!");
        navigate('/campaign'); // Redirect to the campaign list after success
      } else {
        message.error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      message.error("Error creating campaign. Please try again.");
    }
  };

  // Handle body content change
  const handleBodyChange = (content) => {
    setBody(content);
  };

  useEffect(() => {
    fetchCustomerRoles(); // Fetch customer roles when component mounts
  }, []); // Only run once when component mounts

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  return (
    <CustomLayout pageTitle="Create Campaign" menuKey="15">
      <Button type="link" onClick={() => navigate('/campaign')} style={{ marginBottom: '16px' }}>
        Back to Campaigns
      </Button>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: 'center', margin: '20px 0' }}>Create New Campaign</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Campaign Name */}
          <Form.Item
            label="Campaign Name"
            name="Name"
            rules={[{ required: true, message: "Please enter the campaign name" }]}
          >
            <Input placeholder="Enter campaign name" />
          </Form.Item>

          {/* Subject */}
          <Form.Item
            label="Subject"
            name="Subject"
            rules={[{ required: true, message: "Please enter the subject" }]}
          >
            <Input placeholder="Enter subject" />
          </Form.Item>

          {/* Store ID */}
          <Form.Item
            label="Store ID"
            name="StoreId"
            rules={[{ required: true, message: "Please select a store" }]}
          >
            <Select placeholder="Select a store">
              <Option value="0">All</Option>
              <Option value="1">Sky Glass</Option>
              <Option value="3">Sky Blue Wholesale</Option>
            </Select>
          </Form.Item>

          {/* Customer Role ID */}
          <Form.Item
            label="Customer Role"
            name="CustomerRoleId"
            rules={[{ required: true, message: "Please select a customer role" }]}
          >
            <Select placeholder="Select customer role">
              <Option value="0">All</Option>
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Don't Send Before Date */}
          <Form.Item
            label="Don't Send Before Date"
            name="DontSendBeforeDateUtc"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          {/* Picture ID */}
          <Form.Item label="Picture ID" name="PictureId">
            <Input placeholder="Enter picture ID" />
          </Form.Item>

          {/* Campaign Body (Quill Editor) */}
          <Form.Item label="Body">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={handleBodyChange}
              placeholder="Enter campaign body content"
              modules={modules}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Create Campaign
            </Button>
          </Form.Item>
        </Form>
      </div>
    </CustomLayout>
  );
};

export default CreateCampaign;

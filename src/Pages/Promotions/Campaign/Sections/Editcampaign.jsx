import React, { useEffect, useState } from 'react';
import CustomLayout from '../../../../Components/Layout/Layout';
import axiosInstance from "../../../../Api/axiosConfig";
import { Form, Input, Button, DatePicker, Select, message, Typography } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import useRetryRequest from "../../../../Api/useRetryRequest"; // Import the hook

const { Option } = Select;
const { Title } = Typography; // Import Title component

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

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

  // Fetch campaign data when component mounts
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await retryRequest(() => axiosInstance.get(`/admin/campaigns/${id}`));
        const { Name, Subject, StoreId, CustomerRoleId, DontSendBeforeDateUtc, PictureId, Body } = response.data;

        form.setFieldsValue({
          Name,
          Subject,
          StoreId,
          CustomerRoleId,
          DontSendBeforeDateUtc: dayjs(DontSendBeforeDateUtc), // Convert to dayjs for DatePicker
          PictureId,
        });
        setBody(Body); // Set the body content for Quill
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        message.error("Failed to fetch campaign data");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
    fetchCustomerRoles(); // Fetch customer roles when component mounts
  }, [id, form, retryRequest]);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        Body: body, // Include Quill editor content
      };

      const response = await retryRequest(() => axiosInstance.put(`/admin/campaigns/${id}`, payload));

      if (response.data.success) {
      
        message.success("Campaign updated successfully!");
        navigate('/campaign'); // Optionally redirect after updating
      } else {
        message.error("Failed to update campaign");
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      message.error("Error updating campaign. Please try again.");
    }
  };

  // Handle body content change
  const handleBodyChange = (content) => {
    setBody(content);
  };

  const modules = {
    toolbar:[
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"]
    ]
  };

  return (
    <CustomLayout pageTitle={`Edit Campaign ${id}`} menuKey="15">
      <Button type="link" onClick={() => navigate('/campaign')} style={{ marginBottom: '16px' }}>
        Back to Campaigns
      </Button>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Add a Title for Editing Campaign */}
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Edit Campaign #{id}
        </Title>

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
              <Option value="2">Sky Blue Wholesale</Option>
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
            <DatePicker showTime />
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
              modules={modules}
              placeholder="Enter campaign body content"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Campaign
            </Button>
          </Form.Item>
        </Form>
      </div>
    </CustomLayout>
  );
};

export default EditCampaign;

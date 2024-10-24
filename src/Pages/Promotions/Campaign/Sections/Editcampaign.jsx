import React, { useEffect, useRef, useState } from 'react';
import CustomLayout from '../../../../Components/Layout/Layout';
import axiosInstance from "../../../../Api/axiosConfig";
import { Form, Input, Button, DatePicker, Select, message, Typography } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import useRetryRequest from "../../../../Api/useRetryRequest"; // Import the hook

const { Option } = Select;
const { Title } = Typography;

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [pictureId, setPictureId] = useState(null); // State for Picture ID
  const [uploading, setUploading] = useState(false); // State for image uploading status
  const quillRef = useRef(); // Reference to the Quill editor
  const retryRequest = useRetryRequest(); // Use the retry request hook

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
      setPictureId(PictureId); // Set Picture ID for the existing image
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      message.error("Failed to fetch campaign data");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        Body: body, // Include Quill editor content
        PictureId: pictureId, // Include Picture ID
      };

      const response = await retryRequest(() => axiosInstance.put(`/admin/campaigns/${id}`, payload));

      if (response.data.success) {
        message.success("Campaign updated successfully!");
        navigate('/campaign');
      } else {
        message.error("Failed to update campaign");
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      message.error("Error updating campaign. Please try again.");
    }
  };

  const handleBodyChange = (content) => {
    setBody(content);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file); // Append the file to FormData
      setUploading(true); // Set uploading state to true

      try {
        // Upload the image to the server
        const response = await axiosInstance.post('/admin/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          const uploadedPictureId = response.data.pictureId;
          setPictureId(uploadedPictureId); // Store the picture ID
          message.success("Image uploaded successfully!");

          // Add a 5-second delay before retrieving the image URL
          setTimeout(async () => {
            try {
              const pictureResponse = await axiosInstance.get(`/admin/picture/${uploadedPictureId}`);
              const imgUrl = pictureResponse.data.url;
              const quill = quillRef.current.getEditor(); // Get the Quill editor instance
              const range = quill.getSelection(); // Get the current selection
              const index = range ? range.index : quill.getLength(); // Determine where to insert the image
              quill.insertEmbed(index, 'image', imgUrl); // Insert the image at the cursor position
              quill.setSelection(index + 1); // Move the cursor after the image

              setUploading(false); // Set uploading state to false
            } catch (error) {
              console.error("Error retrieving image URL after delay:", error);
              message.error("Failed to retrieve image. Please try again.");
              setUploading(false); // Set uploading state to false in case of error
            }
          }, 5000); // 5-second delay
        } else {
          message.error("Failed to upload image.");
          setUploading(false); // Set uploading state to false in case of failure
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Error uploading image. Please try again.");
        setUploading(false); // Set uploading state to false in case of error
      }
    }
  };

  useEffect(() => {
    fetchCampaignData(); // Fetch campaign data on mount
    fetchCustomerRoles(); // Fetch customer roles on mount
  }, [id]);

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
    <CustomLayout pageTitle={`Edit Campaign ${id}`} menuKey="15">
      <Button type="link" onClick={() => navigate('/campaign')} style={{ marginBottom: '16px' }}>
        Back to Campaigns
      </Button>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: 'center', margin: '20px 0' }}>Edit Campaign</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Campaign Name" name="Name" rules={[{ required: true, message: "Please enter the campaign name" }]}>
            <Input placeholder="Enter campaign name" />
          </Form.Item>

          <Form.Item label="Subject" name="Subject" rules={[{ required: true, message: "Please enter the subject" }]}>
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item label="Store ID" name="StoreId" rules={[{ required: true, message: "Please select a store" }]}>
            <Select placeholder="Select a store">
              <Option value="0">All</Option>
              <Option value="1">Sky Glass</Option>
              <Option value="3">Sky Blue Wholesale</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Customer Role" name="CustomerRoleId" rules={[{ required: true, message: "Please select a customer role" }]}>
            <Select placeholder="Select customer role">
              <Option value="0">All</Option>
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Don't Send Before Date" name="DontSendBeforeDateUtc">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          {/* File Upload Button */}
          <Form.Item label="Upload Image">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Item>

          {/* Display Picture ID */}
          {pictureId && (
            <Form.Item label="Picture ID">
              <Button disabled>{`Picture ID: ${pictureId}`}</Button>
            </Form.Item>
          )}

          <Form.Item label="Body">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={body}
              onChange={handleBodyChange}
              placeholder="Enter campaign body content"
              modules={modules}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Update Campaign
            </Button>
          </Form.Item>
        </Form>
      </div>
    </CustomLayout>
  );
};

export default EditCampaign;

import React, { useState } from "react";
import CustomLayout from "../../Components/Layout/Layout";
import { Form, Input, Button, Upload, message, Typography } from "antd";
import useResponsiveButtonSize from "../../Components/ResponsiveSizes/ResponsiveSize";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./Email.css"
import API_BASE_URL from "../../constants";

const Email = () => {
  const [form] = Form.useForm();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const { Title } = Typography;
  const buttonSize = useResponsiveButtonSize();

  const handleFormSubmit = (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("subject", values.subject);
    formData.append("body", body);

    if (values.upload && values.upload.file) {
      formData.append("file", values.upload.file.originFileObj);
    }

    axios
      .post(`${API_BASE_URL}/email/save`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        message.success("Email saved successfully!");
        form.resetFields();
        setBody("");
      })
      .catch((error) => {
        message.error("Failed to save email. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBodyChange = (value) => {
    setBody(value);
  };

  return (
    <CustomLayout pageTitle="Email" menuKey="10">
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Email
      </Title>
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Form.Item
          label="Campaign Name"
          name="name"
          rules={[
            { required: true, message: "Please input your campaign name!" },
          ]}
        >
          <Input placeholder="Campaign Name" />
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: "Please input the subject!" }]}
        >
          <Input placeholder="Enter the subject" />
        </Form.Item>

        <Form.Item
          label="Upload Image"
          name="upload"
          valuePropName="file"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // prevent automatic upload
          >
            <Button icon={<UploadOutlined />} size={buttonSize}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Body" required>
          <ReactQuill
            className="custom-quill-editor"
            value={body}
            onChange={handleBodyChange}
            placeholder="Write your email here..."
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send
          </Button>
        </Form.Item>
      </Form>
    </CustomLayout>
  );
};

export default Email;

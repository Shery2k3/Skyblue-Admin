import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, message, Spin, Row, Col, Card, Typography } from "antd";
import axiosInstance from "../../../Api/axiosConfig";
import API_BASE_URL from "../../../constants";
import useRetryRequest from "../../../Api/useRetryRequest";

const { Title } = Typography;

// Helper function to fetch SEO data
const fetchSeoData = async (vendorId, retryRequest) => {
  try {
    const response = await retryRequest(() =>
      axiosInstance.get(`${API_BASE_URL}/admin/getonevendor/${vendorId}`)
    );
    return response.data.vendor || {};
  } catch (error) {
    throw new Error("Error fetching SEO data.");
  }
};

// Helper function to save SEO changes
const saveSeoChanges = async (vendorId, updatedSEOData) => {
  try {
    const response = await axiosInstance.patch(
      `${API_BASE_URL}/admin/editvendor/${vendorId}`,
      updatedSEOData
    );
    return response.data.success;
  } catch (error) {
    throw new Error("Error updating SEO data.");
  }
};

const VendorSEO = ({ vendorId }) => {
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState({
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescription: "",
  });
  const [saveLoading, setSaveLoading] = useState(false); // Track save button loading
  const retryRequest = useRetryRequest();

  const loadSeoData = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const data = await fetchSeoData(vendorId, retryRequest);
      setSeoData({
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescription: data.MetaDescription || "",
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [vendorId, retryRequest]);

  useEffect(() => {
    loadSeoData(); // Fetch SEO data when vendorId changes
  }, [loadSeoData]);

  const handleSaveChangesSEO = async (values) => {
    const updatedSEOData = {
      metaTitle: values.MetaTitle,
      metaKeywords: values.MetaKeywords,
      metaDescription: values.MetaDescription,
    };

    setSaveLoading(true);
    try {
      const success = await saveSeoChanges(vendorId, updatedSEOData);
      if (success) {
        message.success("SEO updated successfully");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <Row justify="center" style={{ marginTop: "50px" }}>
        <Col>
          <Spin size="large" tip="Loading SEO data..." />
        </Col>
      </Row>
    );
  }

  return (
    <Card bordered={false} style={{ padding: "20px" }}>
      <Title level={3}>Vendor SEO Settings</Title>
      <Form
        layout="vertical"
        onFinish={handleSaveChangesSEO}
        initialValues={seoData}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Meta Title"
              name="MetaTitle"
              required
              hasFeedback
            >
              <Input placeholder="Enter Meta Title" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Meta Keywords"
              name="MetaKeywords"
              required
              hasFeedback
            >
              <Input placeholder="Enter Meta Keywords" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Meta Description"
              name="MetaDescription"
              required
              hasFeedback
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter Meta Description"
                maxLength={160}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              loading={saveLoading}
              disabled={saveLoading}
            >
              Save SEO Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default VendorSEO;

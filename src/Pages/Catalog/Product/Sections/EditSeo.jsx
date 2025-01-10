//@desc: anyone can spam updateSEObutton n api keep hitting


import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import useRetryRequest from "../../../../Api/useRetryRequest";

const EditSeo = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const retryRequest = useRetryRequest();

  // Fetch Product SEO Details
  const fetchProductSeoDetail = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-seo-detail/${id}`)
      );

      // Check if the response contains at least one item
      const seoData = response.data.result[0]; // Access the first item of the array
      if (seoData) {
        const { MetaKeywords, MetaDescription, MetaTitle } = seoData; // Use correct field names
        form.setFieldsValue({
          MetaKeywords,
          MetaDescription,
          Metatitle: MetaTitle, // Map MetaTitle to Metatitle as expected in the form
        });
      } else {
        message.warning("No SEO data found for this product.");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch product SEO details.");
    } finally {
      setLoading(false);
    }
  };

  // Update Product SEO Details
  const updateProductSEO = async (values) => {
    setUpdating(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product-seo-detail/${id}`,
          values
        )
      );

      message.success("SEO details updated successfully.");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to update SEO details.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProductSeoDetail();
  }, []);

  return (
    <Spin spinning={loading} tip="Loading...">
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2>Edit SEO Metadata</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={updateProductSEO}
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Form.Item name="Metatitle" label="Meta Title">
            <Input placeholder="Enter meta title" />
          </Form.Item>

          <Form.Item name="MetaDescription" label="Meta Description">
            <Input.TextArea placeholder="Enter meta description" rows={4} />
          </Form.Item>

          <Form.Item name="MetaKeywords" label="Meta Keywords">
            <Input placeholder="Enter meta keywords" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updating}>
              Update SEO
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default EditSeo;

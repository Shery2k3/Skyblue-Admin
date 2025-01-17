import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  DatePicker,
  Row,
  Col,
  Card,
  message,
  Spin,
} from "antd";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { useParams } from "react-router-dom";

const GeneralInfo = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const productTypeNames = useMemo(() => ({
    5: "Simple",
  }), []);

  const productTemplateNames = useMemo(() => ({
    1: "Simple Product",
  }), []);

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      setProduct(responses.data.result); // Assuming `responses.data.result` is the product data
    } catch (error) {
      message.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productDetail();
  }, [id]);

  useEffect(() => {
    if (product.products) {
      const productInfo = product.products;
      const updatedProductInfo = {
        ...productInfo,
        ProductType: productTypeNames[productInfo.ProductType] || "Unknown Type",
        ProductTemplate: productTemplateNames[productInfo.ProductTemplate] || "Unknown Template",
        AvailableStartDate: productInfo.AvailableStartDate ? moment(productInfo.AvailableStartDate) : null,
        AvailableEndDate: productInfo.AvailableEndDate ? moment(productInfo.AvailableEndDate) : null,
        MarkAsNewStartDate: productInfo.MarkAsNewStartDate ? moment(productInfo.MarkAsNewStartDate) : null,
        MarkAsNewEndDate: productInfo.MarkAsNewEndDate ? moment(productInfo.MarkAsNewEndDate) : null,
      };
      form.setFieldsValue(updatedProductInfo);
    }
  }, [product, form, productTypeNames, productTemplateNames]);

  const onFinish = async (values) => {
    const updatedValues = {
      ...values,
      ProductType: Object.keys(productTypeNames).find(key => productTypeNames[key] === values.ProductType) || values.ProductType,
      ProductTemplate: Object.keys(productTemplateNames).find(key => productTemplateNames[key] === values.ProductTemplate) || values.ProductTemplate,
    };

    try {
      await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product/generalinfo/${id}`,
          updatedValues
        )
      );
      message.success("Product updated successfully!");
    } catch (error) {
      message.error("Failed to save product mapping");
    }
  };

  return (
    <Card title="Edit General Info" style={{ margin: "20px" }}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID" name="Id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Product Type" name="ProductType">
                <Input placeholder="Enter product type" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Product Template" name="ProductTemplate">
                <Input placeholder="Enter product template" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Visible Individually"
                name="VisibleIndividually"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Aisle Location" name="AisleLocation">
                <Input placeholder="Enter aisle location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Box Quantity" name="BoxQty">
                <Input type="number" placeholder="Enter box quantity" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Product Name" name="ProductName">
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Short Description" name="ShortDescription">
                <Input placeholder="Enter short description" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Full Description" name="FullDescription">
            <ReactQuill
              theme="snow"
              onChange={(content) =>
                form.setFieldsValue({ FullDescription: content })
              }
              value={form.getFieldValue("FullDescription")}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="SKU" name="Sku">
                <Input placeholder="Enter SKU" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Barcode" name="Barcode">
                <Input placeholder="Enter barcode" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Box Barcode" name="BoxBarcode">
                <Input placeholder="Enter box barcode" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Display Order" name="DisplayOrder">
                <Input type="number" placeholder="Enter display order" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Allow Customer Reviews"
                name="AllowCustomerReviews"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Show on Homepage"
                name="ShowOnHomePage"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Published"
                name="Published"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mark as New"
                name="MarkAsNew"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Available Start Date" name="AvailableStartDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Available End Date" name="AvailableEndDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mark as New Start Date" name="MarkAsNewStartDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mark as New End Date" name="MarkAsNewEndDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Admin Comment" name="AdminComment">
            <Input.TextArea rows={2} placeholder="Enter admin comment" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Created On" name="CreatedOn">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Updated On" name="UpdatedOn">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default GeneralInfo;
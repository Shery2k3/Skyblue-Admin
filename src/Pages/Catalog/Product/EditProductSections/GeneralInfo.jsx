import React, { useEffect } from "react";
import { Form, Input, Button, Switch, DatePicker, Row, Col, Card } from "antd";
import moment from "moment";

const GeneralInfo = ({ productInfo }) => {
  const [form] = Form.useForm();

  // Extract products and prices for easier mapping
  const { products, prices } = productInfo || {};

  // Flatten and set the initial form values
  useEffect(() => {
    if (products) {
      form.setFieldsValue({
        ...products,
        ...prices, // Include prices if needed
        AvailableStartDate: products.AvailableStartDate
          ? moment(products.AvailableStartDate)
          : null,
        AvailableEndDate: products.AvailableEndDate
          ? moment(products.AvailableEndDate)
          : null,
        MarkAsNewStartDate: products.MarkAsNewStartDate
          ? moment(products.MarkAsNewStartDate)
          : null,
        MarkAsNewEndDate: products.MarkAsNewEndDate
          ? moment(products.MarkAsNewEndDate)
          : null,
      });
    }
  }, [products, prices, form]);

  const onFinish = (values) => {
    console.log("Form Submitted:", values);
    // Handle submission
  };

  return (
    <Card title="Edit General Info" style={{ margin: "20px" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="ProductName"
              rules={[{ required: true, message: "Please enter the product name" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SKU" name="Sku">
              <Input placeholder="Enter SKU" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Price" name="Price">
              <Input type="number" placeholder="Enter price" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Old Price" name="OldPrice">
              <Input type="number" placeholder="Enter old price" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Barcode" name="Barcode">
              <Input placeholder="Enter barcode" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Aisle Location" name="AisleLocation">
              <Input placeholder="Enter aisle location" />
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
              label="Published"
              name="Published"
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GeneralInfo;

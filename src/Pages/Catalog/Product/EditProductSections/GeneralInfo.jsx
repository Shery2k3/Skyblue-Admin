import React, { useEffect } from "react";
import { Form, Input, Button, Switch, DatePicker, Row, Col, Card } from "antd";
import moment from "moment";

const GeneralInfo = ({ productInfo }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (productInfo) {
      form.setFieldsValue({
        ...productInfo,
        AvailableStartDate: productInfo.AvailableStartDate
          ? moment(productInfo.AvailableStartDate)
          : null,
        AvailableEndDate: productInfo.AvailableEndDate
          ? moment(productInfo.AvailableEndDate)
          : null,
        MarkAsNewStartDate: productInfo.MarkAsNewStartDate
          ? moment(productInfo.MarkAsNewStartDate)
          : null,
        MarkAsNewEndDate: productInfo.MarkAsNewEndDate
          ? moment(productInfo.MarkAsNewEndDate)
          : null,
      });
    }
  }, [productInfo, form]);

  const onFinish = (values) => {
    console.log("Form Submitted:", values);
    // Handle form submission
  };

  return (
    <Card title="Edit General Info" style={{ margin: "20px" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="ID" name="Id">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Product Type" name="ProductType">
              <Input placeholder="Enter product type" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Product Template" name="ProductTemplate">
              <Input placeholder="Enter product template" />
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
          <Input.TextArea rows={4} placeholder="Enter full description" />
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
            <Form.Item label="Allow Customer Reviews" name="AllowCustomerReviews" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Show on Homepage" name="ShowOnHomePage" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Published" name="Published" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mark as New" name="MarkAsNew" valuePropName="checked">
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
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GeneralInfo;

import {
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useState } from "react";
import { Form } from "react-router-dom";

const DiscountInfo = () => {

  const [usePercentage, setUsePercentage] = useState(false);
  const [requireCouponCode, setRequireCouponCode] = useState(false);
  const [discountLimitation, setDiscountLimitation] = useState("Unlimited");
  
  const { Title } = Typography;

  return (
    <>
      <section>
        <Title level={4}>Discount Info</Title>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="Enter discount name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="discountType"
              label="Discount Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select discount type">
                <Option value={1}>Assigned to order total</Option>
                <Option value={2}>Assigned to products</Option>
                <Option value={5}>Assigned to categories</Option>
                <Option value={3}>Assigned to manufacturers</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="applyToSubCategories" valuePropName="checked">
              <Checkbox>Apply to Subcategories</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="usePercentage" valuePropName="checked">
              <Checkbox onChange={(e) => setUsePercentage(e.target.checked)}>
                Use Percentage
              </Checkbox>
            </Form.Item>
          </Col>
          {usePercentage && (
            <Col xs={24} sm={12}>
              <Form.Item name="percentageValue" label="Percentage Value">
                <Input type="number" placeholder="Enter percentage value" />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={12}>
            <Form.Item name="discountAmount" label="Discount Amount (CAD)">
              <Input type="number" placeholder="Enter discount amount" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="requireCouponCode" valuePropName="checked">
              <Checkbox
                onChange={(e) => setRequireCouponCode(e.target.checked)}
              >
                Require Coupon Code
              </Checkbox>
            </Form.Item>
          </Col>
          {requireCouponCode && (
            <Col xs={24} sm={12}>
              <Form.Item name="couponCode" label="Coupon Code">
                <Input placeholder="Enter coupon code" />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Title level={4}>Applied to Category</Title>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              name="categories"
              label="Select Categories"
              rules={[{ required: true }]}
            >
              <Select mode="multiple" placeholder="Select categories">
                <Option value="category1">Category 1</Option>
                <Option value="category2">Category 2</Option>
                <Option value="category3">Category 3</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Title level={4}>Usage</Title>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="endDate" label="End Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="discountLimitation" label="Limitation">
              <Select
                placeholder="Select limitation"
                onChange={(value) => setDiscountLimitation(value)}
              >
                <Option value="Unlimited">Unlimited</Option>
                <Option value="N Times Per Customer">
                  N Times Per Customer
                </Option>
              </Select>
            </Form.Item>
          </Col>
          {discountLimitation === "N Times Per Customer" && (
            <Col xs={24} sm={12}>
              <Form.Item name="limitationValue" label="Limitation Value">
                <Input type="number" placeholder="Enter limitation value" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </section>
    </>
  );
};

export default DiscountInfo;

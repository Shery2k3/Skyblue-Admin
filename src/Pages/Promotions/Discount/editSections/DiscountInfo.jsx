import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Select,
  DatePicker,
  Divider,
  message,
  Typography,
} from "antd";
import axiosInstance from "../../../../Api/axiosConfig";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import useRetryRequest from "../../../../Api/useRetryRequest";

const { Title } = Typography;
const { Option } = Select;

const DiscountInfo = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const [datasource, setDatasource] = useState([]);
  const [usePercentage, setUsePercentage] = useState(false);
  const [requireCouponCode, setRequireCouponCode] = useState(false);
  const [discountType, setDiscountType] = useState(null);
  const [discountLimitation, setDiscountLimitation] = useState("Unlimited");

  const retryRequest = useRetryRequest();

  useEffect(() => {
    getDiscount();
  }, [id]);

  const getDiscount = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/edit-discount/${id}`)
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        const discount = response.data[0];
        setDatasource(discount);

        // Set form values using the correct field names
        form.setFieldsValue({
          name: discount.Name,
          discountType: discount.DiscountTypeId,
          applyToSubCategories: discount.AppliedToSubCategories,
          usePercentage: discount.UsePercentage,
          percentageValue: discount.DiscountPercentage,
          discountAmount: discount.DiscountAmount,
          requireCouponCode: discount.RequiresCouponCode,
          couponCode: discount.CouponCode,
          startDate: discount.StartDateUtc
            ? dayjs(discount.StartDateUtc)
            : null,
          endDate: discount.EndDateUtc ? dayjs(discount.EndDateUtc) : null,
          discountLimitation:
            discount.DiscountLimitationId === 0
              ? "Unlimited"
              : "N Times Per Customer",
          limitationValue: discount.LimitationTimes,
        });

        // Update states
        setUsePercentage(discount.UsePercentage);
        setRequireCouponCode(discount.RequiresCouponCode);
        setDiscountType(discount.DiscountTypeId);
        setDiscountLimitation(
          discount.DiscountLimitationId === 0
            ? "Unlimited"
            : "N Times Per Customer"
        );
      } else {
        console.error("Unexpected discount data format:", response.data);
        message.error("Invalid discount data format.");
      }
    } catch (error) {
      console.error("Error fetching discount data:", error);
      message.error("Failed to fetch discount data.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      // Construct the payload dynamically to include only provided fields
      const payload = {};
  
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          payload[key] = values[key];
        }
      }
  
      // Make API request with the dynamically constructed payload
      const response = await axiosInstance.patch(
        `/admin/edit-discount/${id}`, // Replace `id` with the actual discount ID from your context
        payload
      );
  
      if (response.data.success) {
        message.success("Discount updated successfully!");
      } else {
        message.error(
          response.data.message || "Failed to update discount. Try again later."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        error.response?.data?.message || "Failed to update discount."
      );
    }
  };
  
  

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      {/* Section 1: Discount Info */}
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
              rules={[{ required: true, message: "Discount type is required" }]}
            >
              <Select
                placeholder="Select discount type"
                onChange={(value) => setDiscountType(value)}
              >
                <Option value={1}>Assigned to order total</Option>
                <Option value={2}>Assigned to products</Option>
                <Option value={5}>Assigned to categories</Option>
                <Option value={3}>Assigned to manufacturers</Option>
              </Select>
            </Form.Item>
          </Col>
          {discountType === 5 && (
            <Col span={24}>
              <Form.Item
                name="applyToSubCategories"
                valuePropName="checked"
              >
                <Checkbox>Apply to Subcategories</Checkbox>
              </Form.Item>
            </Col>
          )}
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
      </section>

      {/* Section 2: Date Management */}
      <section>
        <Title level={4}>Dates</Title>
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
        </Row>
      </section>

      {/* Section 3: Discount Limitation */}
      <section>
        <Title level={4}>Discount Limitation</Title>
        <Divider />
        <Row gutter={[16, 16]}>
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

      {/* Action Buttons */}
      <Divider />
      <Form.Item style={{ textAlign: "center" }}>
        <button type="submit">Save</button>
      </Form.Item>
    </Form>
  );
};

export default DiscountInfo;

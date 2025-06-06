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
  Button,
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

  const [usePercentage, setUsePercentage] = useState(false);
  const [requireCouponCode, setRequireCouponCode] = useState(false);
  const [discountType, setDiscountType] = useState(null);
  const [discountLimitation, setDiscountLimitation] = useState("Unlimited");
  const [loading, setLoading] = useState(false);

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

        const startDate = discount.StartDateUtc
          ? dayjs(discount.StartDateUtc)
          : null;
        const endDate = discount.EndDateUtc ? dayjs(discount.EndDateUtc) : null;

        form.setFieldsValue({
          name: discount.Name,
          discountType: discount.DiscountTypeId,
          applyToSubCategories: discount.AppliedToSubCategories,
          usePercentage: discount.UsePercentage,
          percentageValue: discount.DiscountPercentage,
          discountAmount: discount.DiscountAmount,
          requireCouponCode: discount.RequiresCouponCode,
          couponCode: discount.CouponCode,
          startDate: startDate?.isValid() ? startDate : null,
          endDate: endDate?.isValid() ? endDate : null,
          discountLimitation:
            discount.DiscountLimitationId === 0
              ? "Unlimited"
              : "N Times Per Customer",
          limitationValue: discount.LimitationTimes,
        });

        setUsePercentage(discount.UsePercentage);
        setRequireCouponCode(discount.RequiresCouponCode);
        setDiscountType(discount.DiscountTypeId);
        setDiscountLimitation(
          discount.DiscountLimitationId === 0
            ? "Unlimited"
            : "N Times Per Customer"
        );
      } else {
        message.error("Invalid discount data format.");
      }
    } catch (error) {
      message.error("Failed to fetch discount data.");
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {};
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          payload[key] = values[key];
        }
      }

      const response = await axiosInstance.patch(
        `/admin/edit-discount/${id}`,
        payload
      );

      if (response.status === 200) {
        message.success("Discount updated successfully!");
        window.location.reload();
      } else {
        message.error(response.data.message || "Failed to update discount.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update discount."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}
    >
      {/* Section 1: Discount Info */}
      <section>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Title level={4} style={{ margin: 0 }}>
            Discount Info
          </Title>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Row>
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
              <Form.Item name="applyToSubCategories" valuePropName="checked">
                <Checkbox>Apply to Subcategories</Checkbox>
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item name="usePercentage" valuePropName="checked">
              <Checkbox
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUsePercentage(checked);
                  if (checked) {
                    form.setFieldsValue({ discountAmount: 0 });
                  }
                }}
              >
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
      <section style={{ marginTop: 40 }}>
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
      <section style={{ marginTop: 40 }}>
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
    </Form>
  );
};

export default DiscountInfo;

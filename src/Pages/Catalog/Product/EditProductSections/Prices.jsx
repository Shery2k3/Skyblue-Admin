//@desc: disale price1-2-3-4-5 and discount insted add tooltip there, on each prices it should display "You can manage price from TierPicesection" and on discount it should display "You can manage discount from Discount section, Promotions>Discounts"

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../../Api/useRetryRequest";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import { message, Form, Input, Button, Row, Col, Table } from "antd";

const Prices = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [product, setProduct] = useState({});
  const [discounts, setDiscounts] = useState([]); // Store fetched discounts (IDs and names)
  const [taxCategoryID, setTaxCategoryID] = useState(null); // Store TaxCategory ID

  const [form] = Form.useForm();

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      const productData = responses.data.result;
      setProduct(productData);

      // Store discounts and TaxCategory ID
      const fetchedDiscounts = productData.prices.discounts || [];
      setDiscounts(fetchedDiscounts);

      const taxCategory = productData.prices.TaxCategory || {};
      setTaxCategoryID(taxCategory.Id); // Store TaxCategory ID

      // Map tier prices to form fields dynamically
      const tierPrices = productData.prices.tierPrices || [];
      const priceFields = ["Price1", "Price2", "Price3", "Price4", "Price5"];
      const updatedFormValues = {
        ...productData.prices,
        ...priceFields.reduce((acc, field, index) => {
          acc[field] = tierPrices[index]?.Price || ""; // Map tier prices to form fields
          return acc;
        }, {}),
        TaxCategoryName: taxCategory.TaxCategoryName || "", // Display TaxCategoryName
        discounts: fetchedDiscounts.map((d) => d.DiscountName).join(", "), // Display discount names
      };

      form.setFieldsValue(updatedFormValues); // Prepopulate form
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const handleFormSubmit = async (values) => {
    // Transform discount names back to their IDs for submission
    const discountIDs = discounts.map((d) => d.Discount_Id);

    const submissionData = {
      ...values,
      discounts: discountIDs, // Replace discount names with IDs
      TaxCategoryId: taxCategoryID, // Include TaxCategory ID
    };

    console.log("Form submission data: ", submissionData);
    try {
      await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product/priceDetails/${id}`,
          submissionData
        )
      );
      message.success("Product prices updated successfully");
    } catch (error) {
      message.error("Failed to update product prices");
    }
  };

  useEffect(() => {
    productDetail();
  }, [id]);

  return (
    <div style={{ margin: "20px" }}>
      <h3>Edit Product Prices</h3>
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        initialValues={product.prices}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Price" name="Price">
              <Input type="number" min={0} step="0.01" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Old Price" name="OldPrice">
              <Input type="number" min={0} step="0.01" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Product Cost" name="ProductCost">
              <Input type="number" min={0} step="0.01" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {["Price1", "Price2", "Price3", "Price4", "Price5"].map(
            (priceField, index) => (
              <Col span={8} key={index}>
                <Form.Item label={`Price ${index + 1}`} name={priceField}>
                  <Input type="number" min={0} step="0.01" />
                </Form.Item>
              </Col>
            )
          )}
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Discount" name="discounts">
              <Input value={form.getFieldValue("discounts") || ""} readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Tax Category" name="TaxCategoryName">
              <Input
                value={form.getFieldValue("TaxCategoryName") || ""}
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Prices;

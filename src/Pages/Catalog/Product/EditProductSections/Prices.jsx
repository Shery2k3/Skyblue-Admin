import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../../Api/useRetryRequest";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import { message, Form, Input, Button, Row, Col, Select } from "antd";

const Prices = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [product, setProduct] = useState({});
  const [discounts, setDiscounts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [taxCategoryID, setTaxCategoryID] = useState(null);

  const [form] = Form.useForm();

  const fetchProductDetails = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      const productData = response.data.result;
      setProduct(productData);

      const priceFields = ["P1", "P2", "P3", "P4", "P5"];
      const tierPrices = productData.prices.tierPrices || [];
      const tierPriceMap = tierPrices.reduce((acc, item) => {
        acc[item.CustomerRoleName] = item.Price;
        return acc;
      }, {});

      const updatedFormValues = {
        ...productData.prices,
        ...priceFields.reduce((acc, role, index) => {
          acc[`Price${index + 1}`] = tierPriceMap[role] ?? 0;
          return acc;
        }, {}),
        TaxCategoryName: productData.prices.TaxCategory?.TaxCategoryName || "",
        discounts: (productData.prices.discounts || [])
          .map((d) => d.DiscountName)
          .join(", "),
      };

      setDiscounts(productData.prices.discounts || []);
      setTaxCategoryID(productData.prices.TaxCategory?.Id || null);
      form.setFieldsValue(updatedFormValues);
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const fetchAvailableDiscounts = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/alldiscounts`)
      );
      const filteredDiscounts = response.data.filter(
        (discount) => discount.DiscountTypeId === 2
      );
      setAvailableDiscounts(filteredDiscounts);
    } catch (error) {
      message.error("Failed to fetch discounts");
    }
  };

  const handleFormSubmit = async (values) => {
    const numericValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" || value === undefined ? 0 : Number(value),
      ])
    );

    const discountIDs = discounts.map((d) => d.Discount_Id);

    const submissionData = {
      ...numericValues,
      discounts: discountIDs,
      TaxCategoryId: taxCategoryID,
    };

    try {
      await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product/priceDetails/${id}`,
          submissionData
        )
      );
      message.success("Product prices updated successfully");
      window.location.reload();
    } catch (error) {
      message.error("Failed to update product prices");
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchAvailableDiscounts();
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
          {["P1", "P2", "P3", "P4", "P5"].map((role, index) => {
            const priceField = `Price${index + 1}`;
            return form.getFieldValue(priceField) !== "" ? (
              <Col span={8} key={index}>
                <Form.Item label={`Price for ${role}`} name={priceField}>
                  <Input type="number" min={0} step="0.01" />
                </Form.Item>
              </Col>
            ) : null;
          })}
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Discount" name="discounts">
              {availableDiscounts.length > 0 ? (
                <Select
                  mode="multiple"
                  placeholder="Select discounts"
                  value={discounts.map((d) => d.Id)}
                  onChange={(selectedDiscountIds) => {
                    const selectedDiscounts = availableDiscounts.filter((d) =>
                      selectedDiscountIds.includes(d.Id)
                    );
                    setDiscounts(selectedDiscounts);
                  }}
                  options={availableDiscounts.map((discount) => ({
                    label: discount.Name,
                    value: discount.Id,
                  }))}
                />
              ) : (
                <p>No discounts available</p>
              )}
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
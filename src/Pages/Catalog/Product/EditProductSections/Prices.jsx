import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../../Api/useRetryRequest";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import { message, Form, Input, Button, Row, Col, Table, Select } from "antd";

const Prices = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [product, setProduct] = useState({});
  const [discounts, setDiscounts] = useState([]); // Store fetched discounts (IDs and names)
  const [taxCategoryID, setTaxCategoryID] = useState(null); // Store TaxCategory ID
  const [addDiscount, setAddDiscount] = useState([]);

  const [form] = Form.useForm();

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );

      const priceFields = ["P1", "P2", "P3", "P4", "P5"]; // Expected tier price roles

      const productData = responses.data.result;
      setProduct(productData);

      // Store discounts and TaxCategory ID
      const fetchedDiscounts = productData.prices.discounts || [];
      setDiscounts(fetchedDiscounts);

      const taxCategory = productData.prices.TaxCategory || {};
      setTaxCategoryID(taxCategory.Id);

      // Map tier prices dynamically based on CustomerRoleName
      const tierPrices = productData.prices.tierPrices || [];
      // Map tier prices from API
      const tierPriceMap = tierPrices.reduce((acc, item) => {
        acc[item.CustomerRoleName] = item.Price; // Store price by role name (P1, P2, etc.)
        return acc;
      }, {});

      const updatedFormValues = {
        ...productData.prices,
        ...priceFields.reduce((acc, role, index) => {
          acc[`Price${index + 1}`] = tierPriceMap[role] ?? 0; // Use API price or default to 0
          return acc;
        }, {}),
        TaxCategoryName: productData.prices.TaxCategory?.TaxCategoryName || "", // Display TaxCategoryName
        discounts: (productData.prices.discounts || [])
          .map((d) => d.DiscountName)
          .join(", "), // Display discount names
      };

      console.log("Updated form values:", updatedFormValues);
      form.setFieldsValue(updatedFormValues);
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await retryRequest(
        () => axiosInstance.get(`${API_BASE_URL}/admin/alldiscounts`) // Fetch all discounts
      );
      // Filter the discounts to only include those with DiscountTypeId 3
      const filteredDiscounts = response.data.filter(
        (discount) => discount.DiscountTypeId === 2
      );
      setAddDiscount(filteredDiscounts); // Set the filtered discounts
    } catch (error) {
      console.error("Error fetching discounts:", error);
      message.error("Failed to fetch discounts");
    }
  };

  const handleFormSubmit = async (values) => {
    // Ensure all price-related fields are numbers and replace "" with 0
    const numericValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" || value === undefined ? 0 : Number(value), // Convert to number, default to 0
      ])
    );

    // Transform discount names back to their IDs for submission
    const discountIDs = discounts.map((d) => d.Discount_Id);

    const submissionData = {
      ...numericValues,
      discounts: discountIDs, // Replace discount names with IDs
      TaxCategoryId: taxCategoryID, // Include TaxCategory ID
    };

    

    try {
      await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product/priceDetails/${id}`,
          submissionData
        )
      );
      message.success("Product prices updated successfully");
      window.location.reload(); // Reload the page
    } catch (error) {
      message.error("Failed to update product prices");
    }
  };

  useEffect(() => {
    productDetail();
    fetchDiscounts();
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
              {addDiscount.length > 0 ? (
                <Select
                  mode="multiple"
                  placeholder="Select discounts"
                  // Set value as the IDs to match options' values
                  value={discounts.map((d) => d.Id)}
                  onChange={(selectedDiscountIds) => {
                    // Map selected IDs to their corresponding discount objects
                    const selectedDiscounts = addDiscount.filter((d) =>
                      selectedDiscountIds.includes(d.Id)
                    );

                    // Update the `discounts` state with selected discounts
                    setDiscounts(selectedDiscounts);

                    // Log the selected discount IDs and their corresponding names
                    console.log(
                      "Selected discounts:",
                      selectedDiscounts.map((d) => d.Name) // Log names
                    );
                    console.log(
                      "Selected discount IDs:",
                      selectedDiscountIds // Log IDs
                    );
                  }}
                  options={addDiscount.map((discount) => ({
                    label: discount.Name, // Name to display in the dropdown
                    value: discount.Id, // Use the ID programmatically
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

//URL :http://localhost:5173/products/10230
//@desc: Display the discount namd insted of dicsount id on discount tab

//@SHery
//@desc: Add functionality of adding new tierprices along with edit

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
  const [discounts, setDiscounts] = useState([]); // Store the fetched discounts

  const [form] = Form.useForm();

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      const productData = responses.data.result;
      setProduct(productData);

      // Mapping tier prices to form fields dynamically (Price1, Price2, Price3, Price4, Price5)
      const tierPrices = productData.prices.tierPrices || [];
      const priceFields = ['Price1', 'Price2', 'Price3', 'Price4', 'Price5'];
      const updatedFormValues = {
        ...productData.prices,
        ...priceFields.reduce((acc, field, index) => {
          acc[field] = tierPrices[index]?.Price || ''; // Map tier prices to form fields
          return acc;
        }, {}),
        TaxCategoryName: productData.prices.TaxCategory.TaxCategoryName || '', // Set TaxCategoryName
        discounts: productData.prices.discounts?.map(discount => discount.Discount_Id).join(", ") || "", // Join discount IDs
      };

      form.setFieldsValue(updatedFormValues); // Prepopulate form with existing product prices
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/discount/product`)
      );
      setDiscounts(response.data); // Store fetched discount data
    } catch (error) {
      message.error("Failed to fetch discounts");
    }
  };

  const handleFormSubmit = async (values) => {
    console.log("Form values: ", values);
  };

  useEffect(() => {
    productDetail();
    fetchDiscounts();
  }, [id]);

 

  return (
    <div style={{ margin: "20px" }}>
    <h3>Edit Product Prices</h3>
    <Form form={form} onFinish={handleFormSubmit} layout="vertical" initialValues={product.prices}>
      <Row gutter={16}>
        {/* Price, Old Price, Product Cost Fields */}
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

      {/* Tier Prices Fields (Price1, Price2, Price3, Price4, Price5) */}
      <Row gutter={16}>
        {['Price1', 'Price2', 'Price3', 'Price4', 'Price5'].map((priceField, index) => (
          <Col span={8} key={index}>
            <Form.Item label={`Price ${index + 1}`} name={priceField}>
              <Input type="number" min={0} step="0.01" />
            </Form.Item>
          </Col>
        ))}
      </Row>

      {/* Disable Discounts and Tax Category */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Discount" name="discounts">
            <Input value={(form.getFieldValue("discounts") || "")} readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tax Category" name="TaxCategoryName">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form.Item>
    </Form>

    <h4>Tier Prices Table</h4>
    <Table
      columns={[
        {
          title: "Customer Role",
          dataIndex: "CustomerRoleName",
          key: "CustomerRoleName",
        },
        {
          title: "Price",
          dataIndex: "Price",
          key: "Price",
          render: (text) => `$${text}`,
        },
        {
          title: "Quantity",
          dataIndex: "Quantity",
          key: "Quantity",
        },
      ]}
      dataSource={product.prices?.tierPrices || []}
      rowKey="CustomerRoleId"
      pagination={false}
    />
    <h1>Add Price group it imp</h1>
  </div>
  );
};

export default Prices;

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Checkbox, message, Spin, Row, Col } from "antd";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";
import API_BASE_URL from "../../../../constants";

const { Option } = Select;

const lowStockActivityMap = {
  0: "Nothing",
  1: "Disable buy button",
  2: "Unpublish product",
};

const backorderModeMap = {
  0: "No backorders",
  1: "Allow qty below 0",
  2: "Allow qty below 0 and notify customer",
};

const manageInventoryMethodMap = {
  0: "Don't track inventory",
  1: "Track inventory",
  2: "Track inventory by product attributes",
};

const InventoryInfo = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const fetchProductInventory = async () => {
    try {
      setLoading(true);
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail-inventory/${id}`)
      );
      const { result } = response.data;
      console.log("Product Inventory: ", result);
      setInitialData(result);
      form.setFieldsValue({
        inventoryMethod: Object.keys(manageInventoryMethodMap).find(
          (key) => manageInventoryMethodMap[key] === result.inventoryMethod
        ),
        stockQuantity: result.stockQuantity,
        displayStockAvailability: result.displayStockAvailability,
        displayStockQuantity: result.displayStockQuantity,
        minStockQuantity: result.minStockQuantity,
        lowStockActivity: Object.keys(lowStockActivityMap).find(
          (key) => lowStockActivityMap[key] === result.lowStockActivity
        ),
        notifyAdminForQuantityBelow: result.notifyAdminForQuantityBelow,
        backorderMode: Object.keys(backorderModeMap).find(
          (key) => backorderModeMap[key] === result.backorderMode
        ),
        allowBackInStockSubscriptions: result.allowBackInStockSubscriptions,
        minCartQuantity: result.minCartQuantity,
        maxCartQuantity: result.maxCartQuantity,
        allowedQuantities: result.allowedQuantities,
        notReturnable: result.notReturnable,
      });
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch product inventory");
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values: ", values);
    message.success("Changes saved successfully!");
  };

  useEffect(() => {
    fetchProductInventory();
  }, []);

  if (loading || !initialData) {
    return <Spin tip="Loading inventory details..." />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Edit</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Inventory Method" name="inventoryMethod">
              <Select>
                {Object.entries(manageInventoryMethodMap).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Stock Quantity" name="stockQuantity">
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Display Availability"
              name="displayStockAvailability"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Display Stock Quantity"
              name="displayStockQuantity"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Minimum Stock Quantity" name="minStockQuantity">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Low Stock Activity" name="lowStockActivity">
              <Select>
                {Object.entries(lowStockActivityMap).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Notify for Quantity Below" name="notifyAdminForQuantityBelow">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Backorders" name="backorderMode">
              <Select>
                {Object.entries(backorderModeMap).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Allow Back in Stock Subscriptions"
              name="allowBackInStockSubscriptions"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Minimum Cart Quantity" name="minCartQuantity">
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Maximum Cart Quantity" name="maxCartQuantity">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Allowed Quantities" name="allowedQuantities">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Not Returnable"
              name="notReturnable"
              valuePropName="checked"
            >
              <Checkbox />
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

export default InventoryInfo;

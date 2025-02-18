import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  message,
  Spin,
  Row,
  Col,
  Tooltip,
  Card,
} from "antd";
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
  const [submitting, setSubmitting] = useState(false);
  const [availabilityRangeData, setAvailabilityRangeData] = useState([]);

  const fetchProductInventory = async () => {
    try {
      setLoading(true);
      const response = await retryRequest(() =>
        axiosInstance.get(
          `${API_BASE_URL}/admin/product-detail-inventory/${id}`
        )
      );
      const { result } = response.data;

      const availabilityRangeValue = result.productAvailabilityRange
        ? result.productAvailabilityRange
        : "None";

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
        productAvailabilityRange: availabilityRangeValue,
      });

      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch product inventory");
      setLoading(false);
    }
  };

  const fetchProductAvailability = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-avaliability`)
      );
      setAvailabilityRangeData(response.data);
    } catch (error) {
      message.error("Failed to fetch product availability range");
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product/updateInventory/${id}`,
          values
        )
      );
      message.success("Changes saved successfully!");
    } catch {
      message.error("Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProductInventory();
    fetchProductAvailability();
  }, [id]);

  if (loading) {
    return <Spin tip="Loading inventory details..." />;
  }

  const handleAvailabilityChange = (value) => {
    form.setFieldsValue({
      productAvailabilityRange: value === "None" ? 0 : value,
    });
  };

  return (
    <div>
      <h2>Inventory Edit</h2>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<b>Inventory Method</b>}
                name="inventoryMethod"
                tooltip="Select inventory method. There are three methods: Don't Track inventory, Track inventory, Track inventory by product attributes. You should use Track inventory by attributes when the product has different combinations of these attributes and then manage inventory for this combination."
              >
                <Select>
                  {Object.entries(manageInventoryMethodMap).map(
                    ([key, value]) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<b>Stock Quantity</b>}
                name="stockQuantity"
                tooltip="The Current Stock Quantity of this product."
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<b>Display Availability</b>}
                name="displayStockAvailability"
                valuePropName="checked"
                tooltip="Check to display stock availability. When enabled, customer will see stock availability."
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<b>Display Stock Quantity</b>}
                name="displayStockQuantity"
                valuePropName="checked"
                tooltip="Check to display stock quantity. When enabled, customer will see stock quantity."
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<b>Minimum Stock Quantity</b>}
                name="minStockQuantity"
                tooltip="Enter the minimum stock quantity"
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<b>Low Stock Activity</b>}
                name="lowStockActivity"
                tooltip="Select the low stock activity"
              >
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
              <Form.Item
                label={<b>Minimum Cart Quantity</b>}
                name="minCartQuantity"
                tooltip="Enter the minimum cart quantity"
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<b>Maximum Cart Quantity</b>}
                name="maxCartQuantity"
                tooltip="Enter the maximum cart quantity"
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            
            <Col span={12}>
              <Form.Item
                label={<b>Allowed Quantities</b>}
                name="allowedQuantities"
                tooltip="Enter a comma seperated list of quantities you want this product to be restricted to. Insted of qunatity textbox that allow them to enter any quantity, this will show a dropdown with these quantities."
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<b>Not Returnable</b>}
                name="notReturnable"
                valuePropName="checked"
                tooltip="Check if the product is not returnable"
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>

         

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InventoryInfo;

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Switch,
  Tag,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import moment from "moment";
import { Label } from "recharts";

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
};

const ProductEdit = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const productTypeNames = useMemo(() => ({ 5: "Simple" }), []);
  const productTemplateNames = useMemo(() => ({ 1: "Simple Product" }), []);

  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const { inventory, setInventory } = useState();

  const [availabilityRangeData, setAvailabilityRangeData] = useState([]);

  const navigate = useNavigate();

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );

      const productData = responses?.data?.result;
      setProduct(productData);
      setTaxCategoryID(productData?.prices?.TaxCategory?.Id);
    } catch (error) {
      message.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productDetail();
    fetchAvailableDiscounts();
  }, [id]);

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

  useEffect(() => {
    if (product.products && product.prices) {
      const productInfo = product.products;
      const pricesInfo = product.prices;
      //const inventoryInfo = inventory.result;

      console.log("pricesInfo", pricesInfo);

      // Extract tier prices for different customer roles
      const tierPricesMap = {};
      if (pricesInfo.tierPrices && pricesInfo.tierPrices.length > 0) {
        pricesInfo.tierPrices.forEach((tierPrice) => {
          if (tierPrice.CustomerRoleName) {
            tierPricesMap[`price_${tierPrice.CustomerRoleName}`] =
              tierPrice.Price;
          }
        });
      }

      const availabilityRangeValue = productInfo.productAvailabilityRange
        ? productInfo.productAvailabilityRange
        : "None";

      console.log("productInfo", productInfo);

      const updatedProductInfo = {
        ...productInfo,
        ProductType:
          productTypeNames[productInfo.ProductType] || "Unknown Type",
        ProductTemplate:
          productTemplateNames[productInfo.ProductTemplate] ||
          "Unknown Template",
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
        // Price fields from productData.prices
        GeneralPrice: pricesInfo.Price || 0,
        OldPrice: pricesInfo.OldPrice || 0,
        ProductCost: pricesInfo.ProductCost || 0,
        TaxCategory:
          pricesInfo.TaxCategory?.TaxCategoryName || "No Tax Category",
        // Tier prices
        ...tierPricesMap,
        // Discount (if available)
        discounts:
          pricesInfo.discounts && pricesInfo.discounts.length > 0
            ? pricesInfo.discounts.map((d) => ({
                Id: d.Discount_Id,
                Name: d.DiscountName,
              }))
            : [],

        // FIXED: Inventory mapping - directly access names using IDs
        inventoryMethod:
          manageInventoryMethodMap[productInfo.ManageInventoryMethodId] ||
          "Unknown",
        stockQuantity: productInfo.StockQuantity,
        displayStockAvailability: productInfo.DisplayStockAvailability,
        displayStockQuantity: productInfo.DisplayStockQuantity,
        minStockQuantity: productInfo.MinStockQuantity,
        lowStockActivity:
          lowStockActivityMap[productInfo.LowStockActivityId] || "Unknown",
        notifyAdminForQuantityBelow: productInfo.NotifyAdminForQuantityBelow,
        backorderMode:
          backorderModeMap[productInfo.BackorderModeId] || "Unknown",
        allowBackInStockSubscriptions:
          productInfo.AllowBackInStockSubscriptions,
        minCartQuantity: productInfo.OrderMinimumQuantity,
        maxCartQuantity: productInfo.OrderMaximumQuantity,
        allowedQuantities: productInfo.AllowedQuantities,
        notReturnable: productInfo.NotReturnable,
        productAvailabilityRange: availabilityRangeValue,
      };
      setAppliedDiscounts(updatedProductInfo.discounts);
      console.log("updatedProductInfo", updatedProductInfo);

      form.setFieldsValue(updatedProductInfo);
    }
  }, [product, form, productTypeNames, productTemplateNames, inventory]);

  const [appliedDiscounts, setAppliedDiscounts] = useState([]);

  console.log("appliedDiscounts", appliedDiscounts);

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

  const [taxCategoryID, setTaxCategoryID] = useState(null);

  const handleSave = async (values) => {
    console.log("Form values:", values);

    try {
      // 1. Update General Product Info
      const generalInfoData = {
        ProductType:
          Object.keys(productTypeNames).find(
            (key) => productTypeNames[key] === values.ProductType
          ) || values.ProductType,
        ProductTemplate:
          Object.keys(productTemplateNames).find(
            (key) => productTemplateNames[key] === values.ProductTemplate
          ) || values.ProductTemplate,
        VisibleIndividually: values.VisibleIndividually,
        AisleLocation: values.AisleLocation,
        BoxQty: values.BoxQty,
        ProductName: values.ProductName,
        ShortDescription: values.ShortDescription,
        FullDescription: values.FullDescription,
        Sku: values.Sku,
        Barcode: values.Barcode,
        BoxBarcode: values.BoxBarcode,
        Published: values.Published,
        ShowOnHomePage: values.ShowOnHomePage,
        DisplayOrder: values.DisplayOrder,
        AllowCustomerReviews: values.AllowCustomerReviews,
        AvailableStartDate: values.AvailableStartDate,
        AvailableEndDate: values.AvailableEndDate,
        MarkAsNew: values.MarkAsNew,
        MarkAsNewStartDate: values.MarkAsNewStartDate,
        MarkAsNewEndDate: values.MarkAsNewEndDate,
        AdminComment: values.AdminComment,
      };

      // 2. Update Price Details
      const priceData = {
        Price: Number(values.GeneralPrice) || 0,
        OldPrice: Number(values.OldPrice) || 0,
        ProductCost: Number(values.ProductCost) || 0,
        TaxCategoryId: taxCategoryID, // You'll need to get this from your existing logic
        Price1:
          values.price_P1 === "" || values.price_P1 === undefined
            ? 0
            : Number(values.price_P1),
        Price2:
          values.price_P2 === "" || values.price_P2 === undefined
            ? 0
            : Number(values.price_P2),
        Price3:
          values.price_P3 === "" || values.price_P3 === undefined
            ? 0
            : Number(values.price_P3),
        Price4:
          values.price_P4 === "" || values.price_P4 === undefined
            ? 0
            : Number(values.price_P4),
        Price5:
          values.price_P5 === "" || values.price_P5 === undefined
            ? 0
            : Number(values.price_P5),
        discounts: values.discounts || [], // Assuming discounts come from form values
      };

      console.log("priceData:", priceData);

      // 3. Update Inventory
      const inventoryData = {
        inventoryMethod: values.inventoryMethod,
        stockQuantity: values.stockQuantity,
        displayStockAvailability: values.displayStockAvailability,
        displayStockQuantity: values.displayStockQuantity,
        minStockQuantity: values.minStockQuantity,
        lowStockActivity: values.lowStockActivity,
        notifyAdminForQuantityBelow: values.notifyAdminForQuantityBelow,
        backorderMode: values.backorderMode,
        allowBackInStockSubscriptions: values.allowBackInStockSubscriptions,
        minCartQuantity: values.minCartQuantity,
        maxCartQuantity: values.maxCartQuantity,
        allowedQuantities: values.allowedQuantities,
        notReturnable: values.notReturnable,
        productAvailabilityRange: values.productAvailabilityRange,
      };

      // Execute all three API calls in parallel for better performance
      await Promise.all([
        retryRequest(() =>
          axiosInstance.patch(
            `${API_BASE_URL}/admin/product/generalinfo/${values.Id}`,
            generalInfoData
          )
        ),
        retryRequest(() =>
          axiosInstance.patch(
            `${API_BASE_URL}/admin/product/priceDetails/${values.Id}`,
            priceData
          )
        ),
        retryRequest(() =>
          axiosInstance.patch(
            `${API_BASE_URL}/admin/product/updateInventory/${values.Id}`,
            inventoryData
          )
        ),
      ]);

      message.success("All product details updated successfully!");

      // Optional: Reload the page or update local state
      // window.location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product. Please try again.");
    }
  };

  console.log(product);

  return (
    <>
      <Button type="primary" onClick={() => form.submit()}>
        Save
      </Button>
      <Card title="Edit General Info" style={{ margin: "20px" }}>
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="ID" name="Id">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Product Type" name="ProductType">
                  <Input placeholder="Enter product type" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Product Template" name="ProductTemplate">
                  <Input placeholder="Enter product template" disabled />
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
              <ReactQuill
                theme="snow"
                onChange={(content) =>
                  form.setFieldsValue({ FullDescription: content })
                }
                value={form.getFieldValue("FullDescription")}
              />
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
                <Form.Item
                  label="Allow Customer Reviews"
                  name="AllowCustomerReviews"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Show on Homepage"
                  name="ShowOnHomePage"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Published"
                  name="Published"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Mark as New"
                  name="MarkAsNew"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Available Start Date"
                  name="AvailableStartDate"
                >
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
                <Form.Item
                  label="Mark as New Start Date"
                  name="MarkAsNewStartDate"
                >
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
            <Row gutter={16}>
              <Col span={12}>
                {/* Price Section */}
                <Card
                  title="Pricing Information"
                  style={{ marginBottom: "20px" }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="General Price" name="GeneralPrice">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter general price"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Old Price" name="OldPrice">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter old price"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Product Cost" name="ProductCost">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter product cost"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tax Category" name="TaxCategory">
                        <Input placeholder="Tax category" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Tier Prices */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Price for P1" name="price_P1">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter P1 price"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Price for P2" name="price_P2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter P2 price"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Price for P3" name="price_P3">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter P3 price"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Price for P4" name="price_P4">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter P4 price"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Price for P5" name="price_P5">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter P5 price"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="discounts">
                        {/* Custom label with current discount display */}
                        <span style={{ color: "#262626" }}>Discount: </span>

                        {appliedDiscounts.length > 0 ? (
                          <div>
                            {appliedDiscounts.map((d) => (
                              <Tag
                                color="green"
                                key={d.Id}
                                style={{ marginLeft: 8 }}
                              >
                                {d.Name}
                              </Tag>
                            ))}
                          </div>
                        ) : (
                          <div style={{ marginBottom: 8, color: "#999" }}>
                            No discounts applied
                          </div>
                        )}
                        <Button onClick={()=>{navigate('/discounts')}}>Add new</Button>
                       
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* inventor */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Inventory Method" name="inventoryMethod">
                  <Select placeholder="Select Inventory Method">
                    {Object.keys(manageInventoryMethodMap).map((key) => (
                      <Option key={key} value={key}>
                        {manageInventoryMethodMap[key]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Stock Quantity" name="stockQuantity">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Display Stock Availability"
                  name="displayStockAvailability"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Display Stock Quantity"
                  name="displayStockQuantity"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Min Stock Quantity" name="minStockQuantity">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Low Stock Activity" name="lowStockActivity">
                  <Select placeholder="Select Low Stock Activity">
                    {Object.keys(lowStockActivityMap).map((key) => (
                      <Option key={key} value={key}>
                        {lowStockActivityMap[key]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Notify Admin Below Quantity"
                  name="notifyAdminForQuantityBelow"
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Backorder Mode" name="backorderMode">
                  <Select placeholder="Select Backorder Mode">
                    {Object.keys(backorderModeMap).map((key) => (
                      <Option key={key} value={key}>
                        {backorderModeMap[key]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Allow Back In Stock Subscriptions"
                  name="allowBackInStockSubscriptions"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Min Cart Quantity" name="minCartQuantity">
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Max Cart Quantity" name="maxCartQuantity">
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Allowed Quantities (comma separated)"
                  name="allowedQuantities"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Not Returnable"
                  name="notReturnable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Product Availability Range"
                  name="productAvailabilityRange"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default ProductEdit;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Card,
  Space,
  Typography,
  Select,
  Upload,
  Popconfirm,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import CustomLayout from "../../../Components/Layout/Layout";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

import { Tabs } from "antd";
import EditSeo from "./Sections/EditSeo";
import EditPictures from "./Sections/EditPictures";
import EditProductAttribute from "./Sections/EditProductAttribute";
import EditPurchaseOrder from "./Sections/EditPurchaseOrder";
import GeneralInfo from "./EditProductSections/GeneralInfo";
import Prices from "./EditProductSections/Prices";
import InventoryInfo from "./EditProductSections/InventoryInfo";
import Mapping from "./EditProductSections/Mapping";
import TierPrices from "./EditProductSections/TierPrices";
const { TabPane } = Tabs;

const EditProduct = () => {
  const { id } = useParams();
  const [discounts, setDiscounts] = useState([]);
  const retryRequest = useRetryRequest();

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const buttonSize = useResponsiveButtonSize();

  const [product, setProduct] = useState({});

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      setProduct(responses.data.result);
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/discount/product`)
      );
      setDiscounts(response.data);
    } catch (error) {
      message.error("Failed to fetch discounts");
    }
  };

  useEffect(() => {
    productDetail();
    fetchDiscounts();
  }, [id]);

  return (
    <CustomLayout pageTitle={id ? "Edit Product" : "Add Product"} menuKey="3">
      <Title level={2} style={{ textAlign: "center" }}>
        {id ? "Edit Product" : "Add Product"}
      </Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Product Details" key="1">
          <GeneralInfo />
          <Prices />
          <TierPrices />
          <InventoryInfo />
          <Mapping />
        </TabPane>
        <TabPane tab="SEO" key="2">
          <EditSeo />
        </TabPane>
        <TabPane tab="Pictures" key="3">
          <EditPictures />
        </TabPane>
        <TabPane tab="Product Attribute" key="4">
          <EditProductAttribute />
        </TabPane>
        <TabPane tab="Purchase with Order" key="6">
          <EditPurchaseOrder />
        </TabPane>
      </Tabs>
    </CustomLayout>
  );
};

export default EditProduct;

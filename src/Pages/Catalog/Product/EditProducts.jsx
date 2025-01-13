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
import EditSpecificationAttribute from "./Sections/EditSpecificationAttribute";
import EditPurchaseOrder from "./Sections/EditPurchaseOrder";
import StockQuantityHistory from "./Sections/StockQuantityHistory";
import GeneralInfo from "./EditProductSections/GeneralInfo";
const { TabPane } = Tabs;

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [disabledPrices, setDisabledPrices] = useState({});
  const [deletingTierPrice, setDeletingTierPrice] = useState(false);

  const retryRequest = useRetryRequest();

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const buttonSize = useResponsiveButtonSize();

  const [product, setProduct] = useState({});

  const productDetail = async () => {
    try {
      const responses = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      setProduct(responses.data.result); // Assuming `responses.data.result` is the product data
      console.log("Product details: ", responses.data.result);
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



  // const fetchDiscounts = async () => {
  //   try {
  //     const response = await retryRequest(() =>
  //       axiosInstance.get(`${API_BASE_URL}/admin/discount/product`)
  //     );
  //     console.log("this is fetchedDiscounts", response.data);
  //     setDiscounts(response.data);
  //   } catch (error) {
  //     message.error("Failed to fetch discounts");
  //   }
  // };

  // const fetchManufacturers = async () => {
  //   try {
  //     const response = await retryRequest(() =>
  //       axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`)
  //     );
  //     setManufacturers(response.data);
  //   } catch (error) {
  //     message.error("Failed to fetch manufacturers");
  //   }
  // };

  // const fetchCategories = async () => {
  //   try {
  //     const response = await retryRequest(() =>
  //       axiosInstance.get(`${API_BASE_URL}/admin/category/all`)
  //     );
  //     const flattenedCategories = flattenCategories(response.data);
  //     setCategories(flattenedCategories);
  //   } catch (error) {
  //     message.error("Failed to fetch categories");
  //   }
  // };

  // const flattenCategories = (categories, parentPath = "") => {
  //   let flatData = [];
  //   categories.forEach((category) => {
  //     const currentPath = parentPath
  //       ? `${parentPath} >> ${category.Name}`
  //       : category.Name;
  //     flatData.push({
  //       id: category.Id,
  //       name: currentPath,
  //     });
  //     if (category.children && category.children.length > 0) {
  //       flatData = flatData.concat(
  //         flattenCategories(category.children, currentPath)
  //       );
  //     }
  //   });
  //   return flatData;
  // };

  // const fetchRoles = async () => {
  //   try {
  //     const response = await retryRequest(() =>
  //       axiosInstance.get(`${API_BASE_URL}/admin/customer/roles`)
  //     );
  //     setRoles(response.data);
  //   } catch (error) {
  //     message.error("Failed to fetch user roles");
  //   }
  // };

  // const fetchProductDetails = async () => {
  //   try {
  //     const response = await retryRequest(() =>
  //       axiosInstance.get(`${API_BASE_URL}/admin/product/${id}`)
  //     );
  //     const product = response.data;

  //     console.log("Product detail data is",product)

  //     // Extract the discount ID from the product details
  //     const discountId = product.Discount?.[0]?.Discount_Id;

  //     // Find the discount name from the discounts state
  //     const discount = discounts.find((d) => d.Id === discountId);
  //     const discountName = discount ? discount.Name : "";

  //     // Find the manufacturer name
  //     const manufacturer = manufacturers.find(
  //       (m) => m.Id === product.Manufacturer?.Id
  //     );
  //     const manufacturerName = manufacturer ? manufacturer.Name : "";

  //     const formValues = {
  //       Name: product.Name,
  //       Price: product.Price,
  //       FullDescription: product.FullDescription,
  //       ShortDescription: product.ShortDescription,
  //       OrderMinimumQuantity: product.OrderMinimumQuantity,
  //       OrderMaximumQuantity: product.OrderMaximumQuantity,
  //       StockQuantity: product.StockQuantity,
  //       Published: product.Published,
  //       CategoryId: product.Category?.Id,
  //       CategoryName: product.Category?.Name,
  //       VisibleIndividually: product.VisibleIndividually,
  //       MarkAsNew: product.MarkAsNew,
  //       AllowedQuantities: product.AllowedQuantities,
  //       Barcode: product.Barcode,
  //       Barcode2: product.Barcode2,
  //       AdminComment: product.AdminComment,
  //       OldPrice: product.OldPrice,
  //       ItemLocation: product.ItemLocation,
  //       BoxQty: product.BoxQty,
  //       DiscountId: discountId,
  //       DiscountName: discountName,
  //       ManufacturerId: product.Manufacturer?.Id || null,
  //       ManufacturerName: manufacturerName,
  //     };

  //     // Set tier prices
  //     product.TierPrices.forEach((tp, index) => {
  //       formValues[`Price${index + 1}`] = tp.Price;
  //       formValues[`Role${index + 1}`] = tp.CustomerRoleId;
  //     });

  //     setInitialValues(formValues);
  //     form.setFieldsValue(formValues);
  //     setImageUrl(product.ImageUrl);
  //   } catch (error) {
  //     message.error("Failed to fetch product details");
  //   }
  // };


  // const productDetail = async () => {
  //   try {
  //     const responses = await retryRequest(() =>
  //       axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`))

  //     console.log("new Api detail",responses)
  //   } catch (error) {
  //     message.error("Failed to fetch product details");
  //   }
  // }

  // useEffect(() => {productDetail(),fetchDiscounts()},[id])


 
  

  return (
    <CustomLayout pageTitle={id ? "Edit Product" : "Add Product"} menuKey="3">
      <Title level={2} style={{ textAlign: "center" }}>
        {id ? "Edit Product" : "Add Product"}
      </Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Product Details" key="1">
        <GeneralInfo productInfo ={product} />


        



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
      <TabPane tab="Specification Attribute" key="5">
        <EditSpecificationAttribute/>
      </TabPane>
      <TabPane tab="Purchase with Order" key="6">
        <EditPurchaseOrder />
      </TabPane>
      <TabPane tab="Stock Quantity History" key="7">
        <StockQuantityHistory />
      </TabPane>
      </Tabs>
    </CustomLayout>
  );
};

export default EditProducts;

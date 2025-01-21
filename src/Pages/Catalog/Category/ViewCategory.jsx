import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Form, message, Typography, Tabs, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { useNavigate, useParams } from "react-router-dom";
import EditCategory from "./components/EditCategory";
import CatrgoryProducts from "./components/CategoryProducts";
import CategorySEO from "./components/CategorySEO";

const { Title } = Typography;
const { TabPane } = Tabs;

const ViewCategory = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [discounts, setDiscounts] = useState([]);

  const fetchCategories = async (search = "") => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/category/all`, {
          params: { search },
        })
      );

      const flatData = flattenCategories(response.data);
      setDataSource(flatData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  };

  const getCategoryData = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/category/single/${id}`)
      );
      const categoryData = response.data;
      form.setFieldsValue({
        name: categoryData.Name,
        parentId: categoryData.ParentId,
        published: categoryData.Published,
        image: categoryData.Image || "",
        description: categoryData.Description || "",
        showOnHomePage: categoryData.ShowOnHomePage || false,
        discountId: categoryData.DiscountId,
        MetaKeywords: categoryData.MetaKeywords,
        MetaDescription: categoryData.MetaDescription,
        MetaTitle: categoryData.MetaTitle,
      });
      setCategoryName(categoryData.Name);
      setPreviewImage(categoryData.Image || "");
    } catch (error) {
      console.error("Error fetching category details:", error);
      message.error("Failed to fetch category details");
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/discount/category`)
      );
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      message.error("Failed to fetch discounts");
    }
  };

  useEffect(() => {
    if (id && id !== "create") {
      getCategoryData();
      console.log(id)
    }

    fetchCategories();
    fetchDiscounts();
  }, [id]);

  const handleImageRemove = () => {
    form.setFieldsValue({ image: "" });
    setImageFile(null);
    setPreviewImage("");
    form.setFieldsValue({ removedImage: true });
  };

  const handleImageUpload = ({ file }) => {
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const flattenCategories = (categories, parentPath = "", level = 0) => {
    let flatData = [];
    categories.forEach((category) => {
      const currentPath = parentPath
        ? `${parentPath} >> ${category.Name}`
        : category.Name;
      flatData.push({
        key: category.Id,
        id: category.Id,
        name: category.Name,
        path: currentPath,
        parentId: category.ParentId,
        published: category.Published,
        level,
        discountName: category.DiscountName,
        discountId: category.DiscountId,
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(
          flattenCategories(category.children, currentPath, level + 1)
        );
      }
    });
    return flatData;
  };

  return (
    <CustomLayout pageTitle="Categories" menuKey="2">
      <Button
        type="link"
        onClick={() => {
          navigate("/categories");
        }}
        icon={<ArrowLeftOutlined />}
      >
        Back to Category List
      </Button>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        {id && id !== "create" ? (
          <>
            Edit category details -{" "}
            <span style={{ color: "#001529" }}>{categoryName}</span>
          </>
        ) : (
          "Add a new category"
        )}
      </Title>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Category Info" key="1">
          <EditCategory
            id={id}
            form={form}
            dataSource={dataSource}
            discounts={discounts}
            previewImage={previewImage}
            imageFile={imageFile}
            handleImageRemove={handleImageRemove}
            handleImageUpload={handleImageUpload}
          />
        </TabPane>
        <TabPane tab="SEO" key="2">
          <CategorySEO id={id} form={form} />
        </TabPane>
        {id && id !== "create" && (
          <TabPane tab="Products" key="3">
            <CatrgoryProducts id={id} />
          </TabPane>
        )}
      </Tabs>
    </CustomLayout>
  );
};

export default ViewCategory;

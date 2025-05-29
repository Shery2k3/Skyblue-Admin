import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import { useMediaQuery } from "react-responsive";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import Sheet from "../../../Components/OrderSheet/Sheet";
import { Button, Select, Checkbox, message, Typography } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import styled from "styled-components";

const CategoryPath = styled.div`
  display: flex;
  align-items: center;
  .category-level {
    display: flex;
    align-items: center;
  }
  .category-name {
    margin-left: 4px;
  }
  .leaf-category {
    font-weight: bold;
  }
`;

const OrderSheet = () => {
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]);
  const [Roles, setRoles] = useState([]);
  const [tierRole, setTierRole] = useState();
  const [categoryId, setCategoryId] = useState(1);
  const [showPrice, setShowPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const { Option } = Select;
  const { Title } = Typography;

  console.log(tierRole, categoryId);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/roles`)
      );
      return response.data;
    };

    const fetchCategories = async () => {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/category/all`)
      );
      return flattenCategories(response.data);
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesData, categoriesData] = await Promise.all([
          fetchRoles(),
          fetchCategories(),
        ]);
        setRoles(rolesData);
        setCategories(categoriesData);
      } catch (error) {
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryRequest]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/ordersheet`, {
          params: { categoryId, tierRole },
        })
      );

      setDataSource(response.data.data);
    } catch (error) {
      console.error("Error fetching bestseller data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [retryRequest, categoryId, tierRole]);

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
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(
          flattenCategories(category.children, currentPath, level + 1)
        );
      }
    });
    return flatData;
  };

  const renderCategoryPath = (record) => {
    const levels = record.path.split(" >> ");
    return (
      <CategoryPath>
        {levels.map((level, index) => (
          <span key={index} className="category-level">
            {index > 0 && (
              <CaretRightOutlined style={{ marginLeft: 8, marginRight: 8 }} />
            )}
            <span
              className={
                index === levels.length - 1
                  ? "category-name leaf-category"
                  : "category-name"
              }
            >
              {level}
            </span>
          </span>
        ))}
      </CategoryPath>
    );
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const blob = await pdf(
        <Sheet products={dataSource} showPrice={showPrice} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "order_sheet.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      message.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <CustomLayout pageTitle="Order Sheet" menuKey="17">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Order Sheet
      </Title>

      <Select
        onChange={(value) => setCategoryId(value)}
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Select Category"
      >
        {categories.map((category) => (
          <>
            <Option key={category.id} value={category.id}>
              {renderCategoryPath(category)}
            </Option>
          </>
        ))}
      </Select>

      <Select
        placeholder="Select roles"
        onChange={(value) => setTierRole(value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        {Roles.map((role) => (
          <Option key={role.Id} value={role.Id}>
            {role.Name}
          </Option>
        ))}
      </Select>

      <Checkbox
        checked={showPrice}
        onChange={(e) => setShowPrice(e.target.checked)}
        style={{ marginBottom: 20 }}
      >
        Show Price
      </Checkbox>

      <br />

      <Button
        type="primary"
        size="large"
        onClick={handleDownloadPDF}
        disabled={pdfLoading}
      >
        {pdfLoading ? "Preparing PDF..." : "Export to PDF"}
      </Button>
    </CustomLayout>
  );
};

export default OrderSheet;

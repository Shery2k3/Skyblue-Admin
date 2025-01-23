//@desc: Create new dynamic route For view product("/category/:{categoryID}") within the category and a modal of "SEO"

//@desc: Update the api of Edit and create category (Requirements are above)
//@desc: Create New API of SEO w.r.t categoryID

import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Space,
  Tag,
  Typography,
  Pagination,
  Upload,
  Image,
  Spin,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  CaretRightOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const StyledTable = styled(Table)`
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
  }
  .category-path {
    display: flex;
    align-items: center;
  }
  .category-icon {
    margin-right: 8px;
  }
  .leaf-category {
    font-weight: bold;
  }
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
`;

const CenteredFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

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

const ResponsiveSpace = styled(Space)`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ResponsivePagination = styled(Pagination)`
  @media (max-width: 768px) {
    .ant-pagination-total-text {
      display: none;
    }
  }
`;

const ImagePreviewBox = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 16px;
`;

const Category = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 15;

  const retryRequest = useRetryRequest();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (search = "") => {
    setLoading(true); // Set loading to true
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
    } finally {
      setLoading(false); // Set loading to false
    }
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

  const navigate = useNavigate();
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleView = (customer) => {
    navigate(`/categories/${customer.key}`);
  };
  const columns = [
    {
      title: "Category Path",
      dataIndex: "path",
      key: "path",
      render: (_, record) => renderCategoryPath(record),
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "published",
      key: "published",
      width: 120,
      render: (published) => (
        <Tag
          color={published ? "green" : "red"}
          style={{ display: "block", textAlign: "center" }}
        >
          {published ? "Published" : "Unpublished"}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Discount",
      dataIndex: "discountName",
      key: "discountName",
      width: 200,
      render: (discountName) => discountName || "None",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px", textAlign: "center" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/categories/${record.id}`)}
          >
            Edit
          </Button>{" "}
          <Button onClick={() => handleView(record)}>View</Button>
        </div>
      ),
      align: "center",
    },
  ];

  const handleSearch = () => {
    fetchCategories(searchTerm);
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

  return (
    <CustomLayout pageTitle="Categories" menuKey="2">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Categories
      </Title>
      <div
        style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}
      >
        <ResponsiveSpace size="large" wrap>
          <Input
            placeholder="Search categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <StyledButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/categories/create");
            }}
            size="large"
            style={{ backgroundColor: "green", borderColor: "green" }}
          >
            Add Category
          </StyledButton>
        </ResponsiveSpace>
      </div>
      <Spin spinning={loading}>
        <StyledTable
          dataSource={dataSource.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Spin>
      <CenteredFooter>
        <ResponsivePagination
          current={currentPage}
          pageSize={pageSize}
          total={dataSource.length}
          onChange={handlePageChange}
          showQuickJumper
          showTotal={(total) => `Total: ${total}`}
          showSizeChanger={false}
        />
      </CenteredFooter>
    </CustomLayout>
  );
};

export default Category;


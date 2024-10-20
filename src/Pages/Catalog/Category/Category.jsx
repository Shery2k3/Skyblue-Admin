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
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  CaretRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import API_BASE_URL from "../../../constants";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import styled from "styled-components";

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

const Category = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const pageSize = 15;

  const retryRequest = useRetryRequest();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const showModal = async (category = null) => {
    setEditingCategory(category);
    setImageFile(null);
    if (category) {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/category/single/${category.id}`)
        );
        const categoryData = response.data;
        form.setFieldsValue({
          name: categoryData.Name,
          parentId: categoryData.ParentId,
          published: categoryData.Published,
          image: categoryData.Image || "",
        });
      } catch (error) {
        console.error("Error fetching category details:", error);
        message.error("Failed to fetch category details");
      }
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("ParentCategoryId", values.parentId);
      formData.append("Published", values.published);

      if (imageFile) {
        formData.append("Image", imageFile);
      }

      if (editingCategory) {
        // Edit existing category
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/category/edit/${editingCategory.id}`,
          formData
        );
        message.success("Category updated successfully");
      } else {
        // Add new category
        await axiosInstance.post(`${API_BASE_URL}/admin/category/add`, formData);
        message.success("Category added successfully");
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <StyledButton
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </StyledButton>
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

  const handleImageRemove = () => {
    form.setFieldsValue({ image: "" });
    setImageFile(null);
  };

  const handleImageUpload = ({ file }) => {
    setImageFile(file);
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
            onClick={() => showModal()}
            size="large"
            style={{ backgroundColor: "green", borderColor: "green" }}
          >
            Add Category
          </StyledButton>
        </ResponsiveSpace>
      </div>
      <StyledTable
        dataSource={dataSource.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
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
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the category name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="Parent Category">
            <Select
              allowClear
              placeholder="Select parent category"
              showSearch
              optionFilterProp="children"
            >
              <Option value={0}>None</Option>
              {dataSource.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.path}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="image" label="Image">
            {form.getFieldValue("image") && (
              <div style={{ marginBottom: 16 }}>
                <img
                  src={form.getFieldValue("image")}
                  alt="Category"
                  style={{ maxWidth: "100%", marginBottom: 8 }}
                />
                <Button onClick={handleImageRemove}>Remove Image</Button>
              </div>
            )}
            <Upload
              beforeUpload={() => false}
              onChange={handleImageUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </CustomLayout>
  );
};

export default Category;

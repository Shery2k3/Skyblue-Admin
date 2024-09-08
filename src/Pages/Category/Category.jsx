import React, { useEffect, useState } from 'react';
import CustomLayout from '../../Components/Layout/Layout';
import { Table, Button, Modal, Form, Input, Select, Switch, message, Space, Tag } from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import API_BASE_URL from '../../constants';

const { Option } = Select;

const Category = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (search = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/category/all`, {
        params: { search }
      });
      const flatData = flattenCategories(response.data);
      setDataSource(flatData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  };

  const flattenCategories = (categories, parentPath = '', level = 0) => {
    let flatData = [];
    categories.forEach(category => {
      const currentPath = parentPath ? `${parentPath} >> ${category.Name}` : category.Name;
      flatData.push({
        key: category.Id,
        id: category.Id,
        name: category.Name,
        path: currentPath,
        parentId: category.ParentId,
        published: category.Published,
        level
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(flattenCategories(category.children, currentPath, level + 1));
      }
    });
    return flatData;
  };

  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue({
        name: category.name,
        parentId: category.parentId,
        published: category.published
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        // Edit existing category
        const updatedFields = {};
        if (values.name !== editingCategory.name) updatedFields.Name = values.name;
        if (values.parentId !== editingCategory.parentId) updatedFields.ParentCategoryId = values.parentId;
        if (values.published !== editingCategory.published) updatedFields.Published = values.published;

        if (Object.keys(updatedFields).length > 0) {
          await axios.patch(`${API_BASE_URL}/admin/category/edit/${editingCategory.id}`, updatedFields);
          message.success("Category updated successfully");
        }
      } else {
        // Add new category
        await axios.post(`${API_BASE_URL}/admin/category/add`, {
          Name: values.name,
          ParentCategoryId: values.parentId,
          Published: values.published
        });
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

  const columns = [
    {
      title: 'Category Path',
      dataIndex: 'path',
      key: 'path',
      render: (text, record) => (
        <span style={{ marginLeft: `${record.level * 20}px` }}>{text}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      render: (published) => (
        <Tag color={published ? 'green' : 'red'}>
          {published ? 'Published' : 'Unpublished'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    fetchCategories(searchTerm);
  };

  return (
    <CustomLayout pageTitle="Categories" menuKey={2}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Search categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Category
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        footer={() => `Total categories: ${dataSource.length}`}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentId"
            label="Parent Category"
          >
            <Select
              allowClear
              placeholder="Select parent category"
              showSearch
              optionFilterProp="children"
            >
              <Option value={0}>None</Option>
              {dataSource.map(category => (
                <Option key={category.id} value={category.id}>{category.path}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="published"
            label="Published"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </CustomLayout>
  );
};

export default Category;
//@desc This component is used to apply discount to a category. It shows a button to open a modal to select a category to apply discount. It also shows a table of applied discounts to categories with an option to delete the discount, You'll have to make all backend Api related to this component as well 

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Table, Space, message, Input, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../Api/axiosConfig';
import useRetryRequest from '../../../../Api/useRetryRequest';
import debounce from 'lodash/debounce';

const AppliedToCategory = () => {
  const { id: discountId } = useParams();
  const retryRequest = useRetryRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Flatten categories helper function
  const flattenCategories = (categories, parentPath = "") => {
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
        published: category.Published
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(
          flattenCategories(category.children, currentPath)
        );
      }
    });
    return flatData;
  };

  // Fetch categories with search
  const fetchCategories = async (search = "") => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get('/admin/category/all', {
          params: { search }
        })
      );
      const flatData = flattenCategories(response.data);
      setCategories(flatData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchCategories(value);
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Apply discount to selected categories
  const handleApplyDiscount = async () => {
    if (selectedCategories.length === 0) {
      message.warning('Please select at least one category');
      return;
    }

    setLoading(true);
    try {
      await retryRequest(() =>
        axiosInstance.post(`/admin/applyDiscountToCategory/${discountId}`, {
          categoryIds: selectedCategories
        })
      );
      message.success('Discount applied successfully');
      setIsModalOpen(false);
      setSelectedCategories([]);
    } catch (error) {
      console.error("Error applying discount:", error);
      message.error("Failed to apply discount");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  // Modal columns configuration
  const categoriesColumns = [
    {
      title: 'Category Path',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: 'Select',
      key: 'select',
      render: (_, record) => (
        <Checkbox
          checked={selectedCategories.includes(record.id)}
          onChange={() => handleSelectionChange(record.id)}
        />
      ),
    }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  // Table columns for applied categories
  const appliedCategoriesColumns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewProduct(record)}>View</Button>
          <Button type="link" danger onClick={() => handleDeleteDiscount(record.discountId)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleViewProduct = (record) => {
    console.log("Viewing product:", record);
  };

  // Function to delete a discount from a category
  const handleDeleteDiscount = (discountId) => {
    setAppliedCategories(appliedCategories.filter(cat => cat.discountId !== discountId));
    message.success('Discount removed');
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 20 }}>
        Apply Discount to Category
      </Button>

      <Modal
        title="Select Categories to Apply Discount"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleApplyDiscount}
        width={800}
        confirmLoading={loading}
      >
        <Input
          placeholder="Search categories"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={categoriesColumns}
          dataSource={categories}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false
          }}
          loading={loading}
        />
      </Modal>

      {/* Existing applied categories table */}
      <Table
        columns={appliedCategoriesColumns}
        dataSource={appliedCategories}
        rowKey="discountId"
        pagination={false}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default AppliedToCategory;

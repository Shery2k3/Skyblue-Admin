//@desc This component is used to apply discount to a category. It shows a button to open a modal to select a category to apply discount. It also shows a table of applied discounts to categories with an option to delete the discount, You'll have to make all backend Api related to this component as well 

import React, { useState } from 'react';
import { Button, Modal, Table, Space, message } from 'antd';

const AppliedToCategory = () => {

  // Dummy data for categories and applied discounts
  const dummyCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home Appliances' },
  ];

  const dummyAppliedCategories = [
    { id: 1, categoryName: 'Electronics', discountId: 101 },
    { id: 2, categoryName: 'Clothing', discountId: 102 },
  ];

  // State to manage modal visibility and selected categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState(dummyCategories);
  const [appliedCategories, setAppliedCategories] = useState(dummyAppliedCategories);

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  // Function to open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Function to apply discount to a category
  const handleApplyDiscount = (categoryId) => {
    setLoading(true);
    // Here you can integrate your API to apply discount
    setTimeout(() => {
      setAppliedCategories((prev) => [
        ...prev,
        { id: categoryId, categoryName: categories.find(cat => cat.id === categoryId).name, discountId: Math.random() * 1000 },
      ]);
      message.success(`Discount applied to ${categories.find(cat => cat.id === categoryId).name}`);
      setLoading(false);
      setIsModalOpen(false);
    }, 1000);
  };

  // Function to delete a discount from a category
  const handleDeleteDiscount = (discountId) => {
    setAppliedCategories(appliedCategories.filter(cat => cat.discountId !== discountId));
    message.success('Discount removed');
  };

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

  // Table columns for available categories
  const categoriesColumns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleApplyDiscount(record.id)} loading={loading}>
          Apply Discount
        </Button>
      ),
    },
  ];

  const handleViewProduct = (record) => {
    console.log("Viewing product:", record);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
        Apply Discount to Category
      </Button>

      {/* Modal to select categories */}
      <Modal
        title="Select Category to Apply Discount"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Table
          columns={categoriesColumns}
          dataSource={categories}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Table to show applied discounts */}
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

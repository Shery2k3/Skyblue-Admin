import React, { useState, useEffect } from 'react';
import CustomLayout from '../../../../Components/Layout/Layout';
import { useParams } from 'react-router-dom';
import { Table, Button, Popconfirm, Input, Switch, message } from 'antd';
import axiosInstance from '../../../../Api/axiosConfig';
import API_BASE_URL from '../../../../constants';

const EditAttributeValues = () => {
  const { id } = useParams();
  const [attributeValues, setAttributeValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttributeValues = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/admin/product/get-product-attribute-values/${id}`);
      console.log(response);

      if (response.status === 200 && response.data.success) {
        setAttributeValues(response.data.result);
      } else {
        message.error('Failed to fetch attribute values');
      }
    } catch (error) {
      console.error('Error fetching attribute values:', error);
      message.error('Failed to fetch attribute values');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributeValues();
  }, [id]);

  const handleDelete = async (recordId) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/admin/product/delete-attribute-value/${recordId}`);
      message.success('Attribute value deleted successfully');
      fetchAttributeValues();
    } catch (error) {
      message.error('Failed to delete attribute value');
    }
  };

  const handleEdit = (record) => {
    // Implement edit functionality here
    console.log('Edit record:', record);
  };

  const columns = [
    {
      title: 'Value Type',
      dataIndex: 'AttributeValueTypeId',
      key: 'AttributeValueTypeId',
      render: (value) => (value === 0 ? 'Simple' : value),
    },
    { title: 'Name', dataIndex: 'Name', key: 'Name' },
    { title: 'Associated Product', dataIndex: 'AssociatedProductId', key: 'AssociatedProductId' },
    { title: 'Price Adjustment', dataIndex: 'PriceAdjustment', key: 'PriceAdjustment' },
    { title: 'Weight Adjustment', dataIndex: 'WeightAdjustment', key: 'WeightAdjustment' },
    {
      title: 'Is Preselected',
      dataIndex: 'IsPreSelected',
      key: 'IsPreSelected',
      render: (value) => <Switch checked={value} disabled />,
    },
    {
      title: 'Picture',
      dataIndex: 'ImageUrl',
      key: 'ImageUrl',
      render: (url) => url ? <img src={url} alt="Attribute" style={{ width: 50, height: 50 }} /> : <div style={{ width: 50, height: 50 }}></div>,
    },
    { title: 'Display Order', dataIndex: 'DisplayOrder', key: 'DisplayOrder' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" style={{ marginLeft: 8 }}>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Products" menuKey="3">
      <h1>Attribute Values for Product {id}</h1>
      <Table
        columns={columns}
        dataSource={attributeValues}
        rowKey="Id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </CustomLayout>
  );
};

export default EditAttributeValues;
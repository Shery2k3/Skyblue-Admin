import React, { useState } from "react";
import { Button, Table, Popconfirm, Input, message, Modal, Form } from "antd";
import axiosInstance from "../../../Api/axiosConfig";
import API_BASE_URL from "../../../constants";

const EditPreDefined = ({ preDefinedAttributes, fetchPreDefinedAttributes,editingAttribute }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();



  console.log("editingAttribute",editingAttribute)

  const showEditModal = (record) => {
    setEditingRow(record);
    form.setFieldsValue({ Name: record.Name });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("editingRow", editingRow, values);
      
      const response = await axiosInstance.patch(`${API_BASE_URL}/admin/product/edit-predefined-value/${editingRow.Id}`, {
        Name: values.Name,
      });
  
      console.log("response", response);
  
      if (response.status === 200 && response.data.success) {
        message.success("Attribute updated successfully");
        setIsModalVisible(false);
        fetchPreDefinedAttributes();
      } else {
        throw new Error("Failed to update attribute");
      }
    } catch (error) {
      console.error("Error updating attribute:", error);
      message.error(error.message || "Failed to update attribute");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("id", id);
      await axiosInstance.delete(`${API_BASE_URL}/admin/product/delete-predefined-value/${id}`);
      message.success("Attribute deleted successfully");
      fetchPreDefinedAttributes();
    } catch (error) {
      message.error("Failed to delete attribute");
    }
  };

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      console.log("Adding new attribute", values,editingAttribute);
      
       const response = await axiosInstance.post(`${API_BASE_URL}/admin/product/add-predefined-value/${editingAttribute.Id}`, {
         Name: values.Name,
       });
  
      console.log("response", response);
  
      if (response.status === 200 && response.data.success) {
        message.success("Attribute added successfully");
        setIsAddModalVisible(false);
        fetchPreDefinedAttributes();
        addForm.resetFields();
      } else {
        throw new Error("Failed to add attribute");
      }
    } catch (error) {
      console.error("Error adding attribute:", error);
      message.error(error.message || "Failed to add attribute");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "Name", key: "Name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button type="default" onClick={() => showEditModal(record)}>Edit</Button>
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
    <>
      <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>
        Add New
      </Button>
      <Table columns={columns} dataSource={preDefinedAttributes} rowKey="Id" pagination={false} />

      <Modal
        title="Edit Attribute"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="Name"
            rules={[{ required: true, message: "Please enter attribute name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Attribute"
        visible={isAddModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Add"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Name"
            name="Name"
            rules={[{ required: true, message: "Please enter attribute name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditPreDefined;
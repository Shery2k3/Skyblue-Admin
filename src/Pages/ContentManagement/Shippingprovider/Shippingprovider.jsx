import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import { Table, Button, Modal, Form, Input, message, Typography } from "antd";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../Api/useRetryRequest";
import axiosInstance from "../../../Api/axiosConfig";
import API_BASE_URL from "../../../constants";

const Shippingprovider = () => {
  const { id } = useParams();
  const { Title } = Typography;
  const retryRequest = useRetryRequest();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();

  const fetchShippingMethod = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/shipping-method/all`)
      );
      setShippingMethods(response.data.shippingMethods);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch shipping methods");
    }
  };

  useEffect(() => {
    fetchShippingMethod();
  }, [id]);

  const showModal = () => {
    setIsEditMode(false);
    setSelectedMethod(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (method) => {
    setIsEditMode(true);
    setSelectedMethod(method);
    form.setFieldsValue(method);
    setIsModalVisible(true);
  };

  const handleDelete = async (methodId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/admin/shipping-method/delete`,
        {
          data: { methodId },
        }
      );

      if (response.data.success) {
        message.success("Shipping method deleted successfully");
        fetchShippingMethod(); // Refresh the list after deleting
      } else {
        message.error(
          response.data.message || "Failed to delete shipping method"
        );
      }
    } catch (error) {
      console.error("Failed to delete shipping method:", error);
      message.error("Failed to delete shipping method");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Log the form values to verify

      // Change Description from undefined to null
      if (values.Description === undefined) {
        values.Description = null;
      }

      // Call the add new API
      const result = await axiosInstance.post(
        `${API_BASE_URL}/admin/shipping-method/add`,
        values
      );

      if (!result.data.success) {
        message.error("Failed to save shipping method");
        return;
      }
      message.success("Shipping method added successfully");

      setIsModalVisible(false);
      form.resetFields();
      fetchShippingMethod(); // Refresh the list after adding
    } catch (error) {
      console.error("Validate Failed:", error);
      message.error("Failed to save shipping method");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const isEditing = (record) => record.Id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      Name: "",
      DisplayOrder: "",
      Description: "",
      ...record,
    });
    setEditingKey(record.Id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (Id) => {
    try {
      const row = await form.validateFields();
      // Send the update request to the backend API
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/shipping-method/edit`,
        {
          id: Id,
          ...row,
        }
      );

      if (response.data.success) {
        message.success("Shipping method updated successfully");
        setEditingKey("");
        fetchShippingMethod();
      } else {
        message.error(
          response.data.message || "Failed to update shipping method"
        );
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      message.error("Failed to update shipping method");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "Id", key: "Id" },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      editable: true,
    },
    {
      title: "Display Order",
      dataIndex: "DisplayOrder",
      key: "DisplayOrder",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.Id)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </span>
        ) : (
          <>
            <Button
              type="primary"
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
            <Button type="danger" onClick={() => handleDelete(record.Id)}>
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "DisplayOrder" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? <Input type="number" /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: dataIndex !== "Description",
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <CustomLayout pageTitle="Shippingprovider" menuKey="20">
    <Title level={2} style={{ textAlign: "center", marginBottom: 20, fontWeight: "bold" }}>
        Shipping Methods
      </Title>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={showModal}>
          Add New
        </Button>
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={shippingMethods}
          columns={mergedColumns}
          rowClassName="editable-row"
          rowKey="Id"
          scroll={{ x: 'max-content' }}
        />
      </Form>
      <Modal
        title={isEditMode ? "Edit Shipping Method" : "Add New Shipping Method"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="DisplayOrder"
            label="Display Order"
            rules={[
              { required: true, message: "Please enter the display order" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Description"
            rules={[
              { required: false, message: "Please enter the description" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </CustomLayout>
  );
};

export default Shippingprovider;

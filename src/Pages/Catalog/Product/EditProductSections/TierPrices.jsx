import React, { useEffect, useState } from "react";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import {
  message,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  DatePicker,
} from "antd";
import dayjs from "dayjs"; // Import dayjs

const { Option } = Select;

const TierPrices = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [tierPrices, setTierPrices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-detail/${id}`)
      );
      const productData = response.data.result;
      const tierPrices = productData.prices.tierPrices;
      setTierPrices(tierPrices);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch product");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/customer/roles`)
      );
      setRoles(response.data);
    } catch (error) {
      message.error("Failed to fetch user roles");
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchRoles();
  }, [id]);

  const handleAddNew = async (values) => {
    console.log("New Tier Price:", values); // Log the values for debugging

    // Prepare the data to send in the API request
    const {
      CustomerRoleId,
      Price,
      Quantity,
      StartDateTimeUtc,
      EndDateTimeUtc,
    } = values;

    // Check if the StartDateTimeUtc or EndDateTimeUtc are empty, and set them to null if they are
    const preparedValues = {
      CustomerRoleId,
      Price,
      Quantity,
      StartDateTimeUtc: StartDateTimeUtc
        ? StartDateTimeUtc.toISOString()
        : null,
      EndDateTimeUtc: EndDateTimeUtc ? EndDateTimeUtc.toISOString() : null,
    };

    // Send the POST request to the server
    try {
      const response = await retryRequest(() =>
        axiosInstance.post(
          `${API_BASE_URL}/admin/product/tierPrice/${id}`,
          preparedValues
        )
      );

      // Check for success response
      if (response.data.success) {
        message.success("Tier price added successfully.");
        fetchProduct(); // Reload the tier prices after adding a new one
      } else {
        message.error("Failed to add tier price.");
      }
    } catch (error) {
      console.error("Error adding tier price:", error);
      message.error("An error occurred while adding the tier price.");
    } finally {
      // Close the modal whether the request was successful or not
      setIsModalVisible(false);
    }
  };

  const handleEdit = async (record, values) => {
    try {
      console.log("Edited Tier Price:", { ...record, ...values });

      console.log("values", values.CustomerRoleId, record.CustomerRoleId);

      // Prepare the data to send in the API request
      const updatedTierPrice = {
        CustomerRoleId: values.CustomerRoleId || record.CustomerRoleId,
        Price: values.Price || record.Price,
        Quantity: values.Quantity || record.Quantity,
        StartDateTimeUtc: values.StartDateTimeUtc
          ? dayjs(values.StartDateTimeUtc).toISOString() // Convert to dayjs and then to ISO string
          : record.StartDateTimeUtc,
        EndDateTimeUtc: values.EndDateTimeUtc
          ? dayjs(values.EndDateTimeUtc).toISOString() // Same for EndDateTimeUtc
          : record.EndDateTimeUtc,
      };

      // Send the PUT request to update the tier price
      const response = await retryRequest(() =>
        axiosInstance.patch(
          `${API_BASE_URL}/admin/product/editTierPrice/${id}`,
          updatedTierPrice
        )
      );

      if (response.data.success) {
        message.success("Tier price updated successfully.");

        // Update the local state to reflect the changes
        setTierPrices((prev) =>
          prev.map((tierPrice) =>
            tierPrice.CustomerRoleId === record.CustomerRoleId
              ? { ...tierPrice, ...updatedTierPrice }
              : tierPrice
          )
        );
      } else {
        message.error("Failed to update tier price.");
      }
    } catch (error) {
      console.error("Error editing tier price:", error);
      message.error("An error occurred while editing the tier price.");
    } finally {
      // Reset the editing state
      setEditingRow(null);
    }
  };

  const handleDelete = async (record) => {
    console.log("Deleted Tier Price:", record);
    const response = await retryRequest(() =>
      axiosInstance.delete(`${API_BASE_URL}/admin/product/tierPrice/${id}`, {
        data: {
          customerRoleId: record.CustomerRoleId,
        },
      })
    );
    if (response.data.success) {
      message.success("Tier price deleted successfully.");
      setTierPrices((prev) =>
        prev.filter(
          (tierPrice) => tierPrice.CustomerRoleId !== record.CustomerRoleId
        )
      );
    } else {
      message.error("Failed to delete tier price.");
    }
  };

  const columns = [
    {
      title: "Customer Role",
      dataIndex: "CustomerRoleName",
      key: "CustomerRoleName",
      render: (text, record) => {
        return editingRow === record.CustomerRoleId ? (
          // Disable the select input to prevent role changes
          <Select
            defaultValue={record.CustomerRoleId}
            style={{ width: 200 }}
            // Make the select input disabled so the user cannot change the role
          >
            {roles
              .filter(
                (role) =>
                  // Exclude roles that are already present in the tierPrices list,
                  // but keep the current role (record.CustomerRoleId) available for editing
                  !tierPrices.some(
                    (tierPrice) =>
                      tierPrice.CustomerRoleId === role.Id &&
                      tierPrice.CustomerRoleId !== record.CustomerRoleId
                  )
              )
              .map((role) => (
                <Option key={role.Id} value={role.Id}>
                  {role.Name}
                </Option>
              ))}
          </Select>
        ) : (
          text
        );
      },
    },

    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (text, record) =>
        editingRow === record.CustomerRoleId ? (
          <Input
            defaultValue={record.Price}
            onChange={(e) => (record.Price = e.target.value)}
          />
        ) : (
          `$${text}`
        ),
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      render: (text, record) =>
        editingRow === record.CustomerRoleId ? (
          <Input
            defaultValue={record.Quantity}
            onChange={(e) => (record.Quantity = e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Start Date",
      dataIndex: "StartDateTimeUtc",
      key: "StartDateTimeUtc",
      render: (text, record) =>
        editingRow === record.CustomerRoleId ? (
          <DatePicker
            defaultValue={
              record.StartDateTimeUtc ? dayjs(record.StartDateTimeUtc) : null
            }
            onChange={(date) =>
              (record.StartDateTimeUtc = date ? date.toISOString() : null)
            }
          />
        ) : text ? (
          dayjs(text).format("YYYY-MM-DD") // Use dayjs for formatting
        ) : (
          "N/A"
        ),
    },
    {
      title: "End Date",
      dataIndex: "EndDateTimeUtc",
      key: "EndDateTimeUtc",
      render: (text, record) =>
        editingRow === record.CustomerRoleId ? (
          <DatePicker
            defaultValue={
              record.EndDateTimeUtc ? dayjs(record.EndDateTimeUtc) : null
            }
            onChange={(date) =>
              (record.EndDateTimeUtc = date ? date.toISOString() : null)
            }
          />
        ) : text ? (
          dayjs(text).format("YYYY-MM-DD") // Use dayjs for formatting
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        return editingRow === record.CustomerRoleId ? (
          <>
            <Button
              type="link"
              onClick={() => handleEdit(record, { ...record })}
            >
              Save
            </Button>
            <Button type="link" onClick={() => setEditingRow(null)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              type="link"
              onClick={() => setEditingRow(record.CustomerRoleId)}
            >
              Edit
            </Button>
            <Button type="link" onClick={() => handleDelete(record)}>
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Card>
      <h4>Tier Prices</h4>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add New Tier Price
      </Button>
      <Table
        columns={columns}
        dataSource={tierPrices || []}
        scroll={{ x: "max-content" }}
        rowKey="CustomerRoleId"
        pagination={{ pageSize: 5 }} // Add pagination here
        bordered
      />
      <Modal
        title="Add New Tier Price"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddNew} layout="vertical">
          <Form.Item
            label="Customer Role"
            name="CustomerRoleId"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Option key={role.Id} value={role.Id}>
                  {role.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="Price"
            rules={[{ required: true, message: "Please enter a price!" }]}
          >
            <Input type="number" prefix="$" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="Quantity"
            rules={[{ required: true, message: "Please enter a quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Start Date" name="StartDateTimeUtc">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="End Date" name="EndDateTimeUtc">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TierPrices;

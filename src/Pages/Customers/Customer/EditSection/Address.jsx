import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import useRetryRequest from "../../../../Api/useRetryRequest";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import moment from "moment";

const { Option } = Select;

const Address = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchAddress();
    fetchCountry();
  }, [id]);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/customer-details-address/${id}`)
      );
      if (response.data?.Id && response.data?.Email) {
        setAddressData(response.data.Addresses || []);
        setEmail(response.data.Email);
      } else {
        setError("Failed to fetch address data");
      }
    } catch (err) {
      setError("An error occurred while fetching address data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountry = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/orders/countries-states`)
      );
      setCountries(response.data.data.countries);
      setStates(response.data.data.states);
    } catch (err) {
      setError("An error occurred while fetching countries and states data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    console.log("Delete button clicked", record);
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/admin/customer-address/${record.Id}`
      );
      if (response.status !== 200) {
        message.error("Failed to delete address");
      } else {
        message.success("Address deleted successfully");
        fetchAddress();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Failed to delete address");
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const response = await axiosInstance.post(
            `${API_BASE_URL}/admin/add-customer-address/${id}`,
            values
          );
          console.log("New Address Added:", response.data);
          setIsModalVisible(false);
          form.resetFields();
          fetchAddress();
        } catch (error) {
          console.error("Error adding new address:", error);
          message.error("Failed to add new address");
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const showModal = () => {
    form.setFieldsValue({ Email: email });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const renderColumns = () => [
    { title: "First Name", dataIndex: "FirstName", key: "FirstName" },
    { title: "Last Name", dataIndex: "LastName", key: "LastName" },
    { title: "Email", dataIndex: "Email", key: "Email" },
    {
      title: "Company",
      dataIndex: "Company",
      key: "Company",
      render: (text) => text || "N/A",
    },
    { title: "City", dataIndex: "City", key: "City" },
    { title: "Address 1", dataIndex: "Address1", key: "Address1" },
    {
      title: "Address 2",
      dataIndex: "Address2",
      key: "Address2",
      render: (text) => text || "N/A",
    },
    { title: "Postal Code", dataIndex: "ZipPostalCode", key: "ZipPostalCode" },
    { title: "Phone Number", dataIndex: "PhoneNumber", key: "PhoneNumber" },
    {
      title: "Created On",
      dataIndex: "CreatedOnUtc",
      key: "CreatedOnUtc",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => navigate(`/edit/${record.Id}`)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const renderForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="FirstName"
        label="First Name"
        rules={[{ required: true, message: "Please enter the first name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="LastName"
        label="Last Name"
        rules={[{ required: true, message: "Please enter the last name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Email"
        label="Email"
        rules={[{ required: true, message: "Please enter the email" }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item name="Company" label="Company">
        <Input />
      </Form.Item>
      <Form.Item
        name="Country"
        label="Country"
        rules={[{ required: true, message: "Please select a country" }]}
      >
        <Select
          showSearch
          placeholder="Select a country"
          optionFilterProp="children"
          onChange={(value) => {
            const filteredStates = states.filter(
              (state) => state.CountryId === value
            );
            form.setFieldsValue({ State: undefined });
            setStates(filteredStates);
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {countries.map((country) => (
            <Option key={country.Id} value={country.Id}>
              {country.Name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="State"
        label="State"
        rules={[{ required: true, message: "Please select a state" }]}
      >
        <Select
          showSearch
          placeholder="Select a state"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {states.map((state) => (
            <Option key={state.Id} value={state.Id}>
              {state.Name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="City"
        label="City"
        rules={[{ required: true, message: "Please enter the city" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Address1"
        label="Address 1"
        rules={[{ required: true, message: "Please enter the address" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="Address2" label="Address 2">
        <Input />
      </Form.Item>
      <Form.Item
        name="ZipPostalCode"
        label="Postal Code"
        rules={[{ required: true, message: "Please enter the postal code" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="PhoneNumber"
        label="Phone Number"
        rules={[{ required: true, message: "Please enter the phone number" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin tip="Loading address data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ margin: "20px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Addresses</h2>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "20px" }}
      >
        Add New Address
      </Button>
      {addressData.length > 0 ? (
        <Table
          dataSource={addressData}
          columns={renderColumns()}
          rowKey="Id"
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
        />
      ) : (
        <Alert
          message="No Data"
          description="No address data available for this customer."
          type="info"
          showIcon
        />
      )}
      <Modal
        title="Add New Address"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default Address;
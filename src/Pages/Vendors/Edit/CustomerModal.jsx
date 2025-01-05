import React, { useState, useCallback } from "react";
import { Modal, Input, Button, Table, Spin } from "antd";
import API_BASE_URL from "../../../constants";
import useRetryRequest from "../../../Api/useRetryRequest";
import axiosInstance from "../../../Api/axiosConfig";
import { debounce } from "lodash";

const CustomerModal = ({ visible, onCancel, onSelectCustomer }) => {
  const retryRequest = useRetryRequest();

  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Function to handle email search with debounce
  const handleSearch = useCallback(
    debounce(async (emailSearch) => {
      if (!emailSearch) {
        setCustomers([]); // Clear the results if search is empty
        return;
      }

      setLoading(true);
      setSearching(true);

      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/searchcustomer?email=${emailSearch}`)
        );

        setCustomers(response.data.result);
      } catch (error) {
        console.error("Error fetching customers", error);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    }, 500), // 500ms delay before triggering search
    [] // Empty dependency array ensures debounce function is not recreated
  );

  const handleSelectCustomer = (customer) => {
    console.log("Selected customer", customer);
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      ellipsis: true, // Add ellipsis for overflow text
    },
    {
      title: "Username",
      dataIndex: "Username",
      key: "username",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "Active",
      key: "status",
      render: (text) => (text ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleSelectCustomer(record)}>Select</Button>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      title="Search and Select Customer"
      onCancel={onCancel}
      footer={null}
      width="80%" // Make modal width responsive
      centered
      bodyStyle={{ padding: "20px" }}
    >
      <Input
        placeholder="Search by email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleSearch(e.target.value); // Trigger debounced search
        }}
        onPressEnter={() => handleSearch(email)} // Trigger search on Enter key
        style={{ marginBottom: 20 }}
      />
      <Button
        onClick={() => handleSearch(email)} // Trigger search on click
        loading={loading}
        style={{ marginBottom: 20 }}
        disabled={searching}
      >
        Search
      </Button>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="Id"
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 5 }} // Limit the table results per page
          scroll={{ x: 600 }} // Allow horizontal scrolling for wider tables
          size="middle"
        />
      )}
    </Modal>
  );
};

export default CustomerModal;

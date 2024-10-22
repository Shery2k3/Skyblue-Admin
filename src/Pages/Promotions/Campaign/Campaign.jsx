import React, { useEffect, useState } from "react";
import { Table, Select, Button, Typography, message } from "antd";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import { useNavigate } from "react-router-dom";
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the hook
import dayjs from "dayjs"; // Import dayjs

const { Option } = Select;
const { Title } = Typography;

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState("");

  const navigate = useNavigate();
  const retryRequest = useRetryRequest(); // Use the retry request hook

  // Function to fetch campaigns based on storeId
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/campaigns/all-campaigns${storeId ? `?storeId=${storeId}` : ""}`)
      );
      setCampaigns(response.data.data);
    } catch (error) {
      console.error("Error fetching campaigns", error);
      message.error("Failed to fetch campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []); // Only run once when component mounts

  // Redirect to the edit page for the selected campaign
  const handleEdit = (id) => {
    navigate(`/campaign/edit/${id}`);
  };

  // Columns for the Antd Table
  const columns = [
    {
      title: "Campaign Name",
      dataIndex: "Name",
      key: "name",
    },
    {
      title: "Created On",
      dataIndex: "CreatedOnUtc",
      key: "createdOn",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"), // Format the date
    },
    {
      title: "Planned Date Of Sending", // Changed column title
      dataIndex: "DontSendBeforeDateUtc",
      key: "dontSendBefore",
      render: (text) => text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "", // Format date or return empty string
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button type="link" onClick={() => handleEdit(record.Id)}>
          Edit
        </Button>
      ),
    },
  ];

  // Handle StoreId change
  const handleStoreIdChange = (value) => {
    setStoreId(value);
  };

  return (
    <CustomLayout pageTitle="Campaigns" menuKey="15">
      <Title level={3} style={{ marginBottom: '16px', textAlign:'center' }}>Campaign Management</Title>
      <Button type="primary" onClick={() => navigate('/campaign/create-new')} style={{ marginBottom: '16px' }}>
        Create New Campaign
      </Button>
      <div style={{ marginBottom: "16px", display: 'flex', alignItems: 'center' }}>
        <Select
          placeholder="Select Store ID"
          value={storeId}
          onChange={handleStoreIdChange}
          style={{ width: 200, marginRight: 8 }}
        >
          <Option value="">All</Option>
          <Option value="1">Sky Glass</Option>
          <Option value="3">Sky Blue Wholesale</Option>
        </Select>
        <Button type="primary" onClick={fetchCampaigns} loading={loading}>
          Search Campaigns
        </Button>
      </div>
      <Table
        dataSource={campaigns}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="Id"
        pagination={{ pageSize: 15 }} // Add pagination
      />
    </CustomLayout>
  );
};

export default Campaign;

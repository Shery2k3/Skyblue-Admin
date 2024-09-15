import React, { useState, useEffect, useCallback } from "react";
import CustomLayout from "../../Components/Layout/Layout";
import axios from "axios";
import API_BASE_URL from "../../constants";
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook
import {
  Table,
  Image,
  Button,
  Modal,
  message,
  Popconfirm,
  Space,
  Carousel,
} from "antd";
import { CheckOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./CustomerApproval.css";

const CustomerApproval = () => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const retryRequest = useRetryRequest();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/unapproved`)
      );
      const users = response.data.data.map((user) => ({
        key: user.Id,
        id: user.Id,
        name: `${user.FirstName} ${user.LastName}`,
        email: user.Email,
        company: user.Company,
        address: `${user.Address1}, ${user.Address2}, ${user.City}, ${user.ZipPostalCode}`,
        phone: user.PhoneNumber,
        createdOn: new Date(user.CreatedOnUtc).toLocaleDateString(),
        documents: user.Documents,
      }));
      setDataSource(users);
    } catch (error) {
      console.error("Error fetching Users: ", error);
      message.error("Failed to fetch users");
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`${API_BASE_URL}/admin/approve/${id}`);
      message.success("Customer approved successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error approving customer: ", error);
      message.error("Failed to approve customer");
    }
  };

  const showDocuments = (documents) => {
    setSelectedDocuments(documents);
    setCurrentDocIndex(0);
    setModalVisible(true);
  };

  const renderDocument = useCallback((doc) => {
    if (doc.toLowerCase().endsWith(".pdf")) {
      return (
        <iframe
          src={`${doc}#toolbar=0`}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      );
    } else {
      return (
        <div className="carousel-image-container">
          <img src={doc} alt="Document" className="carousel-image" />
        </div>
      );
    }
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentDocIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentDocIndex((prev) =>
      prev < selectedDocuments.length - 1 ? prev + 1 : prev
    );
  }, [selectedDocuments.length]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      render: (documents) => (
        <Space>
          <Button onClick={() => showDocuments(documents)}>
            View Documents ({documents.length})
          </Button>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to approve this customer?"
          onConfirm={() => handleApprove(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            icon={<CheckOutlined />}
            className="approve-button"
          >
            Approve
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Customer Requests" menuKey="8">
      <div className="customer-approval-container">
        <h1>Customer Approval</h1>
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: "max-content" }}
        />
        <Modal
          title="Document Viewer"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={1000}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {selectedDocuments.length > 0 &&
              renderDocument(selectedDocuments[currentDocIndex])}
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button
                onClick={handlePrevious}
                icon={<LeftOutlined />}
                disabled={currentDocIndex === 0}
              />
              <span>{`${currentDocIndex + 1} / ${
                selectedDocuments.length
              }`}</span>
              <Button
                onClick={handleNext}
                icon={<RightOutlined />}
                disabled={currentDocIndex === selectedDocuments.length - 1}
              />
            </Space>
          </Space>
        </Modal>
      </div>
    </CustomLayout>
  );
};

export default CustomerApproval;

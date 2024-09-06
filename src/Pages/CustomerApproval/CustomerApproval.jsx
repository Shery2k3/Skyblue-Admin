import React, { useState, useEffect } from 'react';
import CustomLayout from '../../Components/Layout/Layout';
import axios from 'axios';
import API_BASE_URL from '../../constants';
import { Table, Image, Button, Modal, message, Popconfirm } from 'antd';
import { CheckOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import './CustomerApproval.css';

const CustomerApproval = () => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/unapproved`);
      const users = response.data.data.map(user => ({
        key: user.Id,
        id: user.Id,
        name: `${user.FirstName} ${user.LastName}`,
        email: user.Email,
        company: user.Company,
        address: `${user.Address1}, ${user.Address2}, ${user.City}, ${user.ZipPostalCode}`,
        phone: user.PhoneNumber,
        createdOn: new Date(user.CreatedOnUtc).toLocaleDateString(),
        documents: user.Documents
      }));
      setDataSource(users);
    } catch (error) {
      console.error('Error fetching Users: ', error);
      message.error('Failed to fetch users');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/approve/${id}`);
      message.success('Customer approved successfully');
      fetchUsers(); 
    } catch (error) {
      console.error('Error approving customer: ', error);
      message.error('Failed to approve customer');
    }
  };

  const showDocument = (doc) => {
    setSelectedDocument(doc);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
    },
    {
      title: 'Documents',
      dataIndex: 'documents',
      key: 'documents',
      render: (documents) => (
        <div className="document-grid">
          {documents.map((doc, index) => (
            <div key={index} className="document-item">
              {doc.toLowerCase().endsWith('.pdf') ? (
                <Button icon={<FilePdfOutlined />} onClick={() => showDocument(doc)}>
                  View PDF
                </Button>
              ) : (
                <Image
                  width={50}
                  src={doc}
                  preview={{
                    mask: <EyeOutlined />
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
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
    <CustomLayout>
      <div className="customer-approval-container">
        <h1>Customer Approval</h1>
        <Table dataSource={dataSource} columns={columns} />
        <Modal
          title="Document Viewer"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedDocument && selectedDocument.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={`${selectedDocument}#toolbar=0`}
              width="100%"
              height="500px"
              title="PDF Viewer"
            />
          ) : (
            <Image
              src={selectedDocument}
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          )}
        </Modal>
      </div>
    </CustomLayout>
  );
};

export default CustomerApproval;
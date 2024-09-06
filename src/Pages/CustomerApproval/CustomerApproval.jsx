import React from 'react'
import CustomLayout from '../../Components/Layout/Layout'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../../constants'
import { Table, Image } from 'antd'
import './CustomerApproval.css'

const CustomerApproval = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/unapproved`)
      const users = response.data.data.map(user => ({
        key: user.Id,
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
      console.error('Error fetching Users: ', error)
    }
  }

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
        <div className="image-grid">
          {documents.map((doc, index) => (
            <Image
              key={index}
              width={50}
              src={doc}
              className="image-item"
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <CustomLayout>
      <Table dataSource={dataSource} columns={columns} />
    </CustomLayout>
  )
}

export default CustomerApproval
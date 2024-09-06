import CustomLayout from "../../Components/Layout/Layout";
import { Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from '../../constants.js'

const Customer = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/customer/all`);
        const data = response.data.map((customer) => ({
          key: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          company: customer.company,
          phone: customer.phone,
          active: customer.active ? "Active" : "Inactive",
          roles: customer.roles.map(role => role.name).join(", "),
        }));
        setDataSource(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchData();
  }, []);

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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
    },
  ];

  return <CustomLayout pageTitle="Customer">
    <Table dataSource={dataSource} columns={columns} scroll={{ x: "max-content" }} />;
  </CustomLayout>
}

export default Customer;
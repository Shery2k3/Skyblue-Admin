import CustomLayout from "../../Components/Layout/Layout";
import { Table, Button, Modal, Checkbox, Select, message, Pagination, Input, Space, Row, Col, Tag } from "antd";
import { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../../constants.js'
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const { Option } = Select;

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Customer = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [removedRoles, setRemovedRoles] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isStartingFetch, setIsStartingFetch] = useState(false);
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchPhoneNumber, setSearchPhoneNumber] = useState('');

  const retryRequest = useRetryRequest();

  const fetchCustomers = useCallback(
    debounce(async (page) => {
      if (isFetching) return;
      setIsStartingFetch(false);
      setIsFetching(true);
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/customer/all?size=${pageSize}&page=${page}`)
        );
        const { data, totalCustomers, totalPages, pageNumber } = response.data;

        const formattedData = data.map((customer) => ({
          key: customer.id,
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          company: customer.company,
          phone: customer.phone,
          active: customer.active,
          roles: customer.roles,
        }));

        setDataSource(formattedData);
        setTotalCustomers(totalCustomers);
        setTotalPages(totalPages);
        setCurrentPage(pageNumber);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsFetching(false);
      }
    }, 300),
    [isFetching, pageSize]
  );

  const searchCustomers = useCallback(
    debounce(async (page) => {
      if (isFetching) return;
      setIsStartingFetch(false);
      setIsFetching(true);
      try {
        const params = {
          size: pageSize,
          page: page
        };
        if (searchFirstName) params.firstName = searchFirstName;
        if (searchLastName) params.lastName = searchLastName;
        if (searchPhoneNumber) params.phoneNumber = searchPhoneNumber;

        const response = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/customer/all`, { params })
        );
        const { data, totalCustomers, totalPages, pageNumber } = response.data;

        const formattedData = data.map((customer) => ({
          key: customer.id,
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          company: customer.company,
          phone: customer.phone,
          active: customer.active,
          roles: customer.roles,
        }));

        setDataSource(formattedData);
        setTotalCustomers(totalCustomers);
        setTotalPages(totalPages);
        setCurrentPage(pageNumber);
      } catch (error) {
        console.error("Error searching customer data:", error);
      } finally {
        setIsFetching(false);
      }
    }, 300),
    [isFetching, pageSize, searchFirstName, searchLastName, searchPhoneNumber]
  );

  useEffect(() => {
    fetchCustomers(currentPage);
    fetchRoles();
  }, [currentPage]);

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/admin/customer/roles`);
      setAvailableRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsActive(customer.active);
    setSelectedRoles(customer.roles.map(role => role.name));
    setRemovedRoles([]);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const payload = {};
    if (isActive !== selectedCustomer.active) {
      payload.active = isActive;
    }
    if (selectedRoles.length > 0) {
      payload.roles = availableRoles
        .filter(role => selectedRoles.includes(role.Name))
        .map(role => role.Id);
    }
    if (removedRoles.length > 0) {
      payload.removeRoles = availableRoles
        .filter(role => removedRoles.includes(role.Name))
        .map(role => role.Id);
    }

    if (Object.keys(payload).length > 0) {
      try {
        await axiosInstance.patch(`${API_BASE_URL}/admin/customer/${selectedCustomer.id}`, payload);
        message.success('Customer updated successfully');
        fetchCustomers(currentPage);
      } catch (error) {
        console.error("Error updating customer:", error);
        message.error('Failed to update customer');
      }
    }

    setIsModalVisible(false);
  };

  const handleRoleChange = (newRoles) => {
    const added = newRoles.filter(role => !selectedRoles.includes(role));
    const removed = selectedRoles.filter(role => !newRoles.includes(role));

    setSelectedRoles(newRoles);
    setRemovedRoles([...removedRoles, ...removed]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page) => {
    if (!isFetching && !isStartingFetch) {
      setIsStartingFetch(true);
      setCurrentPage(page);
      if (searchFirstName || searchLastName || searchPhoneNumber) {
        searchCustomers(page);
      } else {
        fetchCustomers(page);
      }
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchCustomers(1);
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active) =>
        active ? <Tag color='green'>{"ACTIVE"}</Tag> : <Tag color='volcano'>{"INACTIVE"}</Tag> ,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => roles.map(role => role.name).join(", "),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Customer" menuKey="7"> 
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="First Name"
                value={searchFirstName}
                onChange={(e) => setSearchFirstName(e.target.value)}
              />
              <Input
                placeholder="Last Name"
                value={searchLastName}
                onChange={(e) => setSearchLastName(e.target.value)}
              />
              <Input
                placeholder="Phone Number"
                value={searchPhoneNumber}
                onChange={(e) => setSearchPhoneNumber(e.target.value)}
              />
              <Button onClick={handleSearch} type="primary">
                Search
              </Button>
            </Space.Compact>
          </Col>
        </Row>

        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: "max-content" }}
          pagination={false}
          loading={isFetching}
        />

        <Row justify="center" style={{ marginTop: '20px' }}>
          <Col>
            <Pagination
              current={currentPage}
              total={totalCustomers}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              disabled={isFetching || isStartingFetch}
            />
          </Col>
        </Row>
      </Space>

      <Modal
        title="Edit Customer"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Checkbox
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          >
            Active
          </Checkbox>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select roles"
            value={selectedRoles}
            onChange={handleRoleChange}
          >
            {availableRoles.map(role => (
              <Option key={role.Id} value={role.Name}>{role.Name}</Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </CustomLayout>
  );
}

export default Customer;
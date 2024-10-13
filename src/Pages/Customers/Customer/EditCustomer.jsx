import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomLayout from '../../../Components/Layout/Layout';
import { Typography, Form, Input, Checkbox, Button, Select, message } from 'antd';
import API_BASE_URL from "../../../constants.js";
import axiosInstance from "../../../Api/axiosConfig.js";
import useRetryRequest from '../../../Api/useRetryRequest.js';

const { Title } = Typography;
const { Option } = Select;

const EditCustomer = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const retryRequest = useRetryRequest();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [removedRoles, setRemovedRoles] = useState([]);

    useEffect(() => {
        fetchCustomerDetails();
        fetchCountries();
        fetchRoles();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            const response = await retryRequest(() =>
                axiosInstance.get(
                    `${API_BASE_URL}/admin/customer-details/${id}`
                )
            );
            const customerData = response.data;
            setEmail(customerData.Email);
            setRoles(customerData.Roles.map(role => role.Id));
            form.setFieldsValue({
                email: customerData.Email,
                roles: customerData.Roles.map(role => role.Id),
                FirstName: customerData.FirstName,
                LastName: customerData.LastName,
                Company: customerData.Company,
                Address1: customerData.Address1,
                Address2: customerData.Address2,
                ZipPostalCode: customerData.ZipPostalCode,
                City: customerData.City,
                CountryId: customerData.CountryId,
                StateProvinceId: customerData.StateProvinceId,
                PhoneNumber: customerData.PhoneNumber,
                Active: customerData.Active
            });
            if (customerData.CountryId) {
                fetchStates(customerData.CountryId);
            }
        } catch (error) {
            message.error('Failed to fetch customer details');
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await retryRequest(() =>
                axiosInstance.get(`${API_BASE_URL}/customer/countries`)
            );
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchStates = async (countryId) => {
        try {
            const response = await retryRequest(() =>
                axiosInstance.get(`${API_BASE_URL}/customer/states/${countryId}`)
            );
            setStates(response.data);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await retryRequest(() =>
                axiosInstance.get(`${API_BASE_URL}/admin/roles`)
            );
            setAllRoles(response.data);
        } catch (error) {
            message.error('Failed to fetch roles');
        }
    };

    const handleRoleChange = (selectedRoles) => {
        const removed = roles.filter(role => !selectedRoles.includes(role));
        setRemovedRoles([...removedRoles, ...removed]);
        setRoles(selectedRoles);
    };

    const handleSubmit = async (values) => {
        try {
            await retryRequest(() =>
                axiosInstance.patch(`${API_BASE_URL}/admin/customer-details/${id}`, {
                    ...values,
                    roles,
                    removeRoles: removedRoles
                })
            );
            message.success('Customer updated successfully');
            navigate(`/edit-customer/${id}`);
        } catch (error) {
            message.error('Failed to update customer');
        }
    };

    return (
        <CustomLayout pageTitle="Edit Customer" menuKey="12">
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
                Edit Customer: {email}
            </Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: 600, margin: '0 auto' }}
            >
                <Form.Item name="email" label="Email">
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item name="roles" label="Roles">
                    <Select
                        mode="multiple"
                        placeholder="Select roles"
                        value={roles}
                        onChange={handleRoleChange}
                    >
                        {allRoles.map(role => (
                            <Option key={role.Id} value={role.Id}>
                                {role.Name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="FirstName" label="First Name">
                    <Input />
                </Form.Item>
                <Form.Item name="LastName" label="Last Name">
                    <Input />
                </Form.Item>
                <Form.Item name="Company" label="Company">
                    <Input />
                </Form.Item>
                <Form.Item name="Address1" label="Address 1">
                    <Input />
                </Form.Item>
                <Form.Item name="Address2" label="Address 2">
                    <Input />
                </Form.Item>
                <Form.Item name="ZipPostalCode" label="Zip/Postal Code">
                    <Input />
                </Form.Item>
                <Form.Item name="City" label="City">
                    <Input />
                </Form.Item>
                <Form.Item name="CountryId" label="Country">
                    <Select onChange={(value) => fetchStates(value)}>
                        {countries.map(country => (
                            <Option key={country.Id} value={country.Id}>{country.Name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="StateProvinceId" label="State/Province">
                    <Select>
                        {states.map(state => (
                            <Option key={state.Id} value={state.Id}>{state.Name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="PhoneNumber" label="Phone Number">
                    <Input />
                </Form.Item>
                <Form.Item name="Active" valuePropName="checked">
                    <Checkbox>Active</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Customer
                    </Button>
                </Form.Item>
            </Form>
        </CustomLayout>
    );
};

export default EditCustomer;
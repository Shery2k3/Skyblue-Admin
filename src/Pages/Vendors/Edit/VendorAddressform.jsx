import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Spin } from "antd";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import API_BASE_URL from "../../../constants";
import { useParams } from "react-router-dom";

const { Option } = Select;

const VendorAddressForm = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch countries and states
        const countryStateRes = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/orders/countries-states`)
        );
        setCountries(countryStateRes.data.data.countries);
        setStates(countryStateRes.data.data.states);

        // Fetch vendor address
        const addressRes = await retryRequest(() =>
          axiosInstance.get(`${API_BASE_URL}/admin/getvendoraddress/${id}`)
        );
        const addressData = addressRes.data.data;

        // Initialize form with fetched data
        form.setFieldsValue({
          email: addressData.Email,
          country: addressData.CountryId,
          state: addressData.StateProvinceId,
          city: addressData.City,
          address1: addressData.Address1,
          address2: addressData.Address2,
          zipCode: addressData.ZipPostalCode,
          phone: addressData.PhoneNumber,
          fax: addressData.FaxNumber,
        });

        // Filter states based on country
        handleCountryChange(addressData.CountryId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCountryChange = (countryId) => {
    const filtered = states.filter((state) => state.CountryId === parseInt(countryId));
    setFilteredStates(filtered);
    form.setFieldsValue({ state: "" }); // Reset state when country changes
  };

  const handleSaveChanges = async (values) => {
    try {
      await axiosInstance.patch(`${API_BASE_URL}/admin/update-vendor-address/${id}`, values);
      message.success("Address updated successfully");
    } catch (error) {
      console.error("Error updating address:", error);
      message.error("Failed to update address");
    }
  };

  return (
    <Spin spinning={loading}>
      <Form layout="vertical" form={form} onFinish={handleSaveChanges}>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Country" name="country">
          <Select placeholder="Select a country" onChange={handleCountryChange}>
            {countries.map((country) => (
              <Option key={country.Id} value={country.Id}>
                {country.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="State/Province" name="state">
          <Select placeholder="Select a state" disabled={!filteredStates.length}>
            {filteredStates.map((state) => (
              <Option key={state.Id} value={state.Id}>
                {state.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="City" name="city">
          <Input />
        </Form.Item>

        <Form.Item label="Address 1" name="address1">
          <Input />
        </Form.Item>

        <Form.Item label="Address 2" name="address2">
          <Input />
        </Form.Item>

        <Form.Item label="ZIP/Postal Code" name="zipCode">
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Fax Number" name="fax">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Save Address
        </Button>
      </Form>
    </Spin>
  );
};

export default VendorAddressForm;

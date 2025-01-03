//@desc:Go back button work

import React, { useEffect, useState } from "react";
import {
  Typography,
  Spin,
  Tabs,
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Select,
} from "antd";
import { useParams } from "react-router-dom";
import axiosInstance from "../../Api/axiosConfig";
import useRetryRequest from "../../Api/useRetryRequest";
import CustomLayout from "../../Components/Layout/Layout";
import API_BASE_URL from "../../constants";

const { Title } = Typography;
const { TabPane } = Tabs;

const EditVendor = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const retryRequest = useRetryRequest();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [address, setAddress] = useState([]);

  //vendors data
  const fetchVendor = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/getonevendor/${id}`)
      );
      console.log(response.data);
      if (response.data?.success) {
        setVendorData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetcVendorAddress = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/getvendoraddress/${id}`)
      );
      console.log("Vendor address", response.data);
      setAddress(response.data.data);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    }
  };

  //Country/state data
  const fetchCountryList = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/orders/countries-states`)
      );
      //console.log(response.data);
      setCountries(response.data.data.countries);
      setStates(response.data.data.states);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  //Filter w.r.t Country Name, state Name

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    // Filter the states based on the selected country
    setStates(
      states.filter((state) => state.CountryId === parseInt(countryId))
    );
    setSelectedState(""); // Reset the selected state
  };

  useEffect(() => {
    fetchCountryList();
    fetchVendor();
    fetcVendorAddress();
  }, []);

  //APIs

  //vendorinfo Update
  const handleSaveChangesInfo = async (values) => {
    const updatedVendorData = {
      name: values.name,
      email: values.email,
      description: values.description,
      adminComment: values.adminComment,
      active: values.active,
      displayOrder: values.displayOrder,
      pageSize: values.pageSize,
      pageSizeOptions: values.pageSizeOptions,
    };

    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/editvendor/${id}`,
        updatedVendorData
      );
      if (response.data.success) {
        message.success("Vendor updated successfully");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  //vendor Address update
  const handleSaveChangesAddress = async (values) => {
    // Include selectedCountry and selectedState in the values object
    const updatedValues = {
      ...values,
      country: selectedCountry, // Add selected country
      state: selectedState, // Add selected state
    };

    console.log("Form Data Submitted:", updatedValues);

    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/update-vendor-address/${id}`,
        updatedValues
      );
      console.log(response);
      message.success("Address updated successfully");
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  //SEO update
  const handleSaveChangesSEO = async (values) => {
    const updatedSEOData = {
      metaTitle: values.metaTitle,
      metaKeywords: values.metaKeywords,
      metaDescription: values.metaDescription,
    };

    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/editvendor/${id}`,
        updatedSEOData
      );
      if (response.data.success) {
        message.success("SEO updated successfully");
      }
    } catch (error) {
      console.error("Error updating SEO:", error);
    }
  };

  //Note update
  const handleSaveChangesNote = (values) => {
    console.log("Form Data Submitted:", values);
  };

  if (loading) {
    return (
      <CustomLayout pageTitle="Vendors" menuKey="6">
        <Spin
          tip="Loading..."
          style={{ margin: "20px auto", display: "block" }}
        />
      </CustomLayout>
    );
  }

  return (
    <CustomLayout pageTitle="Vendors" menuKey="6">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Edit Vendor
        <br /> {vendorData.Name}
      </Title>
      <Button>Go Back</Button>
      <Tabs defaultActiveKey="1" centered>
        {/* Vendor Info Tab */}
        <TabPane tab="Vendor Info" key="1">
          <Form layout="vertical" onFinish={handleSaveChangesInfo}>
            <Form.Item label="Name" name="name" initialValue={vendorData.Name}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              initialValue={vendorData.Email}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              initialValue={vendorData.Description}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Admin Comment"
              name="adminComment"
              initialValue={vendorData.AdminComment}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Active"
              name="active"
              valuePropName="checked"
              initialValue={vendorData.Active}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item
              label="Display Order"
              name="displayOrder"
              initialValue={vendorData.DisplayOrder}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Page Size"
              name="pageSize"
              initialValue={vendorData.PageSize}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Page Size Options"
              name="pageSizeOptions"
              initialValue={vendorData.PageSizeOptions}
            >
              <Input placeholder="e.g., 24, 48, 72" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form>
        </TabPane>

        {/* Vendor SEO Tab */}
        <TabPane tab="Vendor SEO" key="2">
          <Form layout="vertical" onFinish={handleSaveChangesSEO}>
            <Form.Item
              label="Meta Title"
              name="metaTitle"
              initialValue={vendorData.MetaTitle}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Meta Keywords"
              name="metaKeywords"
              initialValue={vendorData.MetaKeywords}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Meta Description"
              name="metaDescription"
              initialValue={vendorData.MetaDescription}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save SEO Changes
            </Button>
          </Form>
        </TabPane>

        {/* Vendor Note Tab */}
        <TabPane tab="Vendor Note" key="3">
          <Form layout="vertical" onFinish={handleSaveChangesNote}>
            <Form.Item
              label="Admin Comment"
              name="adminComment"
              initialValue={"Admin Comment"}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save Note
            </Button>
          </Form>
        </TabPane>

        {/* Address Tab */}
        <TabPane tab="Address" key="4">
          <Form layout="vertical" onFinish={handleSaveChangesAddress}>
            <Form.Item
              label="Email"
              name="email"
              initialValue={vendorData.Email}
            >
              <Input disabled />
            </Form.Item>

            {/* Country Dropdown */}
            <Form.Item
              label="Country"
              name="country"
              initialValue={vendorData.Country || ""}
            >
              <div>
                <label>Country:</label>
                <select value={selectedCountry} onChange={handleCountryChange}>
                  <option value="">Select a country</option>
                  {countries?.map((country) => (
                    <option key={country.Id} value={country.Id}>
                      {country.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>State/Province:</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                >
                  <option value="">Select a state</option>
                  {states
                    ?.filter(
                      (state) => state.CountryId === parseInt(selectedCountry)
                    )
                    .map((state) => (
                      <option key={state.Id} value={state.Id}>
                        {state.Name}
                      </option>
                    ))}
                </select>
              </div>
            </Form.Item>
            {/* Rest of the address fields */}
            <Form.Item
              label="City"
              name="city"
              initialValue={address.City || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address 1"
              name="address1"
              initialValue={address.Address1 || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address 2"
              name="address2"
              initialValue={address.Address2 || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="ZIP/Postal Code"
              name="zipCode"
              initialValue={address.ZipPostalCode || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              initialValue={address.PhoneNumber || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Fax Number"
              name="fax"
              initialValue={address.FaxNumber || ""}
            >
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Save Address
            </Button>
          </Form>
        </TabPane>
      </Tabs>
      {console.log("Address", address)}
    </CustomLayout>
  );
};

export default EditVendor;

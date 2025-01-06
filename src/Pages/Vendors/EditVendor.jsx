//@desc:Go back button work
//@desc: Improve the ui

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
  Upload,
  Tooltip,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Api/axiosConfig";
import useRetryRequest from "../../Api/useRetryRequest";
import CustomLayout from "../../Components/Layout/Layout";
import API_BASE_URL from "../../constants";
import VendorSEO from "./Edit/VendorSEOForm";
import CustomerModal from "./Edit/CustomerModal";
import { UploadOutlined } from "@ant-design/icons";
import VendorAddressForm from "./Edit/VendorAddressform";

const { Title } = Typography;
const { TabPane } = Tabs;

const EditVendor = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const [visible, setVisible] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const retryRequest = useRetryRequest();
  const navigate = useNavigate();

  //vendors data
  const fetchVendor = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/getonevendoredit/${id}`)
      );
      console.log("Vendor Data", response.data);
      if (response.data?.success) {
        setVendorData(response.data.vendor);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleSelectCustomers = (customerIds) => {
    setSelectedCustomerIds(customerIds);
    console.log("Selected Customer IDs:", customerIds);
  };

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

  const handlePictureUpload = (file) => {
    // Validate file type (optional)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPG, PNG, or GIF files!");
      return;
    }

    // Validate file size (optional)
    const maxSizeInMB = 2; // 2MB
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      message.error(`File must be smaller than ${maxSizeInMB}MB!`);
      return;
    }

    // Generate preview (optional)
    const previewUrl = URL.createObjectURL(file);
    console.log("Preview URL:", previewUrl);

    // Upload the file (replace this with your API logic)
    const formData = new FormData();
    formData.append("file", file);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_BASE_URL}/admin/removecustomervendor`,
        { customerId } // Sending customerId in request body
      );

      if (response.data?.success) {
        message.success("Customer removed successfully.");
        // Update the UI to remove the deleted customer
        setVendorData((prevState) => ({
          ...prevState,
          customers: prevState.customers.filter(
            (customer) => customer.Id !== customerId
          ),
        }));
      } else {
        message.error("Failed to remove the customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("An error occurred while removing the customer.");
    }
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
        <br />
      </Title>
      <Button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </Button>
      <Tabs defaultActiveKey="1" centered>
        {/* Vendor Info Tab */}
        <TabPane tab="Vendor Info" key="1">
          <Form layout="vertical" onFinish={handleSaveChangesInfo}>
            {/* Name Field */}
            <Form.Item label="Name" name="name" initialValue={vendorData.Name}>
              <Input />
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              label="Email"
              name="email"
              initialValue={vendorData.Email}
            >
              <Input />
            </Form.Item>

            {/* Display Customers Section */}
            <Form.Item label="Customers">
            <Tooltip title="A List of a customer accounts which could be used to manage products and orders of this vendor(have access to the vendor portal). You can associate customers to a vendor by clicking the 'Add New Customer' button. If you dont want the vendor to have access to the vendor portal, then do not associate any customer account with it.">
                <span style={{ cursor: "pointer", marginLeft: 8 }}>?</span>
              </Tooltip>
              {vendorData.customers && vendorData.customers.length > 0 ? (
                <div style={{ marginBottom: "1rem" }}>
                  {vendorData.customers.map((customer) => (
                    <div
                      key={customer.Id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem 1rem",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>
                        <strong>{customer.Username}</strong> - {customer.Email}{" "}
                        ({customer.Active ? "Active" : "Inactive"})
                      </span>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteCustomer(customer.Id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No customers available.</div>
              )}
              <Button type="dashed" onClick={handleOpenModal}>
                Add New Customer
              </Button>
            </Form.Item>

            {/* Picture Upload */}
            <Form.Item label="Picture">
              <Upload
                listType="picture"
                beforeUpload={(file) => {
                  handlePictureUpload(file); // Custom handler function for uploading
                  return false; // Prevent auto-upload
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Picture</Button>
              </Upload>
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="description"
              initialValue={vendorData.Description}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            {/* Admin Comment */}
            <Form.Item
              label="Admin Comment"
              name="adminComment"
              initialValue={vendorData.AdminComment}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            {/* Active Checkbox */}
            <Form.Item
              label="Active"
              name="active"
              valuePropName="checked"
              initialValue={vendorData.Active}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>

            {/* Display Order */}
            <Form.Item
              label="Display Order"
              name="displayOrder"
              initialValue={vendorData.DisplayOrder}
            >
              <Input type="number" />
            </Form.Item>

            {/* Page Size */}
            <Form.Item
              label="Page Size"
              name="pageSize"
              initialValue={vendorData.PageSize}
            >
              <Input type="number" />
            </Form.Item>

            {/* Page Size Options */}
            <Form.Item
              label="Page Size Options"
              name="pageSizeOptions"
              initialValue={vendorData.PageSizeOptions}
            >
              <Input placeholder="e.g., 24, 48, 72" />
            </Form.Item>

            {/* Save Changes Button */}
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form>

          {/* Customer Modal */}
          <CustomerModal
            visible={visible}
            onCancel={handleCloseModal}
            onSelectCustomers={handleSelectCustomers}
            vendorId={id}
          />
        </TabPane>

        {/* Vendor SEO Tab */}
        <TabPane tab="Vendor SEO" key="2">
          <VendorSEO vendorId={id} />
        </TabPane>

        {/* Address Tab */}
        <TabPane tab="Address" key="3">
          <VendorAddressForm />
        </TabPane>
      </Tabs>
    </CustomLayout>
  );
};

export default EditVendor;

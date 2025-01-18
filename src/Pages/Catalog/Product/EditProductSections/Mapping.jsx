//@desc: please check for update mapping of product with manufacturer and vendor, add category

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../../Api/useRetryRequest";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import { message, Select, Button } from "antd";

const { Option } = Select;

const Mapping = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();

  const [manufacturers, setManufacturers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [productData, setProductData] = useState(null);

  const productMapping = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-mapping/${id}`)
      );
      console.log("response.data", response.data.manufacturers);
      setProductData(response.data);
      setSelectedManufacturers(
        response.data.manufacturers.map((m) => ({
          ManufacturerId: m.ManufacturerId,
          ManufacturerName: m.ManufacturerName,
        })) || []
      );

      setSelectedVendor(response.data.productVendorMapping?.VendorId || null);
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const fetchManufacturers = async (query = "") => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`, {
          params: { name: query },
        })
      );
      setManufacturers(response.data || []);
    } catch (error) {
      console.error("Error fetching manufacturers data:", error);
    }
  };

  const fetchVendors = async (query = "") => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/vendors`, {
          params: { name: query },
        })
      );
      setVendors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        manufacturers: selectedManufacturers,
        vendor: selectedVendor,
      };
      console.log("payload", payload);
       await retryRequest(() =>
         axiosInstance.patch(
           `${API_BASE_URL}/admin/product/updateMapping/${id}`,
           payload
         )
       );
      message.success("Product mapping updated successfully!");
    } catch (error) {
      message.error("Failed to save product mapping");
    }
  };

  useEffect(() => {
    productMapping();
    fetchManufacturers();
    fetchVendors();
  }, []);

  return (
    <div>
      <h1>Product Mapping</h1>
      <div>
        <h3>Manufacturers</h3>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select manufacturers"
          value={selectedManufacturers.map((m) => m.ManufacturerName)} // Display names in the dropdown
          onChange={(values) => {
            const updatedSelections = values
              .map((name) => {
                const manufacturer = manufacturers.find(
                  (m) => m.name === name // Match `name` field
                );
                if (manufacturer) {
                  return {
                    ManufacturerId: manufacturer.id, // Use `id` for ManufacturerId
                    ManufacturerName: manufacturer.name, // Use `name` for ManufacturerName
                  };
                }
                return null; // Ignore unmatched values
              })
              .filter(Boolean); // Remove any null entries
            setSelectedManufacturers(updatedSelections);
          }}
          optionLabelProp="label"
        >
          {manufacturers.map((manufacturer) => (
            <Option
              key={manufacturer.id}
              value={manufacturer.name} // Use `name` for selection
              label={manufacturer.name}
            >
              {manufacturer.name}
            </Option>
          ))}
        </Select>
      </div>
      <div style={{ marginTop: 16 }}>
        <h3>Vendor</h3>
        <Select
          style={{ width: "100%" }}
          placeholder="Select a vendor"
          value={selectedVendor}
          onChange={setSelectedVendor}
        >
          {vendors.map((vendor) => (
            <Option key={vendor.Id} value={vendor.Id}>
              {vendor.Name}
            </Option>
          ))}
        </Select>
      </div>
      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Mapping;

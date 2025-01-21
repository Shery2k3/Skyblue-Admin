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
  const [categories, setCategories] = useState([]);

  // Update state definitions
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedManufacturerIds, setSelectedManufacturerIds] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(-1); // Default to "No Vendor"

  // Update productMapping to set IDs
  const productMapping = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product-mapping/${id}`)
      );
      
      // Set category IDs from response
      setSelectedCategoryIds(
        response.data.category?.map(c => c.CategoryId) || []
      );

      // Set manufacturer IDs
      setSelectedManufacturerIds(
        response.data.manufacturers?.map(m => m.ManufacturerId) || []
      );

      // Set vendor ID with fallback to -1
      setSelectedVendorId(response.data.productVendorMapping?.VendorId || -1);
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

  // Add categories fetch function
  const fetchCategories = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/category/all`)
      );
      const flattenedCategories = flattenCategories(response.data);
      setCategories(flattenedCategories);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  // Add flatten categories helper function
  const flattenCategories = (categories, parentPath = "") => {
    let flatData = [];
    categories.forEach((category) => {
      const currentPath = parentPath
        ? `${parentPath} >> ${category.Name}`
        : category.Name;
      flatData.push({
        id: category.Id,
        name: currentPath,
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(
          flattenCategories(category.children, currentPath)
        );
      }
    });
    return flatData;
  };

  // Update handleSave to send IDs
  const handleSave = async () => {
    try {
      const payload = {
        manufacturerIds: selectedManufacturerIds,
        vendorId: selectedVendorId,
        categoryIds: selectedCategoryIds
      };
      
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

  // Modify useEffect to include categories fetch
  useEffect(() => {
    productMapping();
    fetchManufacturers();
    fetchVendors();
    fetchCategories(); // Add this
  }, []);

  return (
    <div>
      <h1>Product Mapping</h1>

      <div>
        <h3>Categories</h3>
        <Select
          mode="multiple"
          value={selectedCategoryIds}
          onChange={setSelectedCategoryIds}
          style={{ width: "100%" }}
          placeholder="Select categories"
          showSearch
          optionFilterProp="children"
        >
          {categories.map((category) => (
            <Option 
              key={category.id} 
              value={category.id}
              label={category.name}
            >
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Manufacturers</h3>
        <Select
          mode="multiple"
          value={selectedManufacturerIds}
          onChange={setSelectedManufacturerIds}
          style={{ width: "100%" }}
          placeholder="Select manufacturers"
          optionLabelProp="label"
        >
          {manufacturers.map((manufacturer) => (
            <Option
              key={manufacturer.id}
              value={manufacturer.id}
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
          value={selectedVendorId}
          onChange={setSelectedVendorId}
          style={{ width: "100%" }}
          placeholder="Select a vendor"
        >
          <Option key={0} value={0}>No Vendor</Option>
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

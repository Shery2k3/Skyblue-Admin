import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";
import { message, Select, Button, Row, Col } from "antd";

const { Option } = Select;

const Mapping = () => {
  const { id } = useParams();

  const [manufacturers, setManufacturers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedManufacturerIds, setSelectedManufacturerIds] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(-1);

  const productMapping = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/admin/product-mapping/${id}`);
      
      setSelectedCategoryIds(response.data.category?.map(c => c.CategoryId) || []);
      setSelectedManufacturerIds(response.data.manufacturers?.map(m => m.ManufacturerId) || []);
      setSelectedVendorId(response.data.productVendorMapping?.VendorId || -1);
    } catch (error) {
      message.error("Failed to fetch product details");
    }
  };

  const fetchManufacturers = async (query = "") => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`, {
        params: { name: query },
      });
      setManufacturers(response.data || []);
    } catch (error) {
      console.error("Error fetching manufacturers data:", error);
    }
  };

  const fetchVendors = async (query = "") => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/admin/vendors`, {
        params: { name: query },
      });
      setVendors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/admin/category/all`);
      const flattenedCategories = flattenCategories(response.data);
      setCategories(flattenedCategories);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const flattenCategories = (categories, parentPath = "") => {
    let flatData = [];
    categories.forEach((category) => {
      const currentPath = parentPath ? `${parentPath} >> ${category.Name}` : category.Name;
      flatData.push({
        id: category.Id,
        name: currentPath,
      });
      if (category.children && category.children.length > 0) {
        flatData = flatData.concat(flattenCategories(category.children, currentPath));
      }
    });
    return flatData;
  };

  const handleSave = async () => {
    try {
      const payload = {
        manufacturerIds: selectedManufacturerIds,
        vendorId: selectedVendorId,
        categoryIds: selectedCategoryIds
      };
      
      await axiosInstance.patch(`${API_BASE_URL}/admin/product/updateMapping/${id}`, payload);
      message.success("Product mapping updated successfully!");
    } catch (error) {
      message.error("Failed to save product mapping");
    }
  };

  useEffect(() => {
    productMapping();
    fetchManufacturers();
    fetchVendors();
    fetchCategories();
  }, [id]);

  return (
    <div>
      <h1>Product Mapping</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={8}>
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
        </Col>

        <Col xs={24} sm={24} md={12} lg={8}>
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
        </Col>

        <Col xs={24} sm={24} md={12} lg={8}>
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
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Mapping;
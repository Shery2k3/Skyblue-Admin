import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomLayout from "../../Components/Layout/Layout";
import axiosInstance from "../../Api/axiosConfig";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  message,
  Spin,
  Tooltip,
  Typography,
  Popconfirm,
} from "antd";
import API_BASE_URL from "../../constants";
import useRetryRequest from "../../Api/useRetryRequest";
import useResponsiveButtonSize from "../../Components/ResponsiveSizes/ResponsiveSize";

const { Option } = Select;
const { Title } = Typography;

const BulkEdit = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: "",
    vendor: "",
    manufacturer: "",
    productName: "",
  });
  const [vendors, setVendors] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [changedProducts, setChangedProducts] = useState({});
  const navigate = useNavigate();
  const retryRequest = useRetryRequest();
  const buttonSize = useResponsiveButtonSize();

  const fetchVendors = useCallback(async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/vendors`)
      );
      setVendors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  }, [retryRequest]);

  const fetchManufacturers = useCallback(async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/manufacturer`)
      );
      setManufacturers(response.data || []);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  }, [retryRequest]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/category/all`)
      );
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  }, [retryRequest]);

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/admin/bulk-products", {
          params: { page, pageSize: pagination.pageSize, ...filters },
        });
        if (response?.data?.success) {
          const { products, totalItems } = response.data.data;
          setProducts(products.map((p) => ({ ...p, key: p.Id })));
          setPagination((prev) => ({
            ...prev,
            current: page,
            total: totalItems,
          }));
        } else {
          message.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.pageSize]
  );

  useEffect(() => {
    fetchProducts();
    fetchVendors();
    fetchCategories();
    fetchManufacturers();
  }, []);

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    fetchProducts(pagination.current);
  };

  const handleFilterChange = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleEditChange = (key, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.key === key ? { ...product, [field]: value } : product
      )
    );
    setChangedProducts((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    if (Object.keys(changedProducts).length === 0) {
      message.warning("No changes to save.");
      return;
    }
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.patch(`${API_BASE_URL}/admin/bulk-products/bulk-edit`, {
          changes: changedProducts,
        })
      );
      if (response?.data?.success) {
        message.success("Products updated successfully.");
        setChangedProducts({});
      } else {
        message.error("Failed to update products.");
      }
      fetchProducts();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating products:", error);
      message.error("An error occurred while updating products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productID) => {
    const productIds = [productID];
    try {
      const response = await retryRequest(() =>
        axiosInstance.delete(`${API_BASE_URL}/admin/bulk-delete-products`, {
          data: { productIds },
        })
      );
      fetchProducts();
      message.success("Product Deleted Successfully");
    } catch (error) {
      message.error("Please Try Again Later!");
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) =>
        editMode ? (
          <Input
            value={record.Name}
            style={{ width: "450px" }}
            onChange={(e) =>
              handleEditChange(record.key, "Name", e.target.value)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Box Qty",
      dataIndex: "BoxQty",
      key: "BoxQty",
      render: (text, record) =>
        editMode ? (
          <Input
            value={record.BoxQty}
            onChange={(e) =>
              handleEditChange(record.key, "BoxQty", e.target.value)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Aisle Location",
      dataIndex: "ItemLocation",
      key: "ItemLocation",
      render: (text, record) =>
        editMode ? (
          <Input
            value={record.ItemLocation}
            onChange={(e) =>
              handleEditChange(record.key, "ItemLocation", e.target.value)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Sku",
      dataIndex: "Sku",
      key: "Sku",
      render: (text, record) =>
        editMode ? (
          <Input
            value={record.Sku}
            onChange={(e) =>
              handleEditChange(record.key, "Sku", e.target.value)
            }
          />
        ) : (
          text || "N/A"
        ),
    },
    {
      title: "Vendor",
      dataIndex: "VendorId",
      key: "VendorId",
      render: (text, record) =>
        editMode ? (
          <Select
            defaultValue={record.VendorName}
            onChange={(value) =>
              handleEditChange(record.key, "VendorId", value)
            }
            style={{ width: 200 }}
            placeholder="Select a vendor"
          >
            {vendors.map((vendor) => (
              <Option key={vendor.Id} value={vendor.Id}>
                <span
                  style={{
                    color: vendor.Name === record.VendorName ? "red" : "black",
                  }}
                >
                  {vendor.Name}
                </span>
              </Option>
            ))}
          </Select>
        ) : (
          record.VendorName || "N/A"
        ),
    },
    {
      title: "Published",
      dataIndex: "Published",
      key: "Published",
      render: (published, record) =>
        editMode ? (
          <Select
            value={published}
            onChange={(value) =>
              handleEditChange(record.key, "Published", value)
            }
          >
            <Option value={true}>True</Option>
            <Option value={false}>False</Option>
          </Select>
        ) : (
          <span style={{ color: published ? "green" : "red" }}>
            {published ? "True" : "False"}
          </span>
        ),
    },
    {
      title: "Actions",
      key: "Actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/edit-product/${record.Id}`)}>
            View
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.Id)} 
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Bulk Edit" menuKey="20">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Bulk Edit
      </Title>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Space
          size={buttonSize}
          align="center"
          style={{ justifyContent: "center" }}
          wrap
        >
          <Input
            placeholder="Search by Product Name"
            value={filters.productName}
            onChange={(e) => handleFilterChange(e.target.value, "productName")}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Select Vendor"
            value={filters.vendor}
            onChange={(value) => handleFilterChange(value, "vendor")}
            style={{ width: 200 }}
          >
            <Option value="">All Vendors</Option>
            {vendors.map((vendor) => (
              <Option key={vendor.Id} value={vendor.Id}>
                {vendor.Name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Manufacturer"
            value={filters.manufacturer}
            onChange={(value) => handleFilterChange(value, "manufacturer")}
            style={{ width: 200 }}
          >
            <Option value="">All Manufacturers</Option>
            {manufacturers.map((manufacturer) => (
              <Option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={() => fetchProducts(1)}>
            Apply Filters
          </Button>
          <Button type="primary" onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </Button>
          {editMode && (
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </Space>
      </div>
      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
      />
    </CustomLayout>
  );
};

export default BulkEdit;

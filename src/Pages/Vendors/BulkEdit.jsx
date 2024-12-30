import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomLayout from "../../Components/Layout/Layout";
import axiosInstance from "../../Api/axiosConfig";
import { Table, Button, Input, Select, Space, message, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from "../../constants";
import useRetryRequest from "../../Api/useRetryRequest";

const { Option } = Select;

const BulkEdit = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [filters, setFilters] = useState({ category: "", vendor: "", manufacturer: "" });
  const [vendors, setVendors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const retryRequest = useRetryRequest();
  const [changedProducts, setChangedProducts] = useState({});

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, pageSize: pagination.pageSize, ...filters };
      const response = await axiosInstance.get("/admin/bulk-products", { params });
      if (response?.data?.success) {
        const { products, totalItems } = response.data.data;
        console.log(response.data.data);
        setProducts(products.map((p) => ({ ...p, key: p.Id })));
        setPagination((prev) => ({ ...prev, current: page, total: totalItems }));
      } else {
        message.error("Failed to fetch products.");
      }
    } catch (error) {
      message.error("An error occurred while fetching products.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize]);

  const fetchVendors = useCallback(async () => {
    try {
      const vendorsResponse = await retryRequest(() => axiosInstance.get(`${API_BASE_URL}/admin/vendors`));
      setVendors(vendorsResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  }, [retryRequest]);

  useEffect(() => {
    fetchProducts();
    fetchVendors();
  }, [fetchProducts, fetchVendors]);

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    fetchProducts(pagination.current);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    console.log("Changes:", changedProducts);
  };

  const handleEditChange = (key, field, value) => {
    setProducts((prev) =>
      prev.map((product) => (product.key === key ? { ...product, [field]: value } : product))
    );

    setChangedProducts((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  };


  const columns = [
    {
      title: "Product Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) =>
        editMode ? (
          <Input value={record.Name} onChange={(e) => handleEditChange(record.key, "Name", e.target.value)} />
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
          <Input value={record.BoxQty} onChange={(e) => handleEditChange(record.key, "BoxQty", e.target.value)} />
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
          <Input value={record.ItemLocation} onChange={(e) => handleEditChange(record.key, "ItemLocation", e.target.value)} />
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
          <Input value={record.Sku} onChange={(e) => handleEditChange(record.key, "Sku", e.target.value)} />
        ) : (
          text || "N/A" // Show N/A if SKU is null
        ),
    },
    {
      title: "Vendor",
      dataIndex: "VendorId",
      key: "VendorId",
      render: (text, record) =>
        editMode ? (
          <Select
            value={record.VendorId}
            onChange={(value) => handleEditChange(record.key, "VendorId", value)}
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
            onChange={(value) => handleEditChange(record.key, "Published", value)}
          >
            <Option value={true}>True</Option>
            <Option value={false}>False</Option>
          </Select>
        ) : (
          <span style={{ color: published ? "green" : "red" }}>{published ? "True" : "False"}</span>
        ),
    },
    
    {
      title: "Actions",
      key: "Actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/edit-product/${record.Id}`)}>View</Button>
          <Button
            danger
            onClick={()=>{console.log(record.Id)}}
          >
            Delete
          </Button>
        
        </Space>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Bulk Edit" menuKey="20">
      <div>
        <h1>Bulk Edit</h1>
        <Space style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </Button>
          {editMode && (
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </Space>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            dataSource={products}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
          />
        )}
      </div>
    </CustomLayout>
  );
};

export default BulkEdit;

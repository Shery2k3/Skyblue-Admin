import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomLayout from "../../../Components/Layout/Layout";
import {
  Typography,
  Table,
  Button,
  Spin,
  message,
  Popconfirm,
  InputNumber,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import FlyerGenerate from "./Sections/FlyerGenerate";

const Flyer = () => {
  const { Title } = Typography;
  const navigate = useNavigate();
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFlyerId, setEditingFlyerId] = useState(null);
  const [newDisplayOrder, setNewDisplayOrder] = useState(null); // Track new DisplayOrder value

  // Get the retryRequest function from the custom hook
  const retryRequest = useRetryRequest();

  // Fetching all flyers
  useEffect(() => {
    const fetchFlyers = async () => {
      setLoading(true); // Set loading before API call
      try {
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/flyers/all-flyers")
        );
        console.log("response", response.data);
        setFlyers(response.data.flyers);
      } catch (error) {
        console.error("Error fetching flyers:", error);
        message.error("Failed to fetch flyers");
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchFlyers();
  }, [retryRequest]); // Add retryRequest as a dependency

  // Handler for viewing product
  const handleView = (productId) => {
    navigate(`/edit-product/${productId}`); // Redirect to product edit page
  };

  // Handler for saving edited display order
  const handleSaveDisplayOrder = async (flyerId) => {
    try {
      await axiosInstance.patch(`/admin/flyers/edit-flyer/${flyerId}`, {
        DisplayOrder: newDisplayOrder, // Update the display order via PATCH
      });
      message.success("Display order updated successfully");
      setFlyers((prevFlyers) =>
        prevFlyers.map((flyer) =>
          flyer.FlyerId === flyerId
            ? { ...flyer, DisplayOrder: newDisplayOrder }
            : flyer
        )
      );
      setEditingFlyerId(null); // Reset editing state
      setNewDisplayOrder(null); // Clear new display order value
    } catch (error) {
      console.error("Error updating display order:", error);
      message.error("Failed to update display order");
    }
  };

  // Handler for cancelling the edit
  const handleCancel = () => {
    setEditingFlyerId(null); // Reset editing state
    setNewDisplayOrder(null); // Clear new display order value
  };

  // Handler for deleting flyer
  const handleDelete = async (flyerId) => {
    try {
      await axiosInstance.delete(`/admin/flyers/delete-flyer/${flyerId}`);
      message.success("Flyer deleted successfully");
      setFlyers((prevFlyers) =>
        prevFlyers.filter((flyer) => flyer.FlyerId !== flyerId)
      );
    } catch (error) {
      message.error("Failed to delete flyer");
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "Product Name",
      dataIndex: "ProductName",
      key: "productName",
    },
    {
      title: "Display Order",
      dataIndex: "DisplayOrder",
      key: "displayOrder",
      align: "center",
      render: (text, record) => {
        if (editingFlyerId === record.FlyerId) {
          return (
            <InputNumber
              defaultValue={record.DisplayOrder}
              onChange={(value) => setNewDisplayOrder(value)}
            />
          );
        }
        return text;
      },
    },
    {
      title: "View",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Button onClick={() => handleView(record.ProductId)}>View</Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          {editingFlyerId === record.FlyerId ? (
            <>
              <Button
                type="link"
                onClick={() => handleSaveDisplayOrder(record.FlyerId)}
              >
                Save
              </Button>
              <Button type="link" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setEditingFlyerId(record.FlyerId)}
            >
              Edit
            </Button>
          )}

          <Popconfirm
            title="Are you sure to delete this item from flyer?"
            onConfirm={() => handleDelete(record.FlyerId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Flyer" menuKey="16">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Flyer
      </Title>

      {/* <FlyerGenerate />

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={flyers}
          rowKey="FlyerId"
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 15 }}
        />
      )}
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <Button type="primary" onClick={() => navigate("/addflyer")}>
          Add New Product to Flyer
        </Button>
      </div> */}
    </CustomLayout>
  );
};

export default Flyer;

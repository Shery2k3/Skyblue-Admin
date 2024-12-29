//@des do testing for this component
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { Modal, Button, Table, Spin, message, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const AppliedToManufacturer = () => {
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [allManufacturers, setAllManufacturers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const retryRequest = useRetryRequest();
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchManufacturer = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/manufacturer`)
      );
      console.log(response.data);
      setManufacturers(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error fetching manufacturer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscountManufacturer = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/get-discount-to-manufacturer/${id}`)
      );
      const { success, result } = response.data;
      if (success && result) {
        setAllManufacturers(
          result.map((product) => ({
            ...product,
            key: product.Product_Id,
          }))
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching discount manufacturer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async (manufacturerIds) => {
    setLoading(true);
    console.log("manufacturerIds:", manufacturerIds, id);

    try {
      const response = await retryRequest(() => {
        return axiosInstance.post(
          // Return the response here
          `/admin/apply-discount-to-manufacturer/${id}`,
          { manufacturerIds }
        );
      });

      console.log("response:", response);
      if (response.data.success) {
        message.success("Discount successfully applied to manufacturer.");
        fetchDiscountManufacturer();
      } else {
        message.error("Failed to apply discount to manufacturer.");
      }
    } catch (error) {
      console.error("Error applying discount to manufacturer:", error);
      message.error("Failed to apply discount to manufacturer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManufacturer = (record) => {
    setLoading(true);

    const manufacturerIds = [record.Manufacturer_Id]; // Create an array with the Manufacturer_Id

    try {
      const response = retryRequest(() =>
        axiosInstance.delete(`/admin/remove-discount-to-manufacturer/${id}`, {
          data: { manufacturerIds }, // Pass manufacturerIds in the body
        })
      );
      fetchDiscountManufacturer();
      console.log("Discount removed:", response); // Optional: Check the response
    } catch (error) {
      console.error("Error viewing product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewManufacturer = (record) => {
    navigate(`/manufacturers`);
  };


  useEffect(() => {
    fetchDiscountManufacturer();
  }, [id]);

 

  //For Modal
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleApplyDiscount(record.id)}>
          Apply Discount
        </Button>
      ),
    },
  ];

  //For Table Display
  const displayColumns = [
    {
      title: "Manufacturer Name",
      dataIndex: "Name",
      key: "Name",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewManufacturer(record)}>
            View
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteManufacturer(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={fetchManufacturer}
        loading={loading}
        style={{ marginBottom: 20 }}
      >
        Load Manufacturers
      </Button>

      {loading && <Spin />}

      <Modal
        title="Manufacturers"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={manufacturers}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Table
        columns={displayColumns}
        dataSource={allManufacturers}
        rowKey="id"
        pagination={false}
      ></Table>
    </>
  );
};

export default AppliedToManufacturer;

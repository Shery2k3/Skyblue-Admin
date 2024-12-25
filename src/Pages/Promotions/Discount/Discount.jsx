import CustomLayout from "../../../Components/Layout/Layout";
import { Table, Button, Modal, message, Input, InputNumber, Spin, Typography, Select, DatePicker } from "antd";
import useResponsiveButtonSize from "../../../Components/ResponsiveSizes/ResponsiveSize";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook
import dayjs from "dayjs";
import EditDiscount from "./EditDiscount";
import {useNavigate } from "react-router-dom";

const Discounts = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setAddModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const [type, setType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  const retryRequest = useRetryRequest(); // Use the retry logic hook
  const { Title } = Typography;
  const buttonSize = useResponsiveButtonSize();

  const discountTypes = {
    1: "Assigned to order total",
    2: "Assigned to products",
    5: "Assigned to categories",
    3: "Assigned to manufacturers",
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/alldiscounts`)
        );
        const data = response.data.map((discount) => ({
          key: discount.Id,
          id: discount.Id,
          name: discount.Name,
          type: discountTypes[discount.DiscountTypeId] || "Unknown",
          discount: "$" + discount.DiscountAmount,
          startDate: discount.StartDate ? dayjs(discount.StartDate) : null,
          endDate: discount.EndDate ? dayjs(discount.EndDate) : null,
        }));
        setDataSource(data);
        setFilteredData(data); // Set initial filtered data
      } catch (error) {
        console.error("Error fetching discount data:", error);
        message.error("Failed to fetch discount data");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [retryRequest]);

  const addDiscount = async () => {
    if(!name || !amount || amount <= 0 || !type) {
      message.error("Please provide valid details");
      return;
    }

     try {
       const payload = {
         Name: name,
         DiscountAmount: amount,
         DiscountTypeId: type,
         StartDate: startDate ? startDate.format("YYYY-MM-DD") : null,
         EndDate: endDate ? endDate.format("YYYY-MM-DD") : null,
       };
       await retryRequest(() =>
         axiosInstance.post(`/admin/post-discounts`, payload)
       );
       message.success("Discount added successfully");
       fetchDiscounts();
       setAddModal(false);
     } catch (error) {
       console.error("Error adding discount: ", error);
       message.error("Failed to add discount");
     }
  };

  const handleAdd = () => {
    setName("");
    setAmount("");
    setAddModal(true);
  };

  const handleEdit = (discount) => {
    navigate(`/edit-discounts/${discount.id}`);
    // console.log(discount);
    // setSelectedDiscount(discount);
    // setName(discount.name);
    // setAmount(parseFloat(discount.discount.replace("$", "")));
    // setIsModalVisible(true);
  };

  const handleDelete = async (discount) => {
    try {
      await retryRequest(() =>
        axiosInstance.delete(`/admin/delete-discount/${discount.id}`)
      );
      message.success("Discount deleted successfully");
      fetchDiscounts();
    } catch (error) {
      console.error("Error deleting discount: ", error);
      message.error("Failed to delete discount");
    }
  };

  const handleOk = async () => {
    if (!name || !amount || amount <= 0) {
      message.error("Please provide valid details");
      return;
    }

    const payload = {};
    if (name !== selectedDiscount.name) {
      payload.Name = name;
    }
    const parsedAmount = parseFloat(selectedDiscount.discount.replace("$", ""));
    if (parseFloat(amount) !== parsedAmount) {
      payload.DiscountAmount = amount;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await retryRequest(() =>
          axiosInstance.patch(
            `/admin/editdiscount/${selectedDiscount.id}`,
            payload
          )
        );
        message.success("Discount updated successfully");
        fetchDiscounts();
      } catch (error) {
        console.error("Error updating discount:", error);
        message.error("Failed to update discount");
      }
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAddModal(false);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    if (value === "all") {
      setFilteredData(dataSource);
    } else {
      setFilteredData(dataSource.filter((discount) => discount.type === discountTypes[value]));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Discount Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Discounts" menuKey="14">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Discounts
      </Title>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
        <div style={{ marginBottom: 20 }}>
            <Select
              value={filterType}
              onChange={handleFilterChange}
              style={{ width: 200 }}
            >
              <Option value="all">All Discounts</Option>
              <Option value="1">Assigned to order total</Option>
              <Option value="2">Assigned to products</Option>
              <Option value="5">Assigned to categories</Option>
              <Option value="3">Assigned to manufacturers</Option>
            </Select>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button type="primary" size={buttonSize} onClick={handleAdd}>
              Add New Discount
            </Button>
          </div>
          <br />
          <Table
             dataSource={filteredData}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </>
      )}

      {/* Edit existing discount */}
      

      {/* Add new discount */}
      <Modal
        centered
        title="Add New Discount"
        open={isAddModalVisible}
        onOk={addDiscount}
        onCancel={handleCancel}
      >
        <br />
        <Input
          placeholder="Discount Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Select
          placeholder="Select Discount Type"
          value={type}
          onChange={(value) => setType(value)}
          style={{ marginBottom: 10, width: "100%" }}
        >
          {Object.entries(discountTypes).map(([id, label]) => (
            <Option key={id} value={id}>
              {label}
            </Option>
          ))}
        </Select>
        <InputNumber
          value={amount}
          placeholder="Discount Amount"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          onChange={(value) => setAmount(value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <DatePicker
          placeholder="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <DatePicker
          placeholder="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Discounts;

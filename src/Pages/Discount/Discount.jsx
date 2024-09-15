import CustomLayout from "../../Components/Layout/Layout";
import {
  Table,
  Button,
  Modal,
  message,
  Input,
  InputNumber,
  Spin
} from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const Discounts = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setAddModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const response = await retryRequest(() => axiosInstance.get(`/admin/alldiscounts`));
        const data = response.data.map((discount) => ({
          key: discount.Id,
          id: discount.Id,
          name: discount.Name,
          type: discount.DiscountTypeId,
          discount: "$" + discount.DiscountAmount,
        }));
        setDataSource(data);
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
    if (!name || !amount || amount <= 0) {
      message.error("Please provide valid details");
      return;
    }    

    try {
      const payload = {
        Name: name,
        DiscountAmount: amount,
      };
      await retryRequest(() => axiosInstance.post(`/admin/post-discounts`, payload));
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
    setSelectedDiscount(discount);
    setName(discount.name);
    setAmount(parseFloat(discount.discount.replace("$", "")));
    setIsModalVisible(true);
  };

  const handleDelete = async (discount) => {
    try {
      await retryRequest(() => axiosInstance.delete(`/admin/delete-discount/${discount.id}`));
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
        await retryRequest(() => axiosInstance.patch(
          `/admin/editdiscount/${selectedDiscount.id}`,
          payload
        ));
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
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
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
    <CustomLayout pageTitle="Discounts" menuKey="9">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ textAlign: "right" }}>
            <Button type="primary" size="medium" onClick={handleAdd}>
              Add New Discount
            </Button>
          </div>
          <br />
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </>
      )}

      {/* Edit existing discount */}
      <Modal
        centered
        title="Edit Discount Details"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <br />
        <Input
          placeholder="Discount Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <InputNumber
          value={amount}
          placeholder="Discount Amount"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          onChange={(value) => setAmount(value)} // Directly use the value
          style={{ width: '100%' }}
        />
      </Modal>

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
        />
        <br />
        <br />
        <InputNumber
          value={amount}
          placeholder="Discount Amount"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          onChange={(value) => setAmount(value)} // Directly use the value
          style={{ width: '100%' }}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Discounts;

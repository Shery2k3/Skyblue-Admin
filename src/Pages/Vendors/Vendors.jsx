import CustomLayout from "../../Components/Layout/Layout";
import {
  Table,
  Button,
  Modal,
  Checkbox,
  Select,
  message,
  Input,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../constants.js";

const { Option } = Select;

const Vendors = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/vendors`);
      const data = response.data.data.map((vendor) => ({
        key: vendor.Id,
        id: vendor.Id,
        name: vendor.Name,
        email: vendor.Email,
        active: vendor.Active,
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleEdit = (vendor) => {
    console.log(vendor);
    setSelectedVendor(vendor);
    setName(vendor.name);
    setIsActive(vendor.active);
    setEmail(vendor.email);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const payload = {};
    if (isActive !== selectedVendor.active) {
      payload.active = isActive;
    }
    if (name !== selectedVendor.name) {
      payload.name = name;
    }
    if (email !== selectedVendor.email) {
      payload.email = email;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await axios.patch(
          `${API_BASE_URL}/admin/editvendor/${selectedVendor.id}`,
          payload
        );
        message.success("Vendor updated successfully");
        fetchVendors();
      } catch (error) {
        console.error("Error updating Vendor:", error);
        message.error("Failed to update Vendor");
      }
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (active) =>
        active ? <Tag color='green'>{"ACTIVE"}</Tag> : <Tag color='volcano'>{"INACTIVE"}</Tag> ,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Vendors" menuKey="4">
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Edit Vendor"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        >
          Active
        </Checkbox>
        <br />
        <br />
        <Input
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <Input
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </CustomLayout>
  );
};

export default Vendors;

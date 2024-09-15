import React, { useState, useEffect } from "react";
import {
  Table,
  Image,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import API_BASE_URL from "../../constants.js";
import axiosInstance from "../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const BannerTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form] = Form.useForm();

  const retryRequest = useRetryRequest();

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/slider/banner`)
      );

      const data = response.data.map((item) => ({
        key: item.sliderId.toString(),
        id: item.sliderId,
        title: `Banner ${item.sliderId}`, // Adjust if needed
        imageUrl: item.image,
        link: item.link || "N/A", // Add the link field with a default value
      }));
      setDataSource(data);
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (key) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/admin/slider/${key}`);
      setDataSource(dataSource.filter((item) => item.key !== key));
      message.success("Banner deleted successfully");
    } catch (error) {
      message.error("Failed to delete banner");
    }
  };

  const handleUpdate = (record) => {
    setEditingBanner(record);
    form.setFieldsValue({
      displayOrder: 0,
      link: record.link,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      await axiosInstance.patch(
        `${API_BASE_URL}/admin/slider/${editingBanner.id}`,
        values
      );
      message.success("Banner updated successfully");
      setIsModalVisible(false);

      // Reload data to reflect changes in the table
      fetchData();
    } catch (error) {
      message.error("Failed to update banner");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Banner Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => <Image width={100} src={text} alt="banner" />,
      width: 150,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Are you sure to delete this banner?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="default"
            onClick={() => handleUpdate(record)}
            style={{}}
          >
            Update
          </Button>
        </>
      ),
      width: 180,
    },
  ];

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Update Banner"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Display Order"
            name="displayOrder"
            rules={[
              { required: true, message: "Please enter the display order" },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Link"
            name="link"
            rules={[{ required: true, message: "Please enter the link" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BannerTable;

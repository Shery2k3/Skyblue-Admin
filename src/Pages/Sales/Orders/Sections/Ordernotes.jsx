import { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Divider,
  Pagination,
  message,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../Api/axiosConfig";
import CustomLayout from "../../../../Components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const OrderNotes = () => {
  const { id } = useParams(); // Get orderId from URL params
  const navigate = useNavigate(); // Initialize navigate

  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of items per page

  // Fetch order notes
  const fetchOrderNotes = async () => {
    setLoading(true); // Set loading to true when fetching notes
    try {
      const response = await axiosInstance.get(`/admin/orders/notes/${id}`);
      if (response.data.success) {
        const notes = response.data.data.map((note) => ({
          key: note.Id,
          orderId: note.OrderId,
          note: note.Note,
          createdOn: new Date(note.CreatedOnUtc).toLocaleString(),
          id: note.Id,
        }));
        setDataSource(notes);
      } else {
        message.error("Failed to fetch order notes. Please try again.");
      }
    } catch (error) {
      console.log("An error occurred while fetching order notes.", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchOrderNotes();
  }, [id]); // Fetch notes when orderId changes

  const handleAddNote = async (values) => {
    try {
      const response = await axiosInstance.post(`/admin/orders/${id}/notes`, {
        note: values.Note,
      });

      if (response?.data.success) {
        message.success("Order note added successfully");
        form.resetFields();
        setIsModalVisible(false);
        fetchOrderNotes(); // Refresh the notes after adding a note
      }
    } catch (error) {
      message.error("Failed to add order note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/orders/notes-delete/${id}`
      );

      if (response?.data.success) {
        message.success("Order note deleted successfully");
        fetchOrderNotes(); // Refresh the notes after deleting a note
      }
    } catch (error) {
      message.error("Failed to delete order note.");
    }
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = dataSource.slice(startIndex, startIndex + pageSize);
  const totalItems = dataSource.length;

  return (
    <CustomLayout pageTitle="Order Details" menuKey="7">
      <div style={{ padding: "20px" }}>
        <Divider level={2} style={{ marginBottom: "20px" }}>
          Order Notes for Order #{id}
        </Divider>

        {/* Go Back Button */}
        <Button
          type="default"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: "20px" }}
        >
          Go Back
        </Button>

        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Note
          </Button>
        </div>

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
            <Table
              dataSource={paginatedData}
              columns={[
                {
                  title: "Order ID",
                  dataIndex: "orderId",
                  key: "orderId",
                  align: "center",
                },
                {
                  title: "Note",
                  dataIndex: "note",
                  key: "note",
                  align: "left",
                },
                {
                  title: "Created On",
                  dataIndex: "createdOn",
                  key: "createdOn",
                  align: "center",
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </Button>
                  ),
                },
              ]}
              pagination={false}
              scroll={{ x: "max-content" }}
              bordered
              locale={{
                emptyText: (
                  <span style={{ color: "gray" }}>
                    No order notes available
                  </span>
                ),
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "20px",
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handleChangePage}
                style={{ marginTop: "20px", textAlign: "center" }}
              />
            </div>
          </>
        )}

        <Modal
          title="Add Order Note"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddNote}>
            <Form.Item
              name="Note"
              label="Note"
              rules={[{ required: true, message: "Please input your note!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </CustomLayout>
  );
};

export default OrderNotes;

import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Table, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomLayout from "../../Components/Layout/Layout";

const Notification = () => {
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch existing notices
        axios.get("http://localhost:3000/admin/slider/notice")
            .then((response) => {
                setTableData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                message.error("Failed to fetch notices.");
                setLoading(false);
            });
    }, []);

    const onFinish = (values) => {
        const newData = {
            key: tableData.length + 1,
            image: values.image.file.originFileObj, // Handle the image file accordingly
        };


        // Simulate a POST request
        axios.post("/api/upload-notice", newData)
            .then((response) => {
                message.success("Notice uploaded successfully!");
                form.resetFields();
                setTableData([...tableData, newData]); // Add new notice to the table
                setIsModalVisible(false); // Close modal after success
            })
            .catch((error) => {
                message.error("Failed to upload notice.");
            });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [

        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text) => (
                <div className="image-container">
                    <img src={text} alt="Notice" className="notice-image" />
                </div>
            ),
        },
    ];

    return (
        <CustomLayout pageTitle="Notices" menuKey="11">
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
                Notice Board
            </Title>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{ marginBottom: 20 }}
            >
                Upload New Notice
            </Button>

            <Table
                columns={columns}
                dataSource={tableData}
                loading={loading}
                pagination={false}
                style={{ marginBottom: 40 }}
            />

            <Modal
                title="Upload Notice Image"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{
                        maxWidth: 600,
                        margin: "0 auto",
                        padding: 20,
                        background: "#fff",
                        borderRadius: 8,
                    }}
                >
                    <Form.Item
                        label="Notice Title"
                        name="title"
                        rules={[{ required: true, message: "Please input the notice title!" }]}
                    >
                        <Input placeholder="Enter notice title" />
                    </Form.Item>

                    <Form.Item
                        label="Notice Image"
                        name="image"
                        rules={[{ required: true, message: "Please upload a notice image!" }]}
                    >
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false} // Prevent automatic upload
                            maxCount={1}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                .notice-image {
                    width: 50px;
                    height: 50px;
                    transition: transform 0.3s ease;
                }

                .image-container:hover .notice-image {
                    transform: scale(2);
                }
            `}</style>
        </CustomLayout>
    );
};

export default Notification;

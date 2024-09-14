import React, { useState, useEffect } from 'react';
import { Form, Upload, Button, message, Typography, Modal, Table, Popconfirm, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomLayout from '../../Components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Notification = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noticeExists, setNoticeExists] = useState(false); // Track if a notice exists

    const navigate = useNavigate();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/slider/notice');
            const data = response.data.map(item => ({
                key: item.sliderId.toString(),
                id: item.sliderId,
                imageUrl: item.image,
            }));
            setTableData(data);
            setLoading(false);

            // Check if there's already a notice in the system
            if (data.length > 0) {
                setNoticeExists(true);  // Set noticeExists to true if a notice is present
            } else {
                setNoticeExists(false); // Set noticeExists to false if no notice is present
            }
        } catch (error) {
            message.error('Failed to fetch notices.');
            setLoading(false);
        }
    };

    const onFinish = (values) => {
        if (noticeExists) {
            message.error('Only one notice is allowed. Please delete the existing notice before uploading a new one.');
            return;
        }

        const formData = new FormData();
        const file = values.image && values.image[0]; // Get the first file from the fileList

        if (file && file.originFileObj) {
            formData.append('image', file.originFileObj);
            formData.append('type', 'notice');
            formData.append('displayOrder', 1); // Example value for displayOrder

            axios.post('http://localhost:3000/admin/slider/add', formData)
                .then(response => {
                    message.success('Notice uploaded successfully!');
                    form.resetFields();
                    fetchNotices(); // Refresh the table data
                    setIsModalVisible(false); // Close modal after success
                })
                .catch(error => {
                    message.error('Failed to upload notice');
                });
        } else {
            message.error('Please upload a valid image.');
        }
    };

    const handleDelete = async (key) => {
        try {
            await axios.delete(`http://localhost:3000/admin/slider/${key}`);
            setTableData(tableData.filter(item => item.key !== key));
            message.success('Notice deleted successfully');
            setNoticeExists(false); // Allow new notice upload after deletion
        } catch (error) {
            message.error('Failed to delete notice.');
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                        width={500} // 5x larger (assuming original size was 100)
                        height={500}
                        src={text}
                        alt="Notice"
                        style={{ marginBottom: '10px' }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this notice?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <CustomLayout pageTitle="Notices" menuKey="12">
            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
                Notice Board
            </Title>

            <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={showModal}
                style={{ marginBottom: 20 }}
                disabled={noticeExists} // Disable button if a notice already exists
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
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Upload Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            beforeUpload={() => false} // Prevent automatic upload
                        >
                            <Button icon={<UploadOutlined />} size="large" block>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" size="large" block>Submit</Button>
                </Form>
            </Modal>
        </CustomLayout>
    );
};

export default Notification;

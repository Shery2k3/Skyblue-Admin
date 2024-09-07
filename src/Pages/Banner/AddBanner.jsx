import React from 'react';
import { Form, Input, Upload, Button, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomLayout from '../../Components/Layout/Layout';

const { Title } = Typography;

const AddBanner = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState([]);

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);

        // Append files to the form data
        if (fileList.length > 0) {
            formData.append('image', fileList[0].originFileObj);
        }

        try {
            // Replace 'your-backend-url' with your actual backend endpoint
            await axios.post('your-backend-url/add-banner', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Banner added successfully');
            navigate('/banners'); // Redirect to the banner list page
        } catch (error) {
            console.error('There was an error uploading the banner!', error);
            message.error('Failed to add banner');
        }
    };

    const handleUploadChange = ({ fileList }) => {
        // Update fileList to contain only the first selected file
        setFileList(fileList.slice(-1));
    };

    return (
        <CustomLayout pageTitle="Add Banner" menuKey="12">
            <div style={{ padding: '20px' }}>
                <Title level={2}>Add New Banner</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{ maxWidth: '600px', margin: '0 auto' }}
                >
                    <Form.Item
                        name="title"
                        label="Banner Title"
                        rules={[{ required: true, message: 'Please enter the banner title!' }]}
                    >
                        <Input placeholder="Enter banner title" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Upload Banner Image"
                        rules={[{ required: true, message: 'Please upload a banner image!' }]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1} // Restrict to one file
                        >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Banner
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </CustomLayout>
    );
};

export default AddBanner;

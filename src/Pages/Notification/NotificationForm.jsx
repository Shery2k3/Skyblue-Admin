import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axios from "axios";
import CustomLayout from "../../Components/Layout/Layout";
import ReactQuill from "react-quill"; // Rich Text Editor
import "react-quill/dist/quill.snow.css"; // Quill styles
import EmojiPicker from "emoji-picker-react"; // Emoji Picker

const Notification = () => {
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [content, setContent] = useState(""); // For rich text editor content
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onFinish = (values) => {
        const notificationData = {
            ...values,
            message: content, // Include the rich text content
        };

        axios
            .post("/api/send-notification", notificationData)
            .then((response) => {
                message.success("Notification sent successfully!");
                form.resetFields();
                setContent(""); // Reset the rich text editor
            })
            .catch((error) => {
                message.error("Failed to send notification.");
            });
    };

    const handleEmojiClick = (emojiObject) => {
        setContent((prevContent) => prevContent + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <CustomLayout pageTitle="notification" menuKey="11">
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
                Send Notification
            </Title>

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
                    label="Notification Title"
                    name="title"
                    rules={[{ required: true, message: "Please input the notification title!" }]}
                >
                    <Input placeholder="Enter notification title" />
                </Form.Item>

                <Form.Item label="Notification Message">
                    {/* Rich Text Editor */}
                    <ReactQuill value={content} onChange={setContent} placeholder="Enter notification message" />
                    <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                        <Button type="link" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            Add Emoji
                        </Button>
                        {showEmojiPicker && (
                            <div style={{ marginLeft: 10 }}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Send Notification
                    </Button>
                </Form.Item>
            </Form>
        </CustomLayout>
    );
};

export default Notification;

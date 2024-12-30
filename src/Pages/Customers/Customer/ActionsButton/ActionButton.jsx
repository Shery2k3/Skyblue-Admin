import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../../constants';
import axiosInstance from '../../../../Api/axiosConfig';

const ActionButtons = ({ customerId }) => {
  const navigate = useNavigate();

  const handleSendEmail = () => {
    // Implement send email functionality here
    message.success('Email sent successfully!');
    console.log(customerId)
  };

  const handleSendPrivateMessage = () => {
    // Implement send private message functionality here
    message.success('Private message sent!');
    console.log(customerId)
  };

  const handleDeleteCustomer = async () => {
    try {
      console.log(customerId)
    } catch (error) {
      message.error('Failed to delete customer');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div>
      <Button type="default" onClick={handleGoBack}>Go Back</Button>
      <Button type="primary" style={{ marginLeft: 10 }} onClick={handleSendEmail}>Send Email</Button>
      <Button type="default" style={{ marginLeft: 10 }} onClick={handleSendPrivateMessage}>Send Private Message</Button>
      <Button type="danger" style={{ marginLeft: 10 }} onClick={handleDeleteCustomer}>Delete</Button>
    </div>
  );
};

export default ActionButtons;

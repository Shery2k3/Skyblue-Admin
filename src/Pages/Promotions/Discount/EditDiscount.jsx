import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import {
  message,
  Typography,
  Form,
  Row,
  Col,
  Button,
  Divider,
  Tabs,
} from "antd";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Api/axiosConfig";
import dayjs from "dayjs";
import DiscountInfo from "./editSections/DiscountInfo";

const { Title } = Typography;
const { TabPane } = Tabs;

const EditDiscount = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    getDiscount();
  }, []);

  const getDiscount = async () => {
    try {
      const response = await axiosInstance.get(`/admin/edit-discount/${id}`);
      const discount = response.data;
      form.setFieldsValue({
        ...discount,
        startDate: dayjs(discount.startDate),
        endDate: dayjs(discount.endDate),
      });
    } catch (error) {
      console.error("Error fetching discount data:", error);
      message.error("Failed to fetch discount data");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      console.log("Form Submitted:", values);
      message.success("Discount updated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to update discount");
    }
  };

  return (
    <CustomLayout pageTitle="Edit Discount" menuKey="14">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Edit Discount
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Tabs defaultActiveKey="1" centered>
          {/* Tab 1: Discount Info */}
          <TabPane tab="Discount Info" key="1">
            <DiscountInfo />
          </TabPane>
           {/* Tab 2: Applied to Category */}
           <TabPane tab="Applied to Category" key="2">
            <section>
              Requirement
            </section>
          </TabPane>

          {/* Tab 2: Applied to Category */}
          <TabPane tab="Applied to Category" key="3">
            <section>
              Apply to catgeory
            </section>
          </TabPane>

          {/* Tab 3: Usage */}
          <TabPane tab="Usage" key="4">
            <section>
              usage
            </section>
          </TabPane>
        </Tabs>

        <Divider />
        <Row justify="end">
          <Col>
            <Button type="primary" htmlType="submit">
              Update Discount
            </Button>
          </Col>
        </Row>
      </Form>
    </CustomLayout>
  );
};

export default EditDiscount;

//@des when leadoing a page edit text is displayng on middle first and then right
//@des improve the ui example add "$" sign wehn on edit or when pecentage selcted add "%" sign etc


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Space, Tabs, message, Spin, Row, Col } from "antd";
import CustomLayout from "../../../Components/Layout/Layout";
import DiscountInfo from "./editSections/DiscountInfo";
import AppliedToProduct from "./editSections/AppliedToProduct";
import AppliedToCategory from "./editSections/AppliedToCategory";
import useRetryRequest from "../../../Api/useRetryRequest";
import axiosInstance from "../../../Api/axiosConfig";
import Requirements from "./editSections/Requirements";
import UsageHistory from "./editSections/UsageHistory";
import AppliedToManufacturer from "./editSections/AppliedToManufacturer";

const { Title } = Typography;
const { TabPane } = Tabs;

const EditDiscount = () => {
  const { id } = useParams(); // Get discount ID from URL params
  const retryRequest = useRetryRequest(); // Custom retry logic for API calls
  const [datasource, setDatasource] = useState(null); // Store discount data
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch discount details
  const getDiscount = async () => {
    try {
      setLoading(true);
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/edit-discount/${id}`)
      );
      console.log(response);
      const discount = response.data[0]; // Adjust based on API structure
      
      setDatasource(discount);
    } catch (error) {
      console.error("Error fetching discount data:", error);
      message.error("Failed to fetch discount data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDiscount();
  }, [id]);

  // Conditional rendering for loading state
  if (loading) {
    return (
      <CustomLayout pageTitle="Edit Discount" menuKey="14">
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Edit Discount
        </Title>
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout pageTitle="Edit Discount" menuKey="14">
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={2}>Edit Discount</Title>
        </Col>
        <Col>
          <Button type="default" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" type="card" size="large">
        {/* Discount Info Tab */}
        <TabPane tab="Discount Info" key="1">
          <DiscountInfo />
        </TabPane>

        {/* Requirements Tab */}
        <TabPane tab="Requirements" key="2">
          <Requirements />
        </TabPane>

        {/* Applied Tab */}
        <TabPane tab="Applied" key="3">
          {datasource?.DiscountTypeId === 2 ? (
            <AppliedToProduct />
          ) : datasource?.DiscountTypeId === 5 ? (
            <AppliedToCategory />
          ) : datasource?.DiscountTypeId === 3 ? (
            <AppliedToManufacturer/>
          ): (
            <div>No specific application type</div>
          )}
        </TabPane>

        {/* Usage History Tab */}
        <TabPane tab="Usage History" key="4">
          <UsageHistory />
        </TabPane>
      </Tabs>
    </CustomLayout>
  );
};

export default EditDiscount;

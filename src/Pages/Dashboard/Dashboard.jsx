import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosConfig";
import useRetryRequest from "../../Api/useRetryRequest";
import { Content, Header } from "antd/es/layout/layout";
import { Breadcrumb, Card, Col, Row } from "antd";
import CustomLayout from "../../Components/Layout/Layout";
import DashBoardStats from "./DashBoardStats";
import OrderCharts from "./Orders/OrdersCharts";
import Chart from "./Orders/Chart";
import NewCustomers from "./Customers/NewCustomers";
import ActiveCustomer from "./Customers/ActiveCustomer";
import BestSellerByAmount from "./BestSeller/BestSellerByAmount";
import BestSellerByQuantity from "./BestSeller/BestSellerByQuantity";
import Loader from "../../Components/Loader/Loader";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    registeredCustomers: 0,
    totalOrders: 0,
    newOrders: 0,
  });

  const [orderStats, setOrderStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    allTime: 0,
  });

  const [orderTotalData, setOrderTotalData] = useState([
    { name: "Today", value: 0 },
    { name: "Week", value: 0 },
    { name: "Month", value: 0 },
    { name: "Year", value: 0 },
  ]);

  const [newCustomers, setNewCustomers] = useState([
    { name: "Today", uv: 0 },
    { name: "Month", uv: 0 },
    { name: "3 Months", uv: 0 },
    { name: "6 months", uv: 0 },
    { name: "Year", uv: 0 },
  ]);

  const [bestSellerByQuantity, setBestSellerByQuantity] = useState([]);
  const [activeCustomers, setActiveCustomers] = useState([]);
  const [bestSellerByAmount, setBestSellerByAmount] = useState([]);

  const retryRequest = useRetryRequest();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          dashboardStatsResponse,
          orderStatsResponse,
          orderValueResponse,
          activeCustomersResponse,
          newCustomersResponse,
          bestSellersResponse,
          bestSellersByAmountResponse,
        ] = await Promise.all([
          retryRequest(() => axiosInstance.get("/admin/stats")),
          retryRequest(() => axiosInstance.get("/admin/orderStats")),
          retryRequest(() => axiosInstance.get("/admin/orderValue")),
          retryRequest(() => axiosInstance.get("/admin/activeCustomers")),
          retryRequest(() => axiosInstance.get("/admin/newCustomers")),
          retryRequest(() => axiosInstance.get("/admin/bestSellerByQuantity")),
          retryRequest(() => axiosInstance.get("/admin/bestSellerByAmount")),
        ]);

        // Process and set the data
        setDashboardStats(dashboardStatsResponse.data);
        setOrderStats(orderStatsResponse.data.data);

        const orderValueData = orderValueResponse.data.values;
        setOrderTotalData([
          { name: "Today", value: orderValueData.today },
          { name: "Week", value: orderValueData.thisWeek },
          { name: "Month", value: orderValueData.thisMonth },
          { name: "Year", value: orderValueData.thisYear },
        ]);

        setActiveCustomers(activeCustomersResponse.data);

        const newCustomerData = newCustomersResponse.data;
        setNewCustomers([
          { name: "Today", uv: newCustomerData.today },
          { name: "Month", uv: newCustomerData.thisMonth },
          { name: "3 Months", uv: newCustomerData.lastThreeMonths },
          { name: "6 months", uv: newCustomerData.lastSixMonths },
          { name: "Year", uv: newCustomerData.thisYear },
        ]);

        setBestSellerByQuantity(bestSellersResponse.data);
        setBestSellerByAmount(bestSellersByAmountResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [retryRequest]);

  return (
    <>
      <Loader isActive={isLoading} />
      <CustomLayout pageTitle="Dashboard" menuKey="1">
        <Header style={{ background: "#87CEEB", padding: 0 }}>
          <div
            className="logo"
            style={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
          >
            Welcome Admin
          </div>
        </Header>
        <Content>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          {/* Dashboard stats */}
          <DashBoardStats data={dashboardStats} />

          {/* Orders stats */}
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} md={12}>
              <Chart orderTotalData={orderTotalData} />
            </Col>
            <Col xs={24} md={12}>
              <NewCustomers data={newCustomers} />
            </Col>
          </Row>

          {/* Customer stats */}
          <div style={{ padding: "5px", marginTop: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Customer Statistics
            </h2>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Customers Activity" bordered={false}>
                  <ActiveCustomer customers={activeCustomers} />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <OrderCharts charts={orderStats} />
              </Col>
            </Row>
          </div>

          {/* Seller by quantity and amount */}
          <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Product Statistics
            </h2>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <BestSellerByQuantity data={bestSellerByQuantity} />
              </Col>
              <Col xs={24} sm={12}>
                <BestSellerByAmount data={bestSellerByAmount} />
              </Col>
            </Row>
          </div>
        </Content>
      </CustomLayout>
    </>
  );
};

export default Dashboard;

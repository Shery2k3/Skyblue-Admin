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
import LatestOrders from "./Customers/LatestOrders";
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

  const [monthlyOrder, setMonthlyOrder] = useState([]);

  const [newCustomers, setNewCustomers] = useState([
    { name: "Today", uv: 0 },
    { name: "Month", uv: 0 },
    { name: "3 Months", uv: 0 },
    { name: "6 months", uv: 0 },
    { name: "Year", uv: 0 },
  ]);

  const [orders, setOrders] = useState([]);
  const [bestSellerByQuantity, setBestSellerByQuantity] = useState([]);
  const [bestSellerByAmount, setBestSellerByAmount] = useState([]);

  const retryRequest = useRetryRequest();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          dashboardStatsResponse,
          orderStatsResponse,
          monthlyOrderResponse,
          newCustomersResponse,
          ordersResponse,
          bestSellersResponse,
          bestSellersByAmountResponse,
        ] = await Promise.all([
          retryRequest(() => axiosInstance.get("/admin/stats")),
          retryRequest(() => axiosInstance.get("/admin/orderStats")),
          retryRequest(() => axiosInstance.get("/admin/monthly-orders")),
          retryRequest(() => axiosInstance.get("/admin/newCustomers")),
          retryRequest(() => axiosInstance.get(`/admin/all-orders?size=20`)),
          retryRequest(() => axiosInstance.get("/admin/bestSellerByQuantity")),
          retryRequest(() => axiosInstance.get("/admin/bestSellerByAmount")),
        ]);

        // Process and set the data
        setDashboardStats(dashboardStatsResponse.data);
        setOrderStats(orderStatsResponse.data.data);

        const monthlyOrderData = monthlyOrderResponse.data
          .map((item) => ({
            month: item.month, // or however the month is represented in your API response
            orders: item.orders, // or however the orders count is represented
          }))
          .reverse(); // Reverse the array

        setMonthlyOrder(monthlyOrderData);

        const newCustomerData = newCustomersResponse.data;
        setNewCustomers([
          { name: "Today", uv: newCustomerData.today },
          { name: "Month", uv: newCustomerData.thisMonth },
          { name: "3 Months", uv: newCustomerData.lastThreeMonths },
          { name: "6 months", uv: newCustomerData.lastSixMonths },
          { name: "Year", uv: newCustomerData.thisYear },
        ]);

        const data = ordersResponse.data.data.map((order) => ({
          key: order.Id,
          id: order.Id,
          orderNo: order.Id,
          customer: order.CustomerEmail,
          createdOn: new Date(order.CreatedonUtc).toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }),
          orderTotal: "$" + order.OrderTotal.toFixed(2),
        }));
        setOrders(data);

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
            style={{ color: "black", fontSize: "20px", marginLeft: "20px" }}
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
              <Chart orderTotalData={monthlyOrder} />
            </Col>
            <Col xs={24} md={12}>
              <NewCustomers data={newCustomers} />
            </Col>
          </Row>

          <OrderCharts charts={orderStats} />

          <Card
            title="Latest Order"
            bordered={true}
            style={{ marginTop: "20px" }}
          >
            <LatestOrders orders={orders} />
          </Card>

          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12}>
              <BestSellerByQuantity data={bestSellerByQuantity} />
            </Col>
            <Col xs={24} sm={12}>
              <BestSellerByAmount data={bestSellerByAmount} />
            </Col>
          </Row>
        </Content>
      </CustomLayout>
    </>
  );
};

export default Dashboard;

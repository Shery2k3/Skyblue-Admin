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

  const [orderChart, setMonthlyOrder] = useState([]);
  const [orderChartState, setOrderChartState] = useState("year");

  const [newCustomers, setNewCustomers] = useState([]);
  const [newCustomersState, setNewCustomersState] = useState("year");

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
          ordersResponse,
          bestSellersResponse,
          bestSellersByAmountResponse,
        ] = await Promise.all([
          retryRequest(() => axiosInstance.get("/admin/stats")),
          retryRequest(() => axiosInstance.get("/admin/orderStats")),
          retryRequest(() => axiosInstance.get(`/admin/all-orders?size=20`)),
          retryRequest(() => axiosInstance.get("/admin/bestSellerByQuantity")),
          retryRequest(() => axiosInstance.get("/admin/bestSellerByAmount")),
        ]);

        // Process and set the data
        setDashboardStats(dashboardStatsResponse.data);
        setOrderStats(orderStatsResponse.data.data);

        const data = ordersResponse.data.data.map((order) => ({
          key: order.Id,
          id: order.Id,
          orderStatus: order.OrderStatusId,
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

  useEffect(() => {
    const fetchOrderChart = async (state) => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/past-orders?period=${state}`)
        );
        const orderChartData = response.data
          .map((item) => ({
            day: item.month || item.date,
            Orders: item.orders,
          }))

        setMonthlyOrder(orderChartData);
      } catch (error) {
        console.error("Error fetching New Orders:", error);
        message.error("Failed to fetching New Orders");
      }
    };

    fetchOrderChart(orderChartState);
  }, [orderChartState]);

  useEffect(() => {
    const fetchNewCustomer = async (state) => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/past-customers?period=${state}`)
        );
        const customerChartData = response.data.map((item) => ({
          day: item.month || item.date,
          Customers: item.orders,
        }));
        setNewCustomers(customerChartData);
      } catch (error) {
        console.error("Error fetching New Customers:", error);
        message.error("Failed to fetching New Customers");
      }
    };

    fetchNewCustomer(newCustomersState);
  }, [newCustomersState]);

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
              <Chart title="Orders" datakey="Orders" orderTotalData={orderChart} state={orderChartState} setState={setOrderChartState} />
            </Col>
            <Col xs={24} md={12}>
              <Chart title="New Customers" datakey="Customers" orderTotalData={newCustomers} state={newCustomersState} setState={setNewCustomersState}/>
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

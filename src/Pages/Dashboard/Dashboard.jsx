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

const Dashboard = () => {
  return (
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
        <DashBoardStats />

        {/* Orders stats */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col xs={24} md={12}>
            <Card title="Order Statistics" bordered={false}>
              <OrderCharts />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Sales Chart" bordered={false}>
              <Chart />
            </Card>
          </Col>
        </Row>

        {/* Customer stats */}
        <div style={{ padding: "5px", marginTop: "20px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Customer Statistics
          </h2>

          <Row gutter={[16, 16]}>
            {/* Active Customers */}
            <Col xs={24} md={12}>
              <Card
                title="Customers Activity"
                bordered={false}
              >
                <ActiveCustomer />
              </Card>
            </Col>

            {/* New Customers */}
            <Col xs={24} md={12}>
              <Card
                title="New Customers"
                bordered={false}
              >
                <NewCustomers />
              </Card>
            </Col>
          </Row>
        </div>

        {/* seller by qunaity and amount */}
        <div style={{ padding: "20px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Product Statistics
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <BestSellerByQuantity />
            </Col>
            <Col xs={24} sm={12}>
              <BestSellerByAmount />
            </Col>
          </Row>
        </div>
      </Content>
    </CustomLayout>
  );
};

export default Dashboard;

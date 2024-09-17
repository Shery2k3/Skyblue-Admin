import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined, ShoppingCartOutlined, RiseOutlined, TeamOutlined } from "@ant-design/icons";

const DashBoardStats = ({ data }) => {
  return (
    <>
      {/* Statistic Boxes */}
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={data.totalCustomers}
              prefix={<UserOutlined style={{ fontWeight: "bold" }} />}
              valueStyle={{ fontWeight: "bold" }}
              titleStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Registered Customers"
              value={data.registeredCustomers}
              prefix={<TeamOutlined style={{ fontWeight: "bold" }} />}
              valueStyle={{ fontWeight: "bold" }}
              titleStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={data.totalOrders}
              prefix={<ShoppingCartOutlined style={{ fontWeight: "bold" }} />}
              valueStyle={{ fontWeight: "bold" }}
              titleStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="New Orders"
              value={data.newOrders}
              prefix={<RiseOutlined style={{ fontWeight: "bold" }} />}
              valueStyle={{ fontWeight: "bold" }}
              titleStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashBoardStats;

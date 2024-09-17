import { Card, Progress, Row, Col, Typography } from "antd";

const { Title } = Typography;

const OrderCharts = ({ charts }) => {
  // Calculate progress percentages based on "All Time" total
  const progressPercent = (amount) =>
    charts.allTime ? Math.min((amount / charts.allTime) * 100, 100) : 0;

  // Check if charts data is loaded
  const isDataLoaded = charts && charts.allTime !== 0;

  return (
    <Card title="Order Total" style={{ height: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Order Totals</Title>
        </Col>
        {isDataLoaded ? (
          <>
            <Col xs={24} md={12}>
              <p>Today</p>
              <Progress
                percent={progressPercent(charts.today)}
                status="active"
                strokeColor="#0000FF"
                format={() => `$${(charts.today || 0).toFixed(2)}`}
              />
            </Col>
            <Col xs={24} md={12}>
              <p>This Week</p>
              <Progress
                percent={progressPercent(charts.week)}
                status="active"
                strokeColor="#0000FF"
                format={() => `$${(charts.week || 0).toFixed(2)}`}
              />
            </Col>
            <Col xs={24} md={12}>
              <p>This Month</p>
              <Progress
                percent={progressPercent(charts.month)}
                status="active"
                strokeColor="#0000FF"
                format={() => `$${(charts.month || 0).toFixed(2)}`}
              />
            </Col>
            <Col xs={24} md={12}>
              <p>This Year</p>
              <Progress
                percent={progressPercent(charts.year)}
                status="active"
                strokeColor="#0000FF"
                format={() => `$${(charts.year || 0).toFixed(2)}`}
              />
            </Col>
            <Col span={24}>
              <p>All Time</p>
              <Progress
                percent={100}
                status="active"
                strokeColor="#0000FF"
                format={() => `$${(charts.allTime || 0).toFixed(2)}`}
              />
            </Col>
          </>
        ) : (
          <Col span={24}>
            <p>Loading...</p>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default OrderCharts;

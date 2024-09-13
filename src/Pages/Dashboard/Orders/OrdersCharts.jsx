import { Card, Progress, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const OrderCharts = () => {
  // Order Total Data (API format)
  const orderTotalData = {
    success: true,
    data: {
      today: 0,
      thisWeek: 40020.4561,
      thisMonth: 168935.9524,
      thisYear: 3561396.7847,
      allTime: 5049922.3547
    }
  };

  // Calculate progress percentages based on "All Time" total
  const progressPercent = (amount) => Math.min((amount / orderTotalData.data.allTime) * 100, 100);

  return (
    <Card title="Order Total (Bullet Chart)" style={{ height: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Order Totals</Title>
        </Col>
        <Col xs={24} md={12}>
          <p>Today</p>
          <Progress
            percent={progressPercent(orderTotalData.data.today)}
            status="active"
            strokeColor="#0000FF"
            format={() => `$${orderTotalData.data.today.toFixed(2)}`}
          />
        </Col>
        <Col xs={24} md={12}>
          <p>This Week</p>
          <Progress
            percent={progressPercent(orderTotalData.data.thisWeek)}
            status="active"
            strokeColor="#0000FF"
            format={() => `$${orderTotalData.data.thisWeek.toFixed(2)}`}
          />
        </Col>
        <Col xs={24} md={12}>
          <p>This Month</p>
          <Progress
            percent={progressPercent(orderTotalData.data.thisMonth)}
            status="active"
            strokeColor="#0000FF"
            format={() => `$${orderTotalData.data.thisMonth.toFixed(2)}`}
          />
        </Col>
        <Col xs={24} md={12}>
          <p>This Year</p>
          <Progress
            percent={progressPercent(orderTotalData.data.thisYear)}
            status="active"
            strokeColor="#0000FF"
            format={() => `$${orderTotalData.data.thisYear.toFixed(2)}`}
          />
        </Col>
        <Col span={24}>
          <p>All Time</p>
          <Progress
            percent={100}
            status="active"
            strokeColor="#0000FF"
            format={() => `$${orderTotalData.data.allTime.toFixed(2)}`}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default OrderCharts;

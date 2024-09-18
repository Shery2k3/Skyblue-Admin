import { Card, Typography, Descriptions, ConfigProvider } from "antd";

const { Title } = Typography;

const OrderCharts = ({ charts }) => {
  // Check if charts data is loaded
  const isDataLoaded = charts && charts.allTime !== 0;

  return (
    <Card title="Order Totals" style={{ height: "100%", marginTop: "20px" }}>
      {isDataLoaded ? (

          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="Today">
              ${charts.today.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="This Week">
              ${charts.week.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="This Month">
              ${charts.month.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="This Year">
              ${charts.year.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="All Time">
              ${charts.allTime.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};

export default OrderCharts;

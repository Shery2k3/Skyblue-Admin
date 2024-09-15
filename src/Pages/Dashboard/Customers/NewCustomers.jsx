import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, Row, Col, Typography } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook

const { Title, Text } = Typography;

const NewCustomers = () => {
  const [data, setData] = useState([
    { name: "Today", uv: 0 },
    { name: "Month", uv: 0 },
    { name: "3 Months", uv: 0 },
    { name: "6 months", uv: 0 },
    { name: "Year", uv: 0 },
  ]);

  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/newCustomers")
        );
        const apiData = response.data;
        setData([
          { name: "Today", uv: apiData.today },
          { name: "Month", uv: apiData.thisMonth },
          { name: "3 Months", uv: apiData.lastThreeMonths },
          { name: "6 months", uv: apiData.lastSixMonths },
          { name: "Year", uv: apiData.thisYear },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [retryRequest]);

  return (
    <Card bordered={false} style={{ marginTop: "20px" }}>
      <Title level={4} style={{ textAlign: "center", marginBottom: "20px" }}>
        New Customers
      </Title>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#87CEEB">
            <LabelList dataKey="uv" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Numbers below the chart */}
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Row gutter={[16, 16]}>
          {data.map((item, index) => (
            <Col key={index} xs={12} sm={6} style={{ textAlign: "center" }}>
              <Card
                bordered={false}
                style={{ backgroundColor: "#f5f5f5", padding: "10px" }}
              >
                <Text strong>{item.name}</Text>
                <br />
                <Text style={{ fontSize: "24px", color: "#1890ff" }}>
                  {item.uv}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

export default NewCustomers;

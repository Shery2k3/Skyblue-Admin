import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig"; // Use the custom Axios instance
import useRetryRequest from "../../../Api/useRetryRequest"; // Import the retry hook

// Define colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

const Chart = () => {
  const [orderTotalData, setOrderTotalData] = useState([
    { name: "Today", value: 0 },
    { name: "Week", value: 0 },
    { name: "Month", value: 0 },
    { name: "Year", value: 0 },
  ]);

  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/orderValue")
        );
        const data = response.data.values;
        setOrderTotalData([
          { name: "Today", value: data.today },
          { name: "Week", value: data.thisWeek },
          { name: "Month", value: data.thisMonth },
          { name: "Year", value: data.thisYear },
        ]);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [retryRequest]);

  return (
    <Card title="Order Total" style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderTotalData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {orderTotalData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {orderTotalData.map((entry, index) => (
          <p
            key={index}
            style={{
              color: COLORS[index % COLORS.length],
              fontSize: "16px",
              margin: "5px 0",
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default Chart;

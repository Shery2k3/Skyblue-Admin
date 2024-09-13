import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

const Chart = () => {
  // Data for the PieChart
  const orderTotalData = [
    { name: "Today", value: 5 },
    { name: "Week", value: 10 },
    { name: "Month", value: 100 },
    { name: "Year", value: 150 },
  ];

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
    </Card>
  );
};

export default Chart;

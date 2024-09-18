import { Card } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ orderTotalData }) => {
  console.log(orderTotalData)
  return (
    <Card title="Orders" style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={orderTotalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#87CEEB"
            fill="#87CEEB"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;

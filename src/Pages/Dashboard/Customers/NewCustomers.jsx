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
import { Card } from "antd";

const NewCustomers = ({ data }) => {
  return (
    <Card title="New Customers" style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="uv" stroke="#87CEEB" fill="#87CEEB" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default NewCustomers;

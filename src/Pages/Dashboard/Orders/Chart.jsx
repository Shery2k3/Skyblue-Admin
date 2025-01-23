import { Card, Space, Button } from "antd";
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

const Chart = ({ title, datakey, orderTotalData, state, setState }) => {
  return (
    <Card title={title} style={{ height: "100%" }}>
      {/* Space for buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Space style={{ marginBottom: "1rem" }}>
          <Button
            type={state === "week" ? "primary" : "default"}
            onClick={() => setState("week")}
            size="small"
          >
            Week
          </Button>
          <Button
            type={state === "month" ? "primary" : "default"}
            onClick={() => setState("month")}
            size="small"
          >
            Month
          </Button>
          <Button
            type={state === "year" ? "primary" : "default"}
            onClick={() => setState("year")}
            size="small"
          >
            Year
          </Button>
        </Space>
      </div>

      {/* Area chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={orderTotalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey={datakey}
            stroke="#87CEEB"
            fill="#87CEEB"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;

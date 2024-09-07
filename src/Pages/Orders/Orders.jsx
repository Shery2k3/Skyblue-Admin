import CustomLayout from "../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../constants.js";

const Orders = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/all-orders`);
      console.log(response.data.datas)
      const data = response.data.data.map((order) => ({
        key: order.Id,
        id: order.Id,
        orderNo: order.Id,
        customer: "Arsal",
        createdOn: new Date(order.CreatedonUtc).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          }),
        orderTotal: "$" + order.OrderTotal.toFixed(2),
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleView = (order) => {
    navigate(`/orders/${order.orderNo}`)
  }


  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNo",
      key: "orderNo",
      align: "center",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Create on",
      dataIndex: "createdOn",
      key: "createdOn",
      align: "center",
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      key: "orderTotal",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleView(record)}>View</Button>
      ),
    },
  ];

  return (
    <CustomLayout pageTitle="Orders" menuKey="5">
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </CustomLayout>
  );
};

export default Orders;

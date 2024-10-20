import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Pagination, Card, Spin, Badge } from "antd";

const LatestOrders = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedData = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleView = (order) => {
    navigate(`/orders/${order.orderNo}`);
  };

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
      title: "Created On",
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
    <>
      {!orders.length ? (
        <Spin tip="Loading customers..." size="large" />
      ) : (
        <>
          <Table
            dataSource={displayedData}
            columns={columns}
            showSizeChanger={false}
            pageSize={5}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
          <Pagination
            responsive={true}
            align="center"
            style={{ marginTop: "20px", textAlign: "center" }}
            current={currentPage}
            pageSize={pageSize}
            total={orders.length}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </>
      )}
    </>
  );
};

export default LatestOrders;

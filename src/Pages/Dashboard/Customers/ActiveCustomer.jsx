import { useState } from "react";
import { Table, Pagination, Card, Spin, Badge } from "antd";

const ActiveCustomer = ({ customers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Email",
      dataIndex: "Email", // Note: "Email" is case-sensitive based on your API data.
      key: "Email",
      render: (email) => <strong>{email}</strong>,
    },
    {
      title: "Quantity Count",
      key: "Quantity Count",
      align: "center",
      render: (record) => {
        // Summing total quantity of products from all orders for each customer
        const totalQuantity = record.orders.reduce(
          (total, order) => total + order.totalQuantity,
          0
        );
        return <Badge count={totalQuantity} />;
      },
    },
    {
      title: "Amount Excl Tax",
      key: "Buy Amount",
      align: "center",
      render: (record) => {
        // Summing the order subtotal for each customer
        const totalAmount = record.orders.reduce(
          (total, order) => total + order.orderSubtotalExclTax,
          0
        );
        return `$${totalAmount.toFixed(2)}`;
      },
    },
    {
      title: "Order Count",
      key: "Order Count",
      align: "center",
      render: (record) => {
        console.log("Record", record);
        return record.orders.length; // Assuming 'orders' is an array from the backend
      },
    },
  ];

  return (
    <Card bordered={false} style={{ marginTop: "20px" }}>
      {!customers.length ? (
        <Spin tip="Loading customers..." size="large" />
      ) : (
        <>
          <Table
            dataSource={displayedCustomers}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.Email}
            scroll={{ x: "max-content" }}
          />
          <Pagination
            responsive={true}
            align="center"
            style={{ marginTop: "20px", textAlign: "center" }}
            current={currentPage}
            pageSize={pageSize}
            total={customers.length}
            onChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
};

export default ActiveCustomer;

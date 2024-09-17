import { useState } from "react";
import { Table, Button, Pagination, Card } from "antd";

const BestSellerByAmount = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Total Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Total Amount (Excl. Tax)",
      dataIndex: "Amount",
      key: "Amount",
      render: (amount) => `$${amount.toFixed(2)}`, // Format amount as currency
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          type="link"
          onClick={() =>
            (window.location.href = `/edit-product/${record.ProductId}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      title="Best Sellers by Amount"
      style={{ marginBottom: "20px" }}
    >
      <Table
        dataSource={displayedData}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.ProductId}
        scroll={{ x: "max-content" }}
      />
      <Pagination
        responsive={true}
        align="center"
        style={{ marginTop: "20px", textAlign: "center" }}
        current={currentPage}
        pageSize={pageSize}
        total={data.length}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </Card>
  );
};

export default BestSellerByAmount;

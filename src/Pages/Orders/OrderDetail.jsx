import CustomLayout from "../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import { Descriptions, Table, Spin } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosConfig"; // Import the custom Axios instance
import useRetryRequest from "../../Api/useRetryRequest"; // Import the retry hook

const OrdersDetails = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const retryRequest = useRetryRequest(); // Use the retry logic hook

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch order details with retry logic
        const response = await retryRequest(() => axiosInstance.get(`/admin/single-order/${id}`));
        
        const order = response.data.order;
        const products = response.data.order.items;

        const itemsData = [
          {
            key: "1",
            label: "Order #",
            children: order.Id,
          },
          {
            key: "2",
            label: "Order GUID",
            children: order.OrderGuid,
          },
          {
            key: "3",
            label: "Customer",
            children: order.customerEmail,
          },
          {
            key: "4",
            label: "Order Total",
            children: "$" + order.OrderTotal.toFixed(2),
          },
          {
            key: "5",
            label: "Order Time",
            children: new Date(order.CreatedonUtc).toLocaleString(),
          },
        ];

        const productData = products.map((item) => ({
          key: item.OrderItemGuid, // Unique key for each row
          imageUrl: item.product.imageUrl,
          productName: item.product.Name,
          price: `$${item.PriceInclTax.toFixed(2)}`, // Display price including tax
          quantity: item.Quantity,
          total: `$${(item.PriceInclTax * item.Quantity).toFixed(2)}`, // Total price for the item
        }));

        setItems(itemsData);
        setDataSource(productData);
      } catch (error) {
        console.error("Error fetching Order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, retryRequest]);

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (theImageURL) => <img alt="product-img" src={theImageURL} style={{ height: 50 }} />,
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
  ];

  return (
    <CustomLayout pageTitle="Order Details" menuKey="5">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Descriptions
            title="Order Details"
            layout="vertical"
            bordered
            items={items}
          />
          <br />
          <br />
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </>
      )}
    </CustomLayout>
  );
};

export default OrdersDetails;

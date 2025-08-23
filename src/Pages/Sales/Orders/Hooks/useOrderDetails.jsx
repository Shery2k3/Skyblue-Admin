// hooks/useOrderDetails.js
import { useState, useEffect } from "react";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";

export const useOrderDetails = (orderId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [priceDetail, setPriceDetail] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [items, setItems] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const retryRequest = useRetryRequest();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/single-order/${orderId}`)
        );

        console.log("PRODUCT AND ORDER", response.data);

        const order = response.data.order;
        const products = response.data.order.items;

        const orderData = [
          {
            key: "1",
            label: "Order #",
            children: order.Id,
            span: 3,
          },
          {
            key: "2",
            label: "Order GUID",
            children: order.OrderGuid,
            span: 3,
          },
          {
            key: "3",
            label: "Shipping Method",
            children: order.ShippingMethod,
            span: 3,
          },
          {
            key: "4",
            label: "Order Status",
            children: order.OrderStatusId,
            span: 3,
          },
        ];

        const userData = [
          {
            key: "1",
            label: "Full Name",
            children: order.customerFirstName + " " + order.customerLastName,
            span: 3,
          },
          {
            key: "2",
            label: "Email",
            children: order.customerEmail,
            span: 3,
          },
          {
            key: "3",
            label: "Phone",
            children: order.customerPhone,
            span: 3,
          },
          {
            key: "4",
            label: "Company",
            children: order.customerCompany,
            span: 3,
          },
          {
            key: "5",
            label: "Address",
            children: order.customerAddress,
            span: 3,
          },
          {
            key: "56",
            label: "Address 2",
            children: order.customerAddress2 || "N/A",
            span: 3,
          },
          {
            key: "7",
            label: "City",
            children: order.customerCity,
            span: 3,
          },
          {
            key: "8",
            label: "State / Province",
            children: order.customerState,
            span: 3,
          },
          {
            key: "9",
            label: "Zip / postal code",
            children: order.customerZip,
            span: 3,
          },
          {
            key: "10",
            label: "Country",
            children: order.customerCountry,
            span: 3,
          },
        ];

        const priceData = [
          {
            key: "1",
            label: "Order Subtotal(Excl Tax)",
            children: "$" + order.OrderSubtotalExclTax.toFixed(2),
            span: 3,
            editable: true,
            field: "orderSubtotal",
          },
          {
            key: "2",
            label: "Order Tax",
            children: "$" + order.OrderTax.toFixed(2),
            span: 3,
            editable: true,
            field: "orderTax",
          },
          {
            key: "3",
            label: "Order Subtotal (Incl Tax)",
            children: "$" + order.OrderSubtotalInclTax.toFixed(2),
            span: 3,
            editable: true,
            field: "orderSubtotal",
          },
          
          {
            key: "4",
            label: "Order Discount",
            children: "$" + order.OrderDiscount.toFixed(2),
            span: 3,
            editable: true,
            field: "orderDiscount",
          },
          {
            key: "5",
            label: "Order Total",
            children: "$" + order.OrderTotal.toFixed(2),
            span: 3,
            editable: true,
            field: "orderTotal",
          },
        ];

        const itemsData = [
          {
            key: "1",
            label: "Order Time",
            children: new Date(order.CreatedonUtc).toLocaleString(),
            span: 3,
          },
        ];

        const productData = products.map((item) => ({
          key: item.OrderItemGuid,
          customerId: order.CustomerId,
          imageUrl: item.product.imageUrl,
          productName: item.product.Name,
          productid: item.product.Id,
          unitpriceexcltax: item.UnitPriceExclTax.toFixed(2),
          unitpriceincltax: item.UnitPriceInclTax.toFixed(2),
          quantity: item.Quantity,
          priceexcltax: item.PriceExclTax,
          priceincltax: item.PriceInclTax,
          totalexcltax: item.PriceExclTax.toFixed(2),
          location: item.product.ItemLocation,
          vendor: item.product.vendorName,
          barcode:
            (item.product.Barcode || item.product.Barcode2)?.slice(-4) || null,
        }));

        const Info = {
          id: order.Id,
          companyName: order.customerCompany,
          customerName: order.customerFirstName + " " + order.customerLastName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          customerCity:
            order.customerCity +
            ", " +
            order.customerState +
            ", " +
            order.customerZip,
          customerCountry: order.customerCountry,
          customerEmail: order.customerEmail,
          createdOn: new Date(order.CreatedonUtc).toLocaleString(),
          subTotal: (
            order.OrderTotal -
            order.OrderTax +
            order.OrderDiscount
          ).toFixed(2),
          tax: order.OrderTax.toFixed(2),
          discount: order.OrderDiscount.toFixed(2),
          orderTotal: order.OrderTotal.toFixed(2),
          shippingMethod: order.ShippingMethod,
        };

        setOrderDetail(orderData);
        setUserDetail(userData);
        setPriceDetail(priceData);
        setUserInfo(Info);
        setItems(itemsData);
        setDataSource(productData);
      } catch (error) {
        setError(error);
        console.error("Error fetching Order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, retryRequest]);


  return {
    loading,
    error,
    orderDetail,
    userDetail,
    priceDetail,
    dataSource,
    items,
    userInfo,
  };
};

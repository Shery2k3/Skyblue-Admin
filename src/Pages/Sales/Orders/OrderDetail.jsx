import CustomLayout from "../../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import { Button, Input } from "antd";
import { Descriptions, Table, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../../Components/Invoice/Invoice";
import PackageSlip from "../../../Components/Invoice/PackageSlip";
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const OrdersDetails = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [priceDetail, setPriceDetail] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, serUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({
    orderSubtotal: '',
    orderTax: '',
    orderDiscount: '',
    orderTotal: ''
  });

  const retryRequest = useRetryRequest(); // Use the retry logic hook
  const { Title } = Typography;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        // Use retryRequest to fetch order details with retry logic
        const response = await retryRequest(() =>
          axiosInstance.get(`/admin/single-order/${id}`)
        );

        console.log(response.data);
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
        ]

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
            key: "6",
            label: "City",
            children: order.customerCity,
            span: 3,
          },
          {
            key: "7",
            label: "State / Province",
            children: order.customerState,
            span: 3,
          },
          {
            key: "8",
            label: "Zip / postal code",
            children: order.customerZip,
            span: 3,
          },
          {
            key: "9",
            label: "Country",
            children: order.customerCountry,
            span: 3,
          },
        ]

        const priceData = [
          {
            key: "1",
            label: "Order Subtotal",
            children: "$" + (order.OrderTotal + order.OrderDiscount - order.OrderTax).toFixed(2) + " excl tax",
            span: 3,
            editable: true,
            field: 'orderSubtotal'
          },
          {
            key: "2",
            label: "Order Tax",
            children: "$" + order.OrderTax.toFixed(2),
            span: 3,
            editable: true,
            field: 'orderTax'
          },
          {
            key: "3",
            label: "Order Discount",
            children: "-$" + order.OrderDiscount.toFixed(2),
            span: 3,
            editable: true,
            field: 'orderDiscount'
          },
          {
            key: "4",
            label: "Order Total",
            children: "$" + order.OrderTotal.toFixed(2),
            span: 3,
            editable: true,
            field: 'orderTotal'
          },
        ]

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
          imageUrl: item.product.imageUrl,
          productName: item.product.Name,
          price: `$${item.UnitPriceExclTax.toFixed(2)}`,
          quantity: item.Quantity,
          total: `$${item.PriceExclTax.toFixed(2)}`,
          location: item.product.ItemLocation,
          barcode:
            (item.product.Barcode || item.product.Barcode2)?.slice(-4) || null,
        }));

        const Info = {
          id: order.Id,
          companyName: order.customerCompany,
          customerName: order.customerFirstName + " " + order.customerLastName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          customerCity: order.customerCity + ", " + order.customerState + ", " + order.customerZip,
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

        setEditableFields({
          orderSubtotal: (order.OrderTotal + order.OrderDiscount - order.OrderTax).toFixed(2),
          orderTax: order.OrderTax.toFixed(2),
          orderDiscount: order.OrderDiscount.toFixed(2),
          orderTotal: order.OrderTotal.toFixed(2)
        });

        setUserDetail(userData)
        setOrderDetail(orderData)
        setPriceDetail(priceData)

        serUserInfo(Info);
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableFields({
      ...editableFields,
      [name]: value
    });
  };

  const saveChanges = async () => {
    const updatedData = {
      orderSubtotal: editableFields.orderSubtotal,
      orderTax: editableFields.orderTax,
      orderDiscount: editableFields.orderDiscount,
      orderTotal: editableFields.orderTotal
    };

    try {
      await axiosInstance.patch(`/admin/orders/${id}`, updatedData);
      console.log("Updated Data:", updatedData);
    } catch (error) {
      console.error("Error updating Order data:", error);
    } finally {
      toggleEdit();
    }
  };

  const renderEditableField = (field, value) => {
    return isEditing ? (
      <Input
        name={field}
        value={editableFields[field]}
        onChange={handleInputChange}
      />
    ) : (
      value
    );
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (theImageURL) => (
        <img alt="product-img" src={theImageURL} style={{ height: 50 }} />
      ),
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
    <CustomLayout pageTitle="Order Details" menuKey="7">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Order Details
      </Title>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
              float: "center",
            }}
          >
            {items.length > 0 ? (
              <>
                <PDFDownloadLink
                  document={
                    <Invoice userInfo={userInfo} products={dataSource} />
                  }
                  fileName={`order_${id}_invoice.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <Button type="primary" disabled>
                        Preparing PDF...
                      </Button>
                    ) : (
                      <Button type="primary" size="small">
                        Invoice (PDF)
                      </Button>
                    )
                  }
                </PDFDownloadLink>

                <PDFDownloadLink
                  document={
                    <PackageSlip userInfo={userInfo} products={dataSource} />
                  }
                  fileName={`order_${id}_package_slip.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <Button
                        type="primary"
                        disabled
                        style={{ marginLeft: "10px" }}
                      >
                        Preparing PDF...
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        style={{ marginLeft: "10px" }}
                      >
                        Package Slip (PDF)
                      </Button>
                    )
                  }
                </PDFDownloadLink>
              </>
            ) : (
              <>
                <Button type="primary" disabled>
                  No Data for PDF
                </Button>
                <Button type="primary" disabled style={{ marginLeft: "10px" }}>
                  No Data for PDF
                </Button>
              </>
            )}
          </div>
          <Button
            type="primary"
            icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={isEditing ? saveChanges : toggleEdit}
            style={{ marginBottom: "20px" }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          {isEditing && (
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={toggleEdit}
              style={{ marginLeft: "10px", marginBottom: "20px" }}
            >
              Cancel
            </Button>
          )}
          <Descriptions layout="horizontal" size='small' bordered>
            {orderDetail.map(item => (
              <Descriptions.Item key={item.key} label={item.label} span={item.span}>
                {item.editable ? renderEditableField(item.field, item.children) : item.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
          <Descriptions layout="horizontal" size='small' bordered>
            {userDetail.map(item => (
              <Descriptions.Item key={item.key} label={item.label} span={item.span}>
                {item.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
          <Descriptions layout="horizontal" size='small' bordered>
            {priceDetail.map(item => (
              <Descriptions.Item key={item.key} label={item.label} span={item.span}>
                {item.editable ? renderEditableField(item.field, item.children) : item.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
          <Descriptions layout="horizontal" size='small' bordered>
            {items.map(item => (
              <Descriptions.Item key={item.key} label={item.label} span={item.span}>
                {item.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
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
import CustomLayout from "../../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import { Button, Divider } from "antd";
import { Descriptions, Spin } from "antd";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../../Components/Invoice/Invoice";
import PackageSlip from "../../../Components/Invoice/PackageSlip";
import { useOrderDetails } from "./Hooks/useOrderDetails";
import Title from "antd/es/skeleton/Title";
import Order from "./Sections/Order";
import User from "./Sections/User";
import Price from "./Sections/Price";
import Item from "./Sections/Item";

const OrdersDetails = () => {
  const { id } = useParams();
  const {
    loading,
    error,
    orderDetail,
    userDetail,
    priceDetail,
    dataSource,
    items,
    userInfo,
  } = useOrderDetails(id);

  // console.log("orderDetail", orderDetail, "userDetail", userDetail, "priceDetail", priceDetail, "dataSource", dataSource, "items", items, "userInfo", userInfo);

  return (
    <>
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
              <div style={{ textAlign: "right", marginBottom: "20px" }}>
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
                          <Button
                            type="primary"
                            size="small"
                            style={{ marginLeft: "10px" }}
                          >
                            Invoice (PDF)
                          </Button>
                        )
                      }
                    </PDFDownloadLink>

                    <PDFDownloadLink
                      document={
                        <PackageSlip
                          userInfo={userInfo}
                          products={dataSource}
                        />
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
                  <Button type="primary" disabled>
                    No Data for PDF
                  </Button>
                )}
              </div>

              {/* I START WORKING FROM HERE */}

              {/* {console.log("orderDetail", orderDetail)} */}
              <Order orderDetail={orderDetail} />

              <Divider orientation="left">Items</Divider>
              <Descriptions layout="horizontal" size="small" bordered>
                {items.map((item) => (
                  <Descriptions.Item
                    key={item.key}
                    label={item.label}
                    span={item.span}
                  >
                    {item.children}
                  </Descriptions.Item>
                ))}
              </Descriptions>

              <User userDetail={userDetail} />
              <Price priceDetail={priceDetail} orderId={id}/>

              <Item dataSource={dataSource} />
            </>
          )}
        </CustomLayout>
      
    </>
  );
};

export default OrdersDetails;

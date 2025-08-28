import CustomLayout from "../../../Components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, message, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Descriptions, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Invoice from "../../../Components/Invoice/Invoice";
import PackageSlip from "../../../Components/Invoice/PackageSlip";
import { useOrderDetails } from "./Hooks/useOrderDetails";
import Order from "./Sections/Order";
import User from "./Sections/User";
import Price from "./Sections/Price";
import Item from "./Sections/Item";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer"; // Ensure you import the pdf function

const { Title } = Typography;

const OrdersDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    orderDetail,
    userDetail,
    priceDetail,
    dataSource,
    items,
    userInfo,
  } = useOrderDetails(id);

  // console.log("priceDetail", priceDetail);
  //  console.log("Products", dataSource);
  //  console.log("userInfo", userInfo);

  // State to track which PDF is currently loading
  const [loadingPdf, setLoadingPdf] = useState(null); // null means no PDF is loading

  const handleDownloadPDF = async (type) => {
    setLoadingPdf(type); // Set the loading state to the type of PDF being generated
    try {
      let blob;
      if (type === "invoice") {
        blob = await pdf(
          <Invoice userInfo={userInfo} products={dataSource} />
        ).toBlob();
      } else if (type === "packageSlip") {
        blob = await pdf(
          <PackageSlip userInfo={userInfo} products={dataSource} />
        ).toBlob();
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order_${id}_${type}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      message.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setLoadingPdf(null); // Reset loading state
    }
  };

  return (
    <CustomLayout pageTitle="Order Details" menuKey="7">
      <Button
        type="link"
        onClick={() => {
          navigate("/orders");
        }}
        icon={<ArrowLeftOutlined />}
      >
        Back to Order Page
      </Button>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Edit order details - {id}
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
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleDownloadPDF("invoice")}
                  disabled={loadingPdf !== null}
                >
                  {loadingPdf === "invoice" ? (
                    <>
                      {" "}
                      <LoadingOutlined /> Downloading{" "}
                    </>
                  ) : (
                    "Invoice (PDF)"
                  )}
                </Button>

                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleDownloadPDF("packageSlip")}
                  disabled={loadingPdf !== null}
                >
                  {loadingPdf === "packageSlip" ? (
                    <>
                      {" "}
                      <LoadingOutlined /> Downloading{" "}
                    </>
                  ) : (
                    "Package Slip (PDF)"
                  )}
                </Button>
              </>
            ) : (
              <Button type="primary" disabled>
                No Data for PDF
              </Button>
            )}
          </div>

          {/* Responsive Row for Order and Ordernotes */}
          <Order orderDetail={orderDetail} items={items} />

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
          <Price priceDetail={priceDetail} />
          <Item dataSource={dataSource} />
        </>
      )}
    </CustomLayout>
  );
};

export default OrdersDetails;

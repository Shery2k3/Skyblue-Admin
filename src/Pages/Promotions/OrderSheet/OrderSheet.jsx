import React, { useEffect, useState } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Sheet from "../../../Components/OrderSheet/Sheet";
import { Button, Typography } from "antd";

const OrderSheet = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const retryRequest = useRetryRequest();
  const { Title } = Typography;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/ordersheet`, {
          params: { categoryId: 1 },
        })
      );

      setDataSource(response.data.data)
    } catch (error) {
      console.error("Error fetching bestseller data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [retryRequest]);

  return (
    <CustomLayout pageTitle="Order Sheet" menuKey="17">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Order Sheet
      </Title>

      <PDFDownloadLink
        document={<Sheet products={dataSource} />}
        fileName={`order_sheet.pdf`}
      >
        {({ loading }) =>
          loading ? (
            <Button type="primary" disabled>
              Preparing PDF...
            </Button>
          ) : (
            <Button type="primary" size="small">
              Export to PDF
            </Button>
          )
        }
      </PDFDownloadLink>
    </CustomLayout>
  );
};

export default OrderSheet;

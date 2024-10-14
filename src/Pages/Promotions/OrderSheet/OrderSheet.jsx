import React, { useEffect, useState, useRef } from "react";
import CustomLayout from "../../../Components/Layout/Layout";
import axiosInstance from "../../../Api/axiosConfig";
import useRetryRequest from "../../../Api/useRetryRequest";
import { PDFViewer, pdf } from "@react-pdf/renderer"; // Import PDFViewer and pdf utilities
import Sheet from "../../../Components/OrderSheet/Sheet";
import { Button, Typography, Modal } from "antd";

const OrderSheet = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const pdfBlobUrl = useRef(null); // Store the PDF blob URL reference

  const retryRequest = useRetryRequest();
  const { Title } = Typography;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await retryRequest(() =>
        axiosInstance.get(`/admin/ordersheet`, { params: { categoryId: 1 } })
      );
      setDataSource(response.data.data);
    } catch (error) {
      console.error("Error fetching order sheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [retryRequest]);

  const generatePDF = async () => {
    const pdfDoc = <Sheet products={dataSource} />; // Pass the fetched products to the Sheet
    const blob = await pdf(pdfDoc).toBlob(); // Convert PDF to Blob
    pdfBlobUrl.current = URL.createObjectURL(blob); // Create a Blob URL
    setIsModalOpen(true); // Open the modal to preview the PDF
  };

  return (
    <CustomLayout pageTitle="Order Sheet" menuKey="17">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Order Sheet
      </Title>

      <Button type="primary" onClick={generatePDF}>
        Preview PDF
      </Button>

      {/* Modal with an iframe to preview PDF */}
      <Modal
        title="PDF Preview"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%"
      >
        <iframe
          src={pdfBlobUrl.current}
          width="100%"
          height="1000px"
          style={{ border: "none" }}
        />
      </Modal>
    </CustomLayout>
  );
};

export default OrderSheet;

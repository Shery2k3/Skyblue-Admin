import React from "react";
import {
  Page,
  Document,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import LogoAccent from "/LogoAccent.png"; // Ensure this path is correct
import API_BASE_URL from "../../constants";

Font.register({
  family: "Helvetica-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfkit/0.8.3/font/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f0f0f5", // Light gray background
  },
  logo: {
    width: "150px",
    marginBottom: 15,
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
    color: "#4A90E2", // Blue color for header
  },
  dateRange: {
    fontSize: 18,
    marginBottom: 25,
    color: "#555", // Gray color for date
  },
  productContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to new lines
    justifyContent: "space-around", // Space out products evenly
    marginBottom: 20,
    width: "100%",
  },
  productBox: {
    padding: 10,
    border: "1px solid #ddd", // Light border
    borderRadius: 10,
    backgroundColor: "#ffffff", // White background for product boxes
    width: "30%", // Adjust width to fit three items per row
    margin: "10px 0", // Margin between products
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow

  },
  productHeader: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#4A90E2",
    marginBottom: 5,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    color: "#28A745", // Green color for price
    textAlign: "center",
    marginBottom: 10,
  },
  productImage: {
    width: "100%", // Full width image
    height: 150, // Fixed height, adjust as needed
    objectFit: "cover", // Maintain aspect ratio
    borderRadius: 5, // Rounded corners for images
  },
});

const Flyer = ({ flyerData, startDate, endDate }) => {
  const itemsPerPage = 6; // Maximum products per page
  const pages = Math.ceil(flyerData.length / itemsPerPage); // Calculate total pages


  const proxyUrl = (url) => `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(url)}`

  return (
    <Document>
      {Array.from({ length: pages }).map((_, pageIndex) => {
        const start = pageIndex * itemsPerPage;
        const end = start + itemsPerPage;
        const productsOnPage = flyerData.slice(start, end);

        return (
          <Page size="A4" style={styles.page} key={pageIndex}>
            <Image style={styles.logo} src={LogoAccent} />
            <Text style={styles.header}>Exciting Product Flyer</Text>
            <Text style={styles.dateRange}>
              Promotion Period: {startDate} - {endDate}
            </Text>

            <View style={styles.productContainer}>
              {productsOnPage.map((product) => (
                <View style={styles.productBox} key={product.ProductId}>
                  {product.ImageUrls.length > 0 && (
                    <Image
                      style={styles.productImage}
                      src={proxyUrl(product.ImageUrls[0])} // Display the first image
                      alt="Product Image" // Added alt text for better accessibility
                    />
                  )}
                  <Text style={styles.productHeader}>{product.ProductName}</Text>
                  <Text style={styles.productPrice}>Price: ${product.Price}</Text>
                </View>
              ))}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default Flyer;

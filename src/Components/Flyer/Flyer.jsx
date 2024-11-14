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
    backgroundColor: "#F1FBFF",
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
    fontSize: 12,
    marginBottom: 25,
    color: "#122030", // Gray color for date
  },
  productContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 10,
    width: "100%",
  },
  productBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    width: "24%",
    marginBottom: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  productImageContainer:{
    width: "75px",
    height: "75px",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%", 
    height: "100%", 
    objectFit: "contain", 
    borderRadius: 5,
  },
  productHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#001529",
    textAlign: "center",
  },
  productPrice: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: 900,
    color: "#4A90E2",
    textAlign: "center",
  },
});

const Flyer = ({ flyerData, startDate, endDate }) => {
  const itemsPerPage = 16; // Maximum products per page
  const pages = Math.ceil(flyerData.length / itemsPerPage); // Calculate total pages

  const proxyUrl = (url) =>
    `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(url)}`;

  return (
    <Document>
      {Array.from({ length: pages }).map((_, pageIndex) => {
        const start = pageIndex * itemsPerPage;
        const end = start + itemsPerPage;
        const productsOnPage = flyerData.slice(start, end);

        return (
          <Page size="A4" style={styles.page} key={pageIndex}>
            <Image style={styles.logo} src={LogoAccent} />
            <Text style={styles.dateRange}>
              Promotion Period: {startDate} - {endDate}
            </Text>

            <View style={styles.productContainer}>
              {productsOnPage.map((product) => (
                <View style={styles.productBox} key={product.ProductId}>
                  <View style={styles.productImageContainer}>
                    <Image
                      style={styles.productImage}
                      src={proxyUrl(product.ImageUrls[0])} // Display the first image
                      alt="Product Image" // Added alt text for better accessibility
                    />
                  </View>
                  <Text style={styles.productHeader}>
                    {product.ProductName}
                  </Text>
                  <Text style={styles.productPrice}>${product.Price}</Text>
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

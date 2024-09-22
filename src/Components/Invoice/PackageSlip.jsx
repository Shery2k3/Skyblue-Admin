import React from "react";
import {
  Page,
  Document,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import LogoAccent from "/LogoAccent.png";

Font.register({
  family: "Helvetica-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfkit/0.8.3/font/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 75,
    height: "auto",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  reportTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
    flexGrow: 1,
  },
  invoiceNoAndDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  billTo: {
    width: "45%", // Adjust the width to make it fit next to the other section
  },
  billToAddress: {
    marginTop: 5,
  },
  fromAddress: {
    width: "45%", // Adjust the width to make it fit next to the other section
  },
  table: {
    flexDirection: "column",
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    fontWeight: "bold",
    backgroundColor: "#B7E2F3",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#000",
    borderBottomWidth: 0,
    alignItems: "center",
    height: 36,
  },
  tableCell_1: {
    width: "20%",
    textAlign: "center",
    paddingLeft: 8,
  },
  tableCell_2: {
    width: "40%",
    paddingRight: 8,
  },
  tableCell_3: {
    width: "20%",
    textAlign: "center",
    paddingRight: 8,
  },
  tableCell_4: {
    width: "20%",
    textAlign: "center",
    paddingRight: 8,
  },
  subTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 2,
  },

  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderBottomColor: "#0678BE",
    paddingTop: 5,
  },
  paymentMethod: {
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  svg: {
    width: "100%",
    height: "auto",
  },
});

const PackageSlip = ({ products, userInfo }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <Image style={styles.logo} src={LogoAccent} />
          <Text>Order# {userInfo.id}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>Package Slip</Text>
        </View>
        <View style={styles.invoiceNoAndDate}>
          <Text>Date: {userInfo.createdOn}</Text>
        </View>
        {/* Address Container for Billed To and From sections */}
        <View style={styles.addressContainer}>
          <View style={styles.billTo}>
            <Text>Billed to:</Text>
            <Text style={styles.billToAddress}>
              Company Name: {userInfo.companyName}
            </Text>
            <Text>Name: {userInfo.customerName}</Text>
            <Text>Phone: {userInfo.customerPhone}</Text>
            <Text>Address: {userInfo.customerAddress}</Text>
            <Text>{userInfo.customerCity}</Text>
            <Text>{userInfo.customerCountry}</Text>
          </View>
          <View style={styles.fromAddress}>
            <Text>From:</Text>
            <Text style={styles.billToAddress}>SkyBlue Wholesale</Text>
            <Text>1300 Kamato Rd #8&9</Text>
            <Text>Mississauga, ON L4W 2N2</Text>
            <Text>Canada</Text>
            <Text>sales@skybluewholesale.com</Text>
          </View>
        </View>
        <View style={styles.paymentMethod}>
          <Text>Shipping method: {userInfo.shippingMethod}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell_1}>Location</Text>
            <Text style={styles.tableCell_2}>Item</Text>
            <Text style={styles.tableCell_3}>Qty</Text>
            <Text style={styles.tableCell_4}>Barcode</Text>
          </View>
          {products.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell_1}>
                {product.location || ""}
              </Text>
              <Text style={styles.tableCell_2}>{product.productName || ""}</Text>
              <Text style={styles.tableCell_3}>{product.quantity || ""}</Text>
              <Text style={styles.tableCell_4}>{product.barcode || ""}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PackageSlip;

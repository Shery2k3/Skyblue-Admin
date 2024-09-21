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
    fontSize: 11,
    paddingTop: 30,
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
    width: "40%",
    paddingLeft: 8,
  },
  tableCell_2: {
    width: "20%",
    textAlign: "center",
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
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderBottomColor: "#0678BE",
    paddingTop: 10,
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

const Invoice = ({ products, userInfo }) => {

  console.log(userInfo)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <Image style={styles.logo} src={LogoAccent} />
          <Text>Order# {userInfo[0].children}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>Invoice</Text>
        </View>
        <View style={styles.invoiceNoAndDate}>
          <Text>Date: {userInfo[4].children}</Text>
        </View>
        {/* Address Container for Billed To and From sections */}
        <View style={styles.addressContainer}>
          <View style={styles.billTo}>
            <Text>Billed to:</Text>
            <Text style={styles.billToAddress}>{"Arsal"}</Text>
            <Text>{"R1303 BLOCK 15, FB AREA, Karachi"}</Text>
            <Text>{userInfo[2].children}</Text>
          </View>
          <View style={styles.fromAddress}>
            <Text>From:</Text>
            <Text>SkyBlue Wholesale</Text>
            <Text>1300 Kamato Rd #8&9, Mississauga, ON L4W 2N2, Canada</Text>
            <Text>sales@skybluewholesale.com</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell_1}>Item</Text>
            <Text style={styles.tableCell_2}>Quantity</Text>
            <Text style={styles.tableCell_3}>Aisle</Text>
            <Text style={styles.tableCell_4}>Price</Text>
          </View>
          {products.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell_1}>
                {product.productName || ""}
              </Text>
              <Text style={styles.tableCell_2}>{product.quantity || ""}</Text>
              <Text style={styles.tableCell_3}>{product.price || ""}</Text>
              <Text style={styles.tableCell_4}>{product.price || ""}</Text>
            </View>
          ))}
        </View>
        <View style={styles.total}>
          <Text style={styles.tableCell_3}>Total</Text>
          <Text style={styles.tableCell_4}>{userInfo[3].children}</Text>
        </View>
        <View style={styles.paymentMethod}>
          <Text>Shipping method: {"pickup"}</Text>
        </View>
        <View style={styles.footer}>
          <Svg style={styles.svg} viewBox="0 0 900 600">
            <Path
              d="M0 467L21.5 472.5C43 478 86 489 128.8 489.3C171.7 489.7 214.3 479.3 257.2 462.5C300 445.7 343 422.3 385.8 406.8C428.7 391.3 471.3 383.7 514.2 388.7C557 393.7 600 411.3 642.8 435.2C685.7 459 728.3 489 771.2 484.2C814 479.3 857 439.7 878.5 419.8L900 400L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
              fill="#0678BE"
              strokeLinecap="round"
              strokeLinejoin="miter"
            />
          </Svg>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;

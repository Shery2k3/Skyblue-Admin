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
import LogoAccent from "/LogoAccent.png";

Font.register({
  family: "Helvetica-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfkit/0.8.3/font/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 100,
    height: "auto",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#E3F2FD", // Light blue background for the title section
    padding: 10,
    marginBottom: 10,
  },
  inputField: {
    marginTop: 10,
  },
  categoryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#E3F2FD",
    textAlign: "center",
    padding: 5,
    borderRadius: 5,
  },
  table: {
    marginTop: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 2,
    marginRight: 5,
  },
  productName: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    textAlign: "center",
    color: "gray",
  },
});

const Sheet = ({ products }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.inputField}>
              Customer Number: ____________________________________
            </Text>
            <Text style={styles.inputField}>
              Customer Name: ______________________________________
            </Text>
            <Text style={styles.inputField}>
              Phone Number: _______________________________________
            </Text>
            <Text style={styles.inputField}>
              Delivery Date: ________________________________________
            </Text>
          </View>
          <View>
            <Image style={styles.logo} src={LogoAccent} />
            <Text style={styles.inputField}>1300 Kamato Rd Unit 8 &9</Text>
            <Text>Mississauga, Ontario L4W2N2</Text>
            <Text>Telephone: 905-625-2583</Text>
            <Text>Fax: 905-625-5389</Text>
          </View>
        </View>

        {products.map((category) => (
          <View key={category.category} style={styles.table}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            <View style={styles.gridContainer}>
              {category.data.map((item) => (
                <View key={item.Id} style={styles.gridItem}>
                  <View style={styles.checkbox} />
                  <Text style={styles.productName}>{item.Name}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          Thank you for your business!
        </Text>
      </Page>
    </Document>
  );
};

export default Sheet;

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
    padding: 10,
    marginBottom: 8,
  },
  inputField: {
    marginTop: 10,
  },
  categoryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    fontWeight: 600,
    marginTop: 3,
    marginBottom: 5,
    backgroundColor: "#E3F2FD",
    textAlign: "center",
    paddingTop: 4,
    paddingBottom: 2,
    borderRadius: 5,
    break: 'avoid'
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 25,
    height: 20,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 2,
    marginRight: 5,
  },
  productName: {
    fontSize: 7.5,
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    
  },
  gridItem: {
    width: "25%",
    flexDirection: "row",
    alignItems: "center",
    break: 'avoid',
    marginBottom: 5,
  },
});

const Sheet = ({ products, showPrice }) => {
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
          <View key={category.category}>
            <Text style={styles.categoryTitle} wrap={false}>{category.category}</Text>
            <View style={styles.gridContainer}>
              {category.data.map((item) => (
                <View key={item.Id} style={styles.gridItem} wrap={false}>
                  <Text style={styles.productName}>
                    {item.Name}
                    {showPrice && ` ($${item.Price})`}
                  </Text>
                  <View style={styles.checkbox} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default Sheet;

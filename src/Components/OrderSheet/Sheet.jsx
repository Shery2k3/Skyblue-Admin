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
  },
  inputField: {
    marginTop: 10,
  },
});

const Sheet = ({ products }) => {
  console.log(products);
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
            <Text>Mississauga,Ontario L4W2N2</Text>
            <Text>Telephone: 905-625-2583</Text>
            <Text>Fax: 905-625-5389</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Sheet;

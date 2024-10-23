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
  
});

const Flyer = ({ flyerData, startDate, endDate }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text>{startDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Flyer;

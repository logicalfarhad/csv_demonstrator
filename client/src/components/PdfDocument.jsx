import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image
} from "@react-pdf/renderer";



// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 50,
    paddingVertical: 50,
  },
  text: {
    // width: "100%",
    // paddingHorizontal: 50,
    // paddingVertical: 30,
    // color: "#212121"
  },
  textHeading: {
    width: "100%",
    textAlign: 'center',
    fontSize: 150,
  },
  textSubHeading: {
    width: "100%",
    textAlign: 'center',
    fontSize: 40,
  },
  viewCode: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 20,
    border: '1px solid black'
  },
  textCode: {
  },
  image: {
    width: "60%",
    padding: 10
  },
  imageCenter:{
    alignItems: "center",
    flexGrow: 1,
    padding: 20
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 5,
  },
  columnHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }


});

// Create Document Component
const PdfDocument = (props) => {
  console.log(props);

  const headerKeys = Object.keys(props.queryResp[0]);
  // Calculate the maximum font size based on the available page width
  const maxFontSize = 10;
  const maxWidth = 500; // Adjust this based on your page width
  const maxHeaderWidth = maxWidth / headerKeys.length;
  const fontSize = maxFontSize > maxHeaderWidth ? maxHeaderWidth : maxFontSize;

  // Calculate the maximum font size for row content based on the available page width
  const maxRowFontSize = 12;
  const maxRowWidth = maxWidth / headerKeys.length;
  const rowFontSize = maxRowFontSize > maxRowWidth ? maxRowWidth : maxRowFontSize;

  return (
    <PDFViewer style={{width:'100%', height:'400px'}}>
      <Document>
        <Page style={styles.page} size="A4">
          <Text style={styles.textHeading}>Report</Text>
        </Page>

        <Page style={styles.page} size="A4">
          <View>
          <Text style={{paddingTop:'10',color:'blue'}}>Question</Text>
          <Text style={styles.text}>{props.question}</Text>
          
          <Text style={{paddingTop:'20',color:'blue'}}>Response Query</Text>
          <Text style={styles.text}>{props.aiResponse}</Text>
          </View>

          <Text style={{paddingTop:'20',color:'blue'}}>Query Results</Text>
          {/* Headers */}
          <View style={styles.tableRow}>
            {headerKeys.map((key) => (
              <View key={key} style={{ ...styles.columnHeader, width: maxHeaderWidth }}>
                <Text style={{ fontSize }}>{key}</Text>
              </View>
            ))}
          </View>
          {/* Rows */}
          {props.queryResp.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              {Object.values(row).map((value, subIndex) => (
                <View key={subIndex} style={{ ...styles.tableCell, width: maxRowWidth }}>
                  <Text style={{ fontSize: rowFontSize }}>{value}</Text>
                </View>
              ))}
            </View>
          ))}
          {/* <View style={styles.viewCode}>
            <Text style={styles.textCode}>
              {JSON.stringify(props.queryResp, undefined, 2)}
            </Text>
          </View> */}
        </Page>

        {props.chartsImg.length > 0 && (
        <Page style={styles.page}>
        <Text style={styles.textSubHeading}>Visualizations</Text>
        {props.chartsImg.map((image) => (
          <View wrap={false} style={styles.imageCenter}>
            <Text>{image.title}</Text>
            <Image style={styles.image} src={image.dataUrl} />
            <Text style={{fontSize:'12'}}>{image.description}</Text>
          </View>
        ))}
      </Page>
        )}

      </Document>
     </PDFViewer>
  );
};

export default PdfDocument;

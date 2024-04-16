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
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  question: {
    fontSize: 20,
    marginTop:10,
  },

  text: {
    fontSize: 14
  },
  textHeading: {
    width: "100%",
    textAlign: 'left',
    fontSize: 45,
    color: '#07115f'
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
    width: "80%",
    padding: 10
  },
  imageCenter:{
    alignItems: "left",
    flexGrow: 1,
    fontSize:14,
    paddingTop:10

  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 10,
  },
  columnHeader: {
    flex: 1,
    justifyContent: "left",
    alignItems: "left",
    color: '#07115f'
  },
  tableCell: {
    flex: 1,
    justifyContent: "left",
    alignItems: "left",
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 10,
    textAlign: 'right', // Align text to the right
    fontSize: 12,
    color: '#555',
  },


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
          <Text style={styles.textHeading}>REPORT</Text>
          <View>
          <Text style={styles.question}>{props.question}</Text>
          
          <Text style={{paddingTop:'20',color:'black'}}>Response Query</Text>
          <Text style={{borderBottom:'3px solid black',paddingTop:'3px'}}></Text>
          <Text style={styles.text}>{props.aiResponse}</Text>
          </View>

          <Text style={{paddingTop:'20',color:'black'}}>Query Results</Text>
          <Text style={{borderBottom:'3px solid black',paddingVertical:'3px'}}></Text>
          {/* Headers */}
          <View style={styles.tableRow} >
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


        {props.chartsImg.length > 0 && (
          <View wrap={false}>
          <Text style={{paddingTop:'20',color:'black'}}>Visualizations</Text>
          <Text style={{borderBottom:'3px solid black',paddingVertical:'3px'}}></Text>
        {props.chartsImg.map((image) => (
          <View wrap={false} style={styles.imageCenter}>
            <Text style={{color: '#07115f'}}>{image.title}</Text>
            <Image style={styles.image} src={image.dataUrl} />
            <Text style={{fontSize:'12',color:'#07115f'}}>{image.description}</Text>
          </View>
        ))}
</View>
        )}

<Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Seite ${pageNumber} / ${totalPages}`
      )} fixed />
        </Page>
      </Document>
     </PDFViewer>
  );
};

export default PdfDocument;

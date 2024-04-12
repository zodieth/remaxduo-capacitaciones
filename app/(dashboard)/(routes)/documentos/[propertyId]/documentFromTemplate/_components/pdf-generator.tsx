import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink, // Importa PDFDownloadLink
} from "@react-pdf/renderer";
import { convert } from "html-to-text";
import { Button } from "@/components/ui/button";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontSize: 12,
  },
});

// Componente para generar el enlace de descarga
const PdfGenerator = ({
  content,
  title,
}: {
  content: string;
  title?: string;
}) => {
  const options = {
    wordwrap: 130,
    // ...
  };
  // const html = "<div>Hello World</div>";
  const text = convert(content, options);

  return (
    <Button>
      <PDFDownloadLink
        document={
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text>{text}</Text>
              </View>
            </Page>
          </Document>
        }
        fileName={`${title}.pdf` || "documento.pdf"} // Nombre del archivo PDF descargable
        // style={{
        //   textDecoration: "none",
        //   padding: "10px",
        //   color: "#4a4a4a",
        //   border: "1px solid #4a4a4a",
        //   borderRadius: "5px",
        // }} // Estilos opcionales para el enlace
      >
        {({ blob, url, loading, error }) =>
          loading ? "Cargando documento..." : "Descargar PDF"
        }
      </PDFDownloadLink>
    </Button>
  );
};

export default PdfGenerator;

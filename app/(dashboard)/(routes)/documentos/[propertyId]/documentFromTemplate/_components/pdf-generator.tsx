/* eslint-disable jsx-a11y/alt-text */
"use client";

import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from "@react-pdf/renderer";
import htmlParser from "html-react-parser";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Registrar la fuente en varios pesos (normal y bold)
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf",
      fontStyle: "normal",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontStyle: "normal",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  section: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 135,
    paddingBottom: 150,
    paddingHorizontal: 15,
  },
  text: {
    margin: 12,
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 15,
    textAlign: "justify",
    fontFamily: "Roboto",
  },
  boldText: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  imageHeader: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  imageFooter: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});

// Función para convertir el HTML en un árbol de elementos de react-pdf
const convertHtmlToPdfText = (html: string) => {
  const elements = htmlParser(html);

  // Procesar el HTML para manejar etiquetas como <strong>
  const processElement = (element: any) => {
    if (typeof element === "string") {
      return <Text>{element}</Text>;
    }

    if (element.type === "strong") {
      return (
        <Text style={styles.boldText}>
          {element.props.children}
        </Text>
      );
    }

    // Si es otro tipo de elemento, lo procesamos recursivamente
    if (element.props && element.props.children) {
      return (
        <Text>
          {React.Children.map(
            element.props.children,
            processElement
          )}
        </Text>
      );
    }

    return null;
  };

  return React.Children.map(elements, processElement);
};

// Componente para generar el enlace de descarga
const PdfGenerator = ({
  content,
  title,
  disabled = false,
}: {
  content: string;
  title?: string;
  disabled?: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Asegurar que solo se renderiza en el cliente
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (!isClient) {
    return null; // Evita renderizar en el servidor
  }
  return (
    <Button disabled={disabled}>
      <PDFDownloadLink
        document={
          <Document>
            <Page size="A4" style={styles.section}>
              <Image
                fixed
                style={styles.imageHeader}
                src="https://res.cloudinary.com/dea89zeui/image/upload/v1712927677/1_gtn9pp.jpg"
              />
              {/* Convierte el HTML a texto con negritas */}
              <View style={styles.text}>
                {convertHtmlToPdfText(content)}
              </View>
              <Image
                style={styles.imageFooter}
                fixed
                src="https://res.cloudinary.com/dea89zeui/image/upload/v1712927677/2_f8vmhi.jpg"
              />
            </Page>
          </Document>
        }
        fileName={`${title}.pdf` || "documento.pdf"} // Nombre del archivo PDF descargable
      >
        {({ blob, url, loading, error }) =>
          loading ? "Cargando documento..." : "Descargar PDF"
        }
      </PDFDownloadLink>
    </Button>
  );
};

export default PdfGenerator;

// /* eslint-disable jsx-a11y/alt-text */
// "use client";

// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFDownloadLink,
//   Image,
//   Font,
// } from "@react-pdf/renderer";
// import { convert } from "html-to-text";
// import { Button } from "@/components/ui/button";

// Font.register({
//   family: "Roboto",
//   src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf",
//   fontStyle: "normal",
//   fontWeight: "bold",
// });

// const styles = StyleSheet.create({
//   section: {
//     flexDirection: "column",
//     backgroundColor: "#FFFFFF",
//     paddingTop: 135,
//     paddingBottom: 150,
//     paddingHorizontal: 15,
//   },
//   text: {
//     margin: 12,
//     fontSize: 11,
//     paddingTop: 35,
//     paddingBottom: 65,
//     paddingHorizontal: 15,
//     textAlign: "justify",
//     fontFamily: "Roboto",
//   },
//   imageHeader: {
//     position: "absolute",
//     top: 30,
//     left: 0,
//     right: 0,
//     textAlign: "center",
//   },
//   imageFooter: {
//     position: "absolute",
//     bottom: 30,
//     left: 0,
//     right: 0,
//     textAlign: "center",
//   },
// });

// // Componente para generar el enlace de descarga
// const PdfGenerator = ({
//   content,
//   title,
// }: {
//   content: string;
//   title?: string;
// }) => {
//   const options = {
//     wordwrap: null,
//     // ...
//   };

//   console.log(content);
//   // const html = "<div>Hello World</div>";
//   const text = convert(content, options);

//   console.log(text);

//   return (
//     <Button>
//       <PDFDownloadLink
//         document={
//           <Document>
//             <Page size="A4" style={styles.section}>
//               <Image
//                 fixed
//                 style={styles.imageHeader}
//                 src="https://res.cloudinary.com/dea89zeui/image/upload/v1712927677/1_gtn9pp.jpg"
//               />
//               {/* <View> */}
//               <Text style={styles.text}>{text}</Text>
//               {/* </View> */}
//               <Image
//                 style={styles.imageFooter}
//                 fixed
//                 src="https://res.cloudinary.com/dea89zeui/image/upload/v1712927677/2_f8vmhi.jpg"
//               />
//             </Page>
//           </Document>
//         }
//         fileName={`${title}.pdf` || "documento.pdf"} // Nombre del archivo PDF descargable
//       >
//         {({ blob, url, loading, error }) =>
//           loading ? "Cargando documento..." : "Descargar PDF"
//         }
//       </PDFDownloadLink>
//     </Button>
//   );
// };

// export default PdfGenerator;
/* eslint-disable jsx-a11y/alt-text */

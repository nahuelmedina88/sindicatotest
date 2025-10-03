// components/helpers/docxHelper.js
import {
  WidthType,
  Document,
  TextRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  AlignmentType,
  HeadingLevel,
} from "docx";

// Export as async para poder usar await adentro
export const getDocx = async (employees, type) => {
  // Evitar ejecutar en SSR (Next server) para que no rompa
  if (typeof window === "undefined") return;

  const fuente = "Calibri";
  const fontsize = 22;
  const TABLE_WIDTH = 10000;
  const ordenw = 550;
  const afiliadow = 850;
  const apellidow = 2500;
  const documentow = 1400;
  const empresaw = 2400;
  const firmaw = 2200;

  // ---- Cabecera de tabla ----
  const tableHeader = new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: ordenw, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Nro Orden", bold: true, font: fuente, size: 16 })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            width: { size: afiliadow, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Nro de afiliado", font: fuente, size: fontsize })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            width: { size: apellidow, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Apellido y Nombre", font: fuente, size: fontsize })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            width: { size: documentow, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Nro Documento", bold: true, font: fuente, size: 16 })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            width: { size: empresaw, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Empresa", font: fuente, size: fontsize })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            width: { size: firmaw, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: type === "confirma" || type === "Con Firma" ? "Firma" : "Domicilio Empresa",
                    font: fuente,
                    size: fontsize,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
      }),
    ],
  });

  // ---- Filas de empleados ----
  const rows = [];
  let i = 1;
  employees.forEach((employee) => {
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: i.toString(), font: fuente, size: fontsize })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: employee.nroLegajo.toString(), font: fuente, size: fontsize })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: employee.apellido.toUpperCase() + ", " + employee.nombre,
                    font: fuente,
                    size: fontsize,
                  }),
                ],
                heading:
                  employee.nroLegajo.toString().length > 38
                    ? HeadingLevel.HEADING_2
                    : HeadingLevel.HEADING_4,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: buildingDNI(employee.dni.toString()), font: fuente, size: fontsize })],
                heading: HeadingLevel.HEADING_3,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: employee.empresa.nombre, font: fuente, size: fontsize })],
                heading: HeadingLevel.HEADING_3,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: type === "confirma" || type === "Con Firma" ? "" : employee.empresa.ciudad,
                    font: fuente,
                    size: fontsize,
                  }),
                ],
                heading: HeadingLevel.HEADING_3,
              }),
            ],
          }),
        ],
      })
    );
    i += 1;
  });

  const tableBody = new Table({ rows });

  // ---- Títulos / leyendas ----
  const date = new Date();
  const textConFirma = type === "confirma" || type === "Con Firma" ? "Firma" : "";

  const isPadronGeneral = (emps) => {
    const cantidadEmpresas = emps.reduce((acc, emp) => {
      const nombre = emp.empresa.nombre;
      acc[nombre] = (acc[nombre] || 0) + 1;
      return acc;
    }, {});
    return Object.values(cantidadEmpresas).length > 1;
  };

  let textLegend = "";
  let fileName = "";

  if (isPadronGeneral(employees)) {
    textLegend = "PADRON GENERAL - " + date.getFullYear().toString();
    fileName = "Padron General - " + date.getFullYear().toString() + " " + textConFirma;
  } else {
    const company = employees.map((e) => e.empresa.nombre);
    const city = employees.map((e) => e.empresa.ciudad);
    textLegend =
      "ZONA OESTE- PERTENECIENTE A " +
      company[0].toUpperCase() +
      " - " +
      city[0].toUpperCase() +
      " " +
      date.getFullYear().toString();
    fileName =
      company[0].charAt(0).toUpperCase() +
      company[0].slice(1) +
      " - " +
      date.getFullYear().toString() +
      " " +
      textConFirma;
  }

  const title1 = new Paragraph({
    children: [
      new TextRun({
        text: "LISTADO DE AFILIADOS AL SINDICATO DE TRABAJADORES DE LA CARNE DEL GRAN BS.AS.",
        bold: true,
        allCaps: true,
        font: "Times New Roman",
        size: 16,
        underline: {},
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  const space = new Paragraph({ children: [new TextRun({ text: "" })], alignment: AlignmentType.CENTER });

  const title2 = new Paragraph({
    children: [
      new TextRun({
        text: textLegend,
        bold: true,
        allCaps: true,
        font: "Times New Roman",
        size: 16,
        underline: {},
      }),
    ],
    alignment: AlignmentType.CENTER,
  });

  // ---- Document con sections ----
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: { spacing: { before: 90, after: 90 } },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: { spacing: { before: 90, after: 90 }, indent: { left: 90 } },
        },
        {
          id: "Heading4",
          name: "Heading 4",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: { spacing: { before: 10, after: 10 }, indent: { left: 90 } },
        },
      ],
    },
    sections: [
      {
        children: [title1, space, title2, space, tableHeader, tableBody],
      },
    ],
  });

  // Generar y descargar (solo en cliente)
  const blob = await Packer.toBlob(doc);

  // --- FIX: soportar default o named export ---
  const FileSaverMod = await import("file-saver");
  const saveAs = FileSaverMod?.default || FileSaverMod?.saveAs;
  if (typeof saveAs !== "function") {
    // fallback muy defensivo por si algún bundler cambia la forma de exportar
    throw new Error("No se pudo resolver 'saveAs' desde 'file-saver'.");
  }
  saveAs(blob, `${fileName}.docx`);
};

// util
const buildingDNI = (dni) => {
  const longitud = dni.length;
  let a = "", b = "", c = "";

  if (longitud === 8) {
    a = dni.slice(0, 2); b = dni.slice(2, 5); c = dni.slice(5, 8);
  } else if (longitud === 7) {
    a = dni.slice(0, 1); b = dni.slice(1, 4); c = dni.slice(4, 7);
  } else if (longitud === 9) {
    a = dni.slice(0, 3); b = dni.slice(3, 6); c = dni.slice(6, 9);
  } else {
    return dni; // fallback
  }
  return `${a}.${b}.${c}`;
};

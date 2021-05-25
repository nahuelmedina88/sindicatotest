import { saveAs } from "file-saver";
import { WidthType, Document, TextRun, Packer, Paragraph, Table, TableCell, TableRow, VerticalAlign, AlignmentType, HeadingLevel } from "docx";


export const DocxCreateSchoolSuppliesList = (emp, type) => {
    let employees = emp.filter(e => e.entregado.anio === new Date().getFullYear() && e.entregado.checked === false);
    const fuente = "Calibri";
    const fontsize = 22;
    const TABLE_WIDTH = 10000;
    const ordenw = 550;
    const afiliadow = 850;
    const apellidow = 2500;
    const documentow = 1400;
    const empresaw = 2400;
    const firmaw = 2200;

    const getAmountKitByWorkerPrimaryOne = (dni, callItFrom) => {
        let cantidad = employees.reduce((acc, worker) => {
            if (worker.dni === dni) {
                worker.familia.map(familiar => {
                    familiar.kit_escolar && familiar.kit_escolar.map(kit => {
                        if (callItFrom === "Primario 1ro 3ro" &&
                            kit.anio === new Date().getFullYear() &&
                            kit.tipo === "Primario 1ro 3ro") {
                            acc = acc + 1;
                        }
                    });
                });
            }
            return acc;
        }, 0);
        return cantidad;
    }
    const getAmountKitByWorkerPrimaryTwo = (dni, callItFrom) => {
        let cantidad = employees.reduce((acc, worker) => {
            if (worker.dni === dni) {
                worker.familia.map(familiar => {
                    familiar.kit_escolar && familiar.kit_escolar.map(kit => {
                        if (callItFrom === "Primario 4to 6to" &&
                            kit.anio === new Date().getFullYear() &&
                            kit.tipo === "Primario 4to 6to") {
                            acc = acc + 1;
                        }
                    });
                });
            }
            return acc;
        }, 0);
        return cantidad;
    }
    const getAmountKitByWorkerSecondary = (dni, callItFrom) => {
        let cantidad = employees.reduce((acc, worker) => {
            if (worker.dni === dni) {
                worker.familia.map(familiar => {
                    familiar.kit_escolar && familiar.kit_escolar.map(kit => {
                        if (callItFrom === "Secundario" &&
                            kit.anio === new Date().getFullYear() &&
                            kit.tipo === "Secundario") {
                            acc = acc + 1;
                        }
                    });
                });
            }
            return acc;
        }, 0);
        return cantidad;
    }
    const getAmountKitByWorkerEspecial = (dni, callItFrom) => {
        let cantidad = employees.reduce((acc, worker) => {
            if (worker.dni === dni) {
                worker.familia.map(familiar => {
                    familiar.kit_escolar && familiar.kit_escolar.map(kit => {
                        if (callItFrom === "Especial" &&
                            kit.anio === new Date().getFullYear() &&
                            kit.tipo === "Especial") {
                            acc = acc + 1;
                        }
                    });
                });
            }
            return acc;
        }, 0);
        return cantidad;
    }

    const getClothesSchoolByWorker = (dni) => {
        let guardapolvos = [];
        employees.map(worker => {
            if (worker.dni === dni) {
                worker.familia.map(familiar => {
                    familiar.talle && familiar.talle.map(guardapolvo => {
                        if (guardapolvo.anio === new Date().getFullYear()) {
                            guardapolvos.push(guardapolvo.numero);
                        }
                    });
                });
            };
        });
        let cadena = guardapolvos.reduce((acc, i) => {
            acc = (acc || "") + "T. " + i.toString() + " ";
            return acc;
        }, "");

        return cadena;
    }

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    paragraph: {
                        spacing: {
                            before: 90,
                            after: 90
                        },
                    },
                },
                {
                    id: "Heading3",
                    name: "Heading 3",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    paragraph: {
                        spacing: {
                            before: 90,
                            after: 90,
                        },
                        indent: {
                            left: 90,
                        },
                    },
                },
                {
                    id: "Heading4",
                    name: "Heading 4",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    paragraph: {
                        spacing: {
                            before: 10,
                            after: 10,
                        },
                        indent: {
                            left: 90,
                        },
                    },
                },
            ]
        }

    });

    let table = new Table({
        width: {
            size: [TABLE_WIDTH],
            type: WidthType.DXA,
        },
        rows: [
            new TableRow({
                tableHeader: true,
                height: 800,
                children: [
                    new TableCell({
                        width: {
                            size: [afiliadow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Nro de afiliado",
                                        // bold: true,
                                        font: fuente,
                                        size: fontsize,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [apellidow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Apellido y Nombre",
                                        // bold: true,
                                        font: fuente,
                                        size: fontsize,
                                        // allCaps: true,
                                    })
                                ],
                                heading: HeadingLevel.HEADING_2,
                                alignment: AlignmentType.CENTER,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [documentow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Nro Documento",
                                        bold: true,
                                        font: fuente,
                                        size: 16,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [documentow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "1ro a 3ro",
                                        bold: true,
                                        font: fuente,
                                        size: 18,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [documentow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "4to a 6to",
                                        bold: true,
                                        font: fuente,
                                        size: 18,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [documentow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Secundario",
                                        bold: true,
                                        font: fuente,
                                        size: 18,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [documentow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Especial",
                                        bold: true,
                                        font: fuente,
                                        size: 18,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [documentow],
                            type: WidthType.DXA,
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Guardapolvo",
                                        bold: true,
                                        font: fuente,
                                        size: 18,
                                        // allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                heading: HeadingLevel.HEADING_2,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: [firmaw],
                            type: WidthType.DXA,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Firma",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                            heading: HeadingLevel.HEADING_2,
                        })],
                    }),
                ],
                verticalAlign: VerticalAlign.CENTER
            }),
        ],
    });

    let rows = [];
    let i = 1;
    employees.map(employee => {
        console.log(employee);
        let CantidadKitsPrimarioUno = getAmountKitByWorkerPrimaryOne(employee.dni, "Primario 1ro 3ro");
        let guardapolvos = getClothesSchoolByWorker(employee.dni);

        let row = new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: employee.nroLegajo.toString(),
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                            heading: HeadingLevel.HEADING_2,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: employee.apellido.toUpperCase() + ", " + employee.nombre,
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: employee.nroLegajo.toString().length > 38 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_4
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: buildingDNI(employee.dni.toString()),
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: CantidadKitsPrimarioUno.toString() === "0" ? "" :
                                        CantidadKitsPrimarioUno.toString() + " KIT",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: getAmountKitByWorkerPrimaryTwo(employee.dni, "Primario 4to 6to").toString() === "0" ?
                                        "" :
                                        getAmountKitByWorkerPrimaryTwo(employee.dni, "Primario 4to 6to").toString() + " KIT",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: getAmountKitByWorkerSecondary(employee.dni, "Secundario").toString() === "0" ? "" : getAmountKitByWorkerSecondary(employee.dni, "Secundario").toString() + " KIT",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: getAmountKitByWorkerEspecial(employee.dni, "Especial").toString() === "0" ? "" : getAmountKitByWorkerEspecial(employee.dni, "Especial").toString() + " KIT",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: guardapolvos ? guardapolvos : "",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "",
                                    // bold: true,
                                    font: fuente,
                                    size: fontsize,
                                    // allCaps: true,
                                })
                            ],
                            heading: HeadingLevel.HEADING_3,
                        })
                    ],
                }),
            ],

        });
        rows.push(row);
        i = i + 1;
    });
    const IsPadronGeneral = (employees) => {
        let cantidadEmpresas = employees.reduce((contarEmpresas, empleado) => {
            let emp = empleado.empresa.nombre;
            contarEmpresas[emp] = (contarEmpresas[emp] || 0) + 1;
            return contarEmpresas;
        }, {});
        let isPadronGeneral = false;
        let arr = Object.values(cantidadEmpresas);
        if (arr.length > 1) {
            isPadronGeneral = true;
        }
        return isPadronGeneral;
    }

    let textLegend = "";
    let fileName = "";
    let date = new Date();
    let textConFirma = "";
    type === "confirma" ? textConFirma = "Firma" : textConFirma = "";

    if (IsPadronGeneral(employees)) {
        textLegend = "PADRÓN GENERAL - ENTREGA DE ÚTILES ESCOLARES " + date.getFullYear().toString();
        fileName = "Entrega de útiles escolares por Padrón General - " + date.getFullYear().toString() + " " + textConFirma;
    } else {
        let company = employees.map(empleado => empleado.empresa.nombre);
        let city = employees.map(empleado => empleado.empresa.ciudad);
        textLegend = "ZONA OESTE - PERTENECIENTE A " + company[0].toUpperCase() + " - " + city[0].toUpperCase() + " - ENTREGA DE UTILES ESCOLARES " + date.getFullYear().toString();
        fileName = company[0].charAt(0).toUpperCase() + company[0].slice(1) + " - Entrega de Útiles Escolares - " + date.getFullYear().toString() + " " + textConFirma;
    }

    let table2 = new Table({
        rows: rows
    });

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
    const space = new Paragraph({
        children: [
            new TextRun({
                text: "",
                bold: true,
                allCaps: true,
                font: "Times New Roman",
                size: 16,
                underline: {},
            }),
        ],
        alignment: AlignmentType.CENTER,
    });

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

    doc.addSection({
        children: [title1, space, title2, space, table, table2],
    });

    Packer.toBlob(doc).then(blob => {
        console.log(blob);
        saveAs(blob, fileName + ".docx");
    });
}

const buildingDNI = (dni) => {
    let longitud = dni.length;
    let newstring = "";
    let newstring2 = "";
    let newstring3 = "";
    if (longitud === 8) {
        newstring = dni.slice(0, 2);
        newstring2 = dni.slice(2, 5);
        newstring3 = dni.slice(5, 8);
    }
    if (longitud === 7) {
        newstring = dni.slice(0, 1);
        newstring2 = dni.slice(1, 4);
        newstring3 = dni.slice(4, 7);
    }
    if (longitud === 9) {
        newstring = dni.slice(0, 3);
        newstring2 = dni.slice(3, 6);
        newstring3 = dni.slice(6, 9);
    }
    let result = newstring + "." + newstring2 + "." + newstring3;
    return result;
}

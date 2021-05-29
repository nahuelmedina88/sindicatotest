import React, { useEffect, useContext, useState } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/SchoolSuppliesReport.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction } from "../components/redux/actions/EmployeeActions";

//Firebase
import { FirebaseContext } from "../firebase";

import { AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import '../node_modules/react-vis/dist/style.css';
import {
    FlexibleXYPlot,
    XYPlot,
    LineSeries,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    RadialChart,
    DiscreteColorLegend,
    Hint,
    XAxis,
    YAxis
} from 'react-vis';


const SchoolSuppliesReport = () => {
    const [dataKit, setDataKit] = useState("");
    const [dataGuardapolvo, setDataGuardapolvo] = useState("");
    const [dataPie, setDataPie] = useState([]);
    let employeesSelector = useSelector(state => state.employees.employees);
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);
    const [hintValue, setHintValue] = useState("");

    const getData = (array) => {
        let objArray = "";
        if (array === "Guardapolvo") {
            objArray = employeesSelector.map(empleado => {
                let cantidadDeGuardapolvosPorEmpleado = empleado.familia && empleado.familia.reduce((contarGuardapolvos, familiar) => {
                    let ultimoItem = familiar.talle && familiar.talle.length - 1;
                    let guardapolvoIndice = familiar.talle[ultimoItem] && familiar.talle[ultimoItem].numero.toString() || null;
                    //Si ContarGUardapolvos[g] no existe entonces asigna 0
                    contarGuardapolvos[guardapolvoIndice] = (contarGuardapolvos[guardapolvoIndice] || 0) + 1;
                    return contarGuardapolvos;
                }, {});
                return cantidadDeGuardapolvosPorEmpleado;
            });
        } else {
            objArray = employeesSelector.map(empleado => {
                let cantidadDeKitsPorEmpleado = empleado.familia && empleado.familia.reduce((contarKits, familiar) => {
                    let ultimoItem = familiar.kit_escolar && familiar.kit_escolar.length - 1;
                    let indice = familiar.kit_escolar[ultimoItem] && familiar.kit_escolar[ultimoItem].tipo || null;
                    //Si ContarGUardapolvos[g] no existe entonces asigna 0
                    contarKits[indice] = (contarKits[indice] || 0) + 1;
                    return contarKits;
                }, {});
                return cantidadDeKitsPorEmpleado;
            });
        }
        console.log(objArray);
        let objArray2 = objArray.filter(x => x !== undefined);

        let lastCantidad = objArray2.reduce((contador, obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                let indice = key && key || null;
                contador[indice] = value > 1 ? (contador[indice] + value || 0 + value) : (contador[indice] || 0) + 1;
            });
            return contador;
        }, {});
        delete lastCantidad.null;
        let guardapolvos = Object.keys(lastCantidad);
        let cantidad = Object.values(lastCantidad);
        let newData = [];
        guardapolvos.map((item, idx) => {
            newData.push({ x: item, y: cantidad[idx] })
        });
        array === "Guardapolvo" ? setDataGuardapolvo(newData) : setDataKit(newData);
    }

    const isObjEmpty = (obj) => {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) return false;
        }
        return true;
    }

    const getDataDelivered = () => {
        let cantidadEntregado = 0;
        let cantidadNoEntregado = 0;
        employeesSelector.map((empleado) => {
            cantidadEntregado = empleado.entregado &&
                empleado.entregado.checked === true &&
                empleado.entregado.anio === new Date().getFullYear() ?
                cantidadEntregado + 1 : cantidadEntregado;
            cantidadNoEntregado = empleado.entregado &&
                empleado.entregado.checked === false &&
                empleado.entregado.anio === new Date().getFullYear() ?
                cantidadNoEntregado + 1 : cantidadNoEntregado;
        });

        //Determinar la cantidad de trabajadores con falta de documentación teniendo
        //los guardapolvos y los kit escolares sabidos y que no esten entregados.
        // let cantidadSinDocumentacion = 0;
        // employeesSelector.map(empleado => {
        //     if (empleado && !isObjEmpty(empleado.entregado) && empleado.entregado.checked === false) {
        //         let arrOfChecks = [];
        //         empleado.familia && empleado.familia.map(familiar => {
        //             let kit = familiar.kit_escolar && familiar.kit_escolar[familiar.kit_escolar.length - 1] || 1;
        //             let guardapolvo = familiar.talle && familiar.talle[familiar.talle.length - 1] || 1;
        //             let doc = familiar.documentacion && familiar.documentacion[familiar.documentacion.length - 1] || 1;
        //             if (kit && kit.tipo && kit.anio === new Date().getFullYear() &&
        //                 guardapolvo && guardapolvo.numero && guardapolvo.anio === new Date().getFullYear() &&
        //                 doc && !doc.url) {
        //                 arrOfChecks.push(true);
        //             }
        //             else {
        //                 arrOfChecks.push(false);
        //             }
        //         });
        //         let found = arrOfChecks.find(item => item === false);
        //         if (found !== false) {
        //             cantidadSinDocumentacion = (cantidadSinDocumentacion || 0) + 1
        //         }
        //     }
        // });

        // //Determinar la cantidad de trabajadores sin tener los guardapolvos y el kit sabidos
        // //Sin tener documentacion y que no esten obviamente entregados.
        // let cantidadSinGuardapolvoOKit = 0;
        // employeesSelector.map(empleado => {
        //     if (empleado && !isObjEmpty(empleado.entregado) && empleado.entregado.checked === false) {
        //         let arrOfChecks = [];
        //         empleado.familia && empleado.familia.map(familiar => {
        //             let kit = familiar.kit_escolar && familiar.kit_escolar[familiar.kit_escolar.length - 1] || 1;
        //             let guardapolvo = familiar.talle && familiar.talle[familiar.talle.length - 1] || 1;
        //             // let doc = familiar.documentacion && familiar.documentacion[familiar.documentacion.length - 1] || 1;
        //             if (kit && kit !== 1 && kit.tipo && kit.anio === new Date().getFullYear() &&
        //                 guardapolvo && guardapolvo !== 1 && guardapolvo.numero && guardapolvo.anio === new Date().getFullYear()) {
        //                 arrOfChecks.push(false);
        //             }
        //             else {
        //                 arrOfChecks.push(true);
        //             }
        //         });
        //         let found = arrOfChecks.find(item => item === true);
        //         if (found !== true) {
        //             cantidadSinGuardapolvoOKit = (cantidadSinGuardapolvoOKit || 0) + 1
        //         }
        //     }
        // });

        console.log("Entregados: " + cantidadEntregado);
        console.log("Entregados: " + cantidadNoEntregado);
        // console.log("Sin Doc: " + cantidadSinDocumentacion);
        // console.log("Sin Guardapolvo o Kit: " + cantidadSinGuardapolvoOKit);
        // const myData = [
        //     {
        //         title: 'Entregados', count: cantidadEntregado,
        //     },
        //     {
        //         title: 'Sin Documentacion', count: cantidadSinDocumentacion,
        //     },
        //     {
        //         title: 'Sin Informacion', count: cantidadSinGuardapolvoOKit,
        //     }
        // ]
        const myData = [
            {
                title: 'Entregados', count: cantidadEntregado,
            },
            {
                title: 'Sin Entregar', count: cantidadNoEntregado,
            }
        ]
        setDataPie(myData);

    }

    const loadEmployees = (firebase) => {
        dispatch(getEmployeesActiveAction(firebase));
    }

    useEffect(() => {
        loadEmployees(firebase);
    }, []);

    useEffect(() => {
        getData("Guardapolvo");
        getData("Kit");
        getDataDelivered();
    }, [employeesSelector]);

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, []);

    const { user } = useContext(FirebaseContext);
    return (
        <Layout homepage={true}>
            <div className={styles.rowChartBar}>
                <h3>Cantidad de Guardapolvos por Talle</h3>
                <div style={{ height: '100%', width: '100%' }} className={"mb-4"}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <XYPlot height={height} width={width}
                                xType="ordinal">
                                <VerticalBarSeries data={dataGuardapolvo} color="rgb(5, 9, 126)" />
                                <XAxis />
                                <YAxis />
                            </XYPlot>
                        )}
                    </AutoSizer>
                </div>
            </div>
            <div className={styles.rowChartBar}>
                <h3>Cantidad de Kit Escolares por Tipo</h3>
                <div style={{ height: '100%', width: '100%' }} className={"mb-4"}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <XYPlot height={height} width={width}
                                xType="ordinal">
                                <VerticalBarSeries data={dataKit} color="rgb(11, 76, 14)" />
                                <XAxis />
                                <YAxis />
                            </XYPlot>
                        )}
                    </AutoSizer>
                </div>
            </div >

            <div className={styles.rowChartBar}>
                <h3>Total Entregas</h3>
                <div style={{ height: '100%', width: '100%' }} >
                    <AutoSizer>
                        {({ height, width }) => (
                            <RadialChart
                                data={dataPie}
                                width={width}
                                height={height}
                                innerRadius={20}
                                radius={90}
                                getAngle={d => d.count}
                                getLabel={d => d.count}
                                showLabels
                                onValueMouseOver={v => setHintValue({ value: v })}
                                onSeriesMouseOut={v => setHintValue({ value: false })}
                            >
                                {/* {hintValue !== false &&
                                    <Hint value={hintValue.value}>
                                        <div style={{ fontSize: 20, color: '#111' }}>
                                            {hintValue.value.title}
                                        </div>
                                    </Hint>} */}
                            </RadialChart>
                        )}

                    </AutoSizer>
                </div>
                <div style={{ height: '100%', width: '100%' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <DiscreteColorLegend
                                width={width}
                                height={height}
                                items={dataPie.map(d => d.title)} />
                        )}

                    </AutoSizer>
                </div>
            </div>
        </Layout >

    );
}

export default SchoolSuppliesReport;
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout";

const Graph = () => {
    // const getAmountEmployeesByCompany = (employees) => {
    const empleados = useSelector(state => state.employees.employees);

    let cantidadEmpresas = empleados.reduce((contarEmpresas, empleado) => {
        let emp = empleado.empresa.nombre;
        contarEmpresas[emp] = (contarEmpresas[emp] || 0) + 1;
        return contarEmpresas;
    }, {});

    let empresas = Object.keys(cantidadEmpresas);
    let cantidad = Object.values(cantidadEmpresas);
    const data = {
        labels: empresas,
        datasets: [
            {
                label: 'Empleados Frigorificos',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: cantidad
            }
        ]
    };
    let screenSize = 0;
    if (process.browser) {
        screenSize = window.screen.width;
    }

    return (<>
        <Layout>
            <div>
                <h2>Cantidad de Empleados</h2>
                <Bar
                    data={data}

                    width={(screenSize > 480) ? 500 : null}
                    height={(screenSize > 480) ? 200 : null}
                    options={{
                        maintainAspectRatio: (screenSize > 480) ? false : true
                    }}
                />
            </div>
        </Layout>
    </>
    );
}


export default Graph;   
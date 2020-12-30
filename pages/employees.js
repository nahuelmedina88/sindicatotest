import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from "next/router";
import Image from 'next/image';
import styles from "./css/employees.module.scss";

import EmployeeList from "../components/EmployeeList";
// import { getDocx } from "./docxHelper"

import Layout from '../components/layout/Layout';
import Login from "./login";

//Font Awesome
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';


//Redux
import { getEmployeesAction } from "../components/redux/actions/EmployeeActions";
import { updateEmployeesAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";

//Firebase
import { FirebaseContext } from "../firebase";
// import { TableProperties } from 'docx';

const Employees = () => {

    // const generate = (e) => {
    //     e.preventDefault();
    //     getDocx(employees);
    // }
    // const [employeesToShow, setEmployeesToShow] = useState([]);
    const [searchEmployee, setSearchEmployee] = useState("");
    const employeesSelector = useSelector(state => state.employees.employees);
    const employeesRedux = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    // const employeesRedux = deleteDuplicate(employeesReduxSorted);

    const employeesSearch = useSelector(state => state.employees.employeesSearch);
    // const [employees, setEmployees] = useState("");
    // const companies = useSelector(state => state.companies.companies);
    const loading = useSelector(state => state.employees.loading);
    const dispatch = useDispatch();
    const { firebase, user } = useContext(FirebaseContext);

    const router = useRouter();

    useEffect(() => {
        router.pathname === "/" ? router.push("/employees") : null;
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        const loadEmployees = (firebase) => dispatch(getEmployeesAction(firebase));
        const loadCompanies = (firebase) => dispatch(getCompaniesAction(firebase));
        loadPathname();
        loadEmployees(firebase);
        loadCompanies(firebase);
    }, []);

    const searchHandle = (e) => {
        let searching = e.target.value;
        let emp1 = [];
        if (!searching) dispatch(updateEmployeesAction(emp));

        let nroLegajo = employeesRedux.filter(emp => emp.nroLegajo.toString().includes(searching));
        let apellido = employeesRedux.filter(emp => emp.apellido.toLocaleLowerCase().includes(searching.toLocaleLowerCase()));
        let nombre = employeesRedux.filter(emp => emp.nombre.toLocaleLowerCase().includes(searching.toLocaleLowerCase()));
        let dni = employeesRedux.filter(emp => emp.dni.toString().includes(searching));
        let empresa = employeesRedux.filter(emp => emp.empresa.nombre.toLocaleLowerCase().includes(searching));

        emp1 = nroLegajo.concat(apellido);
        emp1 = emp1.concat(nombre);
        emp1 = emp1.concat(dni);
        emp1 = emp1.concat(empresa);

        const emp = emp1.reduce((acc, item) => {
            if (!acc.includes(item)) {
                acc.push(item);
            }
            return acc;
        }, [])
        emp.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));

        const updateEmployees = (emp) => {
            dispatch(updateEmployeesAction(emp));
        }

        updateEmployees(emp);
        setSearchEmployee(e.target.value);
    }

    return (
        <>
            {user ?
                <Layout>
                    {loading ?
                        <Image
                            src="/img/loading.gif"
                            alt="loading"
                            width={100}
                            height={100}
                        ></Image>
                        :
                        <div className={styles.absCenterSelf}>
                            {/* <i class="fas fa-search" aria-hidden="true"></i> */}
                            <div className={styles.searchBox}>
                                {/* <FontAwesomeIcon icon={faSearch} className={styles.icon} /> */}

                                <input
                                    className={`input ${styles.myInput}`}
                                    type="text"
                                    name="searchEmployee"
                                    placeholder="Buscar"
                                    onChange={searchHandle}
                                    value={searchEmployee}
                                    aria-label="Buscar"
                                />
                                <svg className={styles.icon}>
                                    <use xlinkHref="img/sprite.svg#icon-search"></use>
                                </svg>
                            </div>
                            {/* <button onClick={generate}>Generar docx</button> */}
                            < table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Nro Legajo</th>
                                        <th scope="col">Apellido</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">DNI</th>
                                        <th scope="col">Empresa</th>
                                    </tr>
                                </thead>
                                {searchEmployee ?
                                    <tbody>
                                        {employeesSearch.length === 0 ? "No hay resultados" :
                                            employeesSearch.map(employee => (
                                                <EmployeeList
                                                    key={employee.id}
                                                    employee={employee}
                                                />
                                            ))
                                        }
                                    </tbody>
                                    :
                                    <tbody>
                                        {employeesRedux.length === 0 ? "No hay resultados" :
                                            employeesRedux.map(employee => (
                                                <EmployeeList
                                                    key={employee.id}
                                                    employee={employee}
                                                />
                                            ))
                                        }
                                    </tbody>
                                }
                            </table >
                        </div>
                    }
                </Layout >
                : <Login />}
        </>
    );
}

export default Employees;
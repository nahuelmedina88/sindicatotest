import React, { useState } from 'react';

//Redux
import { useDispatch } from "react-redux";
import { updateEmployeesAction } from "../../components/redux/actions/EmployeeActions";

//Styles
import styles from "./css/Search.module.scss";

const Search = ({ employeesRedux, getSearchTextBox, company }) => {
    const [searchEmployee, setSearchEmployee] = useState("");
    const dispatch = useDispatch();

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
        }, []);
        const updateEmployees = (emp3) => {
            dispatch(updateEmployeesAction(emp3));
        }
        let emp3 = "";
        if (company === "Padrón General" || !company) {
            emp.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
            updateEmployees(emp);
        } else {
            emp3 = emp.filter(item => item.empresa.nombre === company);
            emp3.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
            updateEmployees(emp3);
        }
        setSearchEmployee(e.target.value);
        getSearchTextBox(e.target.value);
    }

    return (
        <>
            <div className={styles.searchBox}>
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
        </>
    );
}

export default Search;
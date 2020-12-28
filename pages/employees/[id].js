import React, { useContext, useEffect, useState } from 'react';
import styles from "../css/[id].module.scss";
import { useDispatch, useSelector } from "react-redux";
import { editEmployeeAction } from "../../components/redux/actions/EmployeeActions";
import Select from 'react-select';
// import { useHistory } from "react-router-dom";
import { useRouter } from "next/router";
import { getCompaniesAction } from "../../components/redux/actions/CompanyActions";
// import history from "../history";
//Firebase
import { FirebaseContext } from "../../firebase";
import Layout from '../../components/layout/Layout';

const EditEmployee = () => {
    const [employee, setEmployee] = useState({
        nroLegajo: 0,
        nombre: "",
        apellido: "",
        dni: 0,
        empresa: []
    });
    const [comp, setComp] = useState([]);

    const [companies, updateCompanies] = useState([]);

    const employeeToEdit = useSelector(state => state.employees.employeeToEdit);
    const companiesSelector = useSelector(state => state.companies.companies);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const loadCompanies = firebase => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
        const companiesSelect = companiesSelector.map(company => ({
            id: company.id,
            value: company.id,
            label: company.nombre,
            ciudad: company.ciudad
        }));
        if (employeeToEdit) {
            const companySelected = {
                id: employeeToEdit.empresa.id,
                value: employeeToEdit.empresa.id,
                label: employeeToEdit.empresa.nombre,
                ciudad: employeeToEdit.empresa.ciudad
            }
            updateCompanies(companiesSelect);
            setComp(companySelected);
        }
        setEmployee(employeeToEdit);

    }, [employeeToEdit]);

    const dispatch = useDispatch();
    // const history = useHistory();
    const history = useRouter();

    // if (!employee) return null;


    const submitEmployeeEdited = (e) => {
        e.preventDefault();
        console.log(e);
        //send form
        // employee.empresa = employee.empresa.id;
        console.log("Empleado antes de editar: ");
        dispatch(editEmployeeAction(employee, firebase));

        history.push("/employees");
        // history.go(0);
    }

    const changeForm = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    }

    const changeSelect = e => {
        console.log(e);
        setComp({
            id: e.value,
            value: e.value,
            label: e.label,
            ciudad: e.ciudad
        });
        setEmployee({
            ...employee,
            empresa: {
                id: e.value,
                nombre: e.label,
                ciudad: e.ciudad
            }
        });
    }
    //  const { nroLegajo, nombre, apellido, dni, empresa } = employee 

    return (

        <Layout>
            {employee ?
                <div className={styles.container}>
                    <h2 className={styles.title}> Editar Empleado</h2>
                    <form>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                name="nroLegajo"
                                placeholder="Nro Legajo"
                                value={employee ? employee.nroLegajo : null}
                                onChange={changeForm}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                placeholder="Nombre"
                                value={employee ? employee.nombre : null}
                                onChange={changeForm}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                name="apellido"
                                placeholder="Apellido"
                                value={employee ? employee.apellido : null}
                                onChange={changeForm}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                className="form-control"
                                name="dni"
                                placeholder="DNI"
                                value={employee ? employee.dni : null}
                                onChange={changeForm}
                            />
                        </div>
                        <div className="form-group">
                            <Select
                                // className={!arsTo ? styles.foreignCurrencyFirst : styles.foreignCurrencySecond}
                                options={companies}
                                onChange={changeSelect}
                                value={comp}
                            // components={{ Option: IconOption }}
                            ></Select>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={submitEmployeeEdited}
                        >Guardar Cambios</button>
                    </form>
                </div> : null}

        </Layout>
    );
}

export default EditEmployee;
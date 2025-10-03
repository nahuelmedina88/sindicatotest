import React, { useState, useEffect, useContext, Fragment } from 'react';
import Select from "react-select";
import WorkerListItemSchoolSupplies from "../components/WorkerListItemSchoolSupplies";

import styles from "./css/schoolSuppliesWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction, getWorkerListByCompanyAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

// Firebase
import { FirebaseContext } from "../firebase";

// Material UI
import { CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Custom
import { DocxCreateSchoolSuppliesList } from "../components/helpers/DocxCreateSchoolSuppliesList";

const SchoolSuppliesWorkerList = () => {
  const [company, setCompany] = useState("");
  const [employeesSorted, setEmployeesSorted] = useState([]); // <- array, no string
  const employeesSelector = useSelector(state => state.employees.employees);
  const employeesSearch = useSelector(state => state.employees.employeesSearch);
  const loading = useSelector(state => state.employees.loading);

  const companiesSelector = useSelector(state => state.companies.companies);
  const companiesSelect = companiesSelector.map(company => ({
    id: company.id,
    value: company.id,
    label: company.nombre,
    nombre: company.nombre,
    ciudad: company.ciudad,
    domicilio: company.domicilio
  }));
  companiesSelect.push({ id: 0, value: "Padron General", label: "Padrón General" });

  const dispatch = useDispatch();
  const { firebase, user } = useContext(FirebaseContext);

  const loadEmployees = (fb) => dispatch(getEmployeesActiveAction(fb));

  useEffect(() => {
    loadEmployees(firebase);
    dispatch(getCompaniesAction(firebase));
  }, []); // eslint-disable-line

  // Empleados que tienen al menos 1 hijo
  const getEmployeesWithChildren = () => {
    const withKids = [];
    employeesSelector?.forEach(emp => {
      emp?.familia?.forEach(f => {
        if (f?.parentesco === "Hijo/a") withKids.push(emp);
      });
    });
    // eliminar duplicados por referencia
    const unique = withKids.reduce((acc, item) => {
      if (!acc.includes(item)) acc.push(item);
      return acc;
    }, []);
    setEmployeesSorted(unique.sort((a, b) => (a.apellido > b.apellido ? 1 : (b.apellido > a.apellido ? -1 : 0))));
  };

  useEffect(() => {
    getEmployeesWithChildren();
  }, [employeesSelector]); // eslint-disable-line

  const [searchTextbox, setSearchTextBox] = useState("");
  const getSearchTextBox = (value) => setSearchTextBox(value);

  const handleChangeCompany = (option) => {
    setCompany(option.label);
    dispatch(getWorkerListByCompanyAction(employeesSorted, option.label, searchTextbox));
  };

  const generate = (e) => {
    e.preventDefault();
    // Si hay búsqueda uso employeesSearch; si no, uso la lista filtrada employeesSorted
    employeesSearch.length > 0
      ? DocxCreateSchoolSuppliesList(employeesSearch, e.target.id)
      : DocxCreateSchoolSuppliesList(employeesSorted, e.target.id);
  };

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  return (
    <Layout>
      {loading ? (
        <div><CircularProgress /></div>
      ) : (
        <Fragment>
          <div className={styles.absCenterSelf}>
            <div className={styles.searchExportParent}>
              <Search
                employeesRedux={employeesSorted}
                getSearchTextBox={getSearchTextBox}
                company={company}
              />
              <Button
                onClick={generate}
                sx={{
                  p: '0.4rem',
                  borderRadius: '5px',
                  color: '#fff',
                  bgcolor: 'rgb(195, 76, 7)',
                  '&:hover': { bgcolor: 'rgba(195, 76, 7, 0.7)' },
                }}
                className={styles.buttonExport}
              >
                Exportar
              </Button>
            </div>

            <div>
              <label>Empresa</label>
              <Select
                className={`inputSecondary ${styles.myselect}`}
                options={companiesSelect}
                name="empresa"
                defaultValue={{ label: "Padrón General", value: 0 }}
                placeholder={"Seleccione un frigorífico"}
                onChange={handleChangeCompany}
              />
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ tableLayout: 'fixed' }} aria-label="caption table">
                {!company && !searchTextbox ? (
                  employeesSorted.length > 0 ? (
                    <Fragment>
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Entregado</TableCell>
                          <TableCell align="right">Nro Legajo</TableCell>
                          <TableCell align="right">Apellido</TableCell>
                          <TableCell align="right">Nombre</TableCell>
                          <TableCell align="right">DNI</TableCell>
                          <TableCell align="right">Empresa</TableCell>
                          <TableCell align="right">Guardapolvos</TableCell>
                          <TableCell align="right">Kit Escolares</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeesSorted.map((employee) => (
                          <WorkerListItemSchoolSupplies key={employee.id} employee={employee} />
                        ))}
                      </TableBody>
                    </Fragment>
                  ) : (
                    <div className={styles.span}>No existen trabajadores</div>
                  )
                ) : (
                  employeesSearch.length > 0 ? (
                    <Fragment>
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Entregado</TableCell>
                          <TableCell align="right">Nro Legajo</TableCell>
                          <TableCell align="right">Apellido</TableCell>
                          <TableCell align="right">Nombre</TableCell>
                          <TableCell align="right">DNI</TableCell>
                          <TableCell align="right">Empresa</TableCell>
                          <TableCell align="right">Guardapolvos</TableCell>
                          <TableCell align="right">Kit Escolares</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeesSearch.map((employee) => (
                          <WorkerListItemSchoolSupplies key={employee.id} employee={employee} />
                        ))}
                      </TableBody>
                    </Fragment>
                  ) : (
                    <div className={styles.span}>No existen trabajadores</div>
                  )
                )}
              </Table>
            </TableContainer>
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

export default SchoolSuppliesWorkerList;
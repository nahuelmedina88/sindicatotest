import React, { useEffect, useContext, useState } from 'react';

import Company from "../components/Company";

import styles from "./css/generalWorkerList.module.scss";
import Layout from "../components/layout/Layout";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Fragment } from 'react';

const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
    btn: {
        padding: "0.4rem",
        borderRadius: "5px",
        textDecoration: "none",
        borderWidth: "1px",
        borderColor: "#fff",
        fontSize: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
        }
    },
    buttonClose: {
        backgroundColor: "rgb(138,7,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(138,7,7, 0.7)",
        }
    },
});


const companies = (props) => {
    const classes = useStyles(props);
    let companiesSelector = useSelector(state => state.companies.companies);
    const loading = useSelector(state => state.companies.loading);
    let companiesSorted = companiesSelector.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0));
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);

    const loadCompanies = (firebase) => {
        dispatch(getCompaniesAction(firebase));
    }

    useEffect(() => {
        loadCompanies(firebase);
    }, []);

    return (
        <>
            <Layout>
                {loading ?
                    <CircularProgress />
                    :
                    <div className={styles.absCenterSelf}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="caption table">
                                {companiesSorted.length > 0 ?
                                    <Fragment>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Nombre</TableCell>
                                                <TableCell align="right">Ciudad</TableCell>
                                                <TableCell align="right">Domicilio</TableCell>
                                                <TableCell align="right">CUIT</TableCell>
                                                <TableCell align="right">Razón Social</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {companiesSorted.map(company => (
                                                <Company
                                                    key={company.id}
                                                    company={company} />
                                            ))}
                                        </TableBody>
                                    </Fragment>
                                    : <span className={styles.span}>No hay frigoríficos</span>
                                }
                            </Table>
                        </TableContainer>
                    </div>
                }
            </Layout>
        </>
    );
}

export default companies;
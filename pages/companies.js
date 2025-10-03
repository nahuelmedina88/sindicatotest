// pages/companies.js
import React, { useEffect, useContext, Fragment } from 'react';

import Company from "../components/Company";
import styles from "./css/generalWorkerList.module.scss";
import Layout from "../components/layout/Layout";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

// Next
import Link from "next/link";

// Firebase (provider con { user, ready, ... })
import FirebaseContext from "../firebase/context";

// MUI
import { CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const btnBaseSx = {
  p: '0.4rem',
  borderRadius: '5px',
  textDecoration: 'none',
  borderWidth: '1px',
  borderColor: '#fff',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const sxSave = {
  ...btnBaseSx,
  bgcolor: 'rgb(7,138,7)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' }
};

const CompaniesPage = () => {
  const companiesSelector = useSelector(state => state.companies.companies);
  const loading = useSelector(state => state.companies.loading);

  // ⚠️ No filtramos por estado acá. Si querés, podés mostrar solo Activas,
  // pero contemplando que muchas no tienen el campo en DB.
  const companiesSorted = companiesSelector; // ya vienen ordenadas del action

  const dispatch = useDispatch();
  const { user, ready } = useContext(FirebaseContext);

  useEffect(() => {
    // Gateo simple si tus reglas Firestore requieren auth
    if (!ready) return;
    if (!user) return; // si querés redirigir, hacelo acá
    dispatch(getCompaniesAction());
  }, [dispatch, ready, user]);

  return (
    <Layout>
      {!ready ? (
        <CircularProgress />
      ) : !user ? (
        <div className={styles.absCenterSelf}>Necesitás iniciar sesión para ver Empresas.</div>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <div className={styles.absCenterSelf}>
          <TableContainer component={Paper}>
            <Table aria-label="companies table" sx={{ tableLayout: 'fixed' }}>
              {companiesSorted.length > 0 ? (
                <Fragment>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Nombre</TableCell>
                      <TableCell align="right">Ciudad</TableCell>
                      <TableCell align="right">Domicilio</TableCell>
                      <TableCell align="right">CUIT</TableCell>
                      <TableCell align="right">Razón Social</TableCell>
                      <TableCell align="right">
                        <Link href="/AddCompany">
                          <Button variant="contained" sx={sxSave}>
                            Agregar
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companiesSorted.map(company => (
                      <Company key={company.id} company={company} />
                    ))}
                  </TableBody>
                </Fragment>
              ) : (
                <caption className={styles.span} style={{ captionSide: 'top' }}>
                  No hay frigoríficos
                </caption>
              )}
            </Table>
          </TableContainer>
        </div>
      )}
    </Layout>
  );
};

export default CompaniesPage;
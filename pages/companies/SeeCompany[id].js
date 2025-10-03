// pages/companies/SeeCompany[id].js
import React, { useState } from 'react';
import styles from "../css/employee[id].module.scss";
import styles2 from "../css/SeeCompany[id].module.scss";
import { useSelector } from "react-redux";

import Layout2 from '../../components/layout/Layout2';

import {
  Box,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import Link from "next/link";

// Icons
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// estilos de botones (reemplazan makeStyles)
const btnBaseSx = {
  p: '0.4rem',
  borderRadius: '5px',
  textDecoration: 'none',
  borderWidth: '1px',
  borderColor: '#fff',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
};

const sxPurple = {
  ...btnBaseSx,
  bgcolor: 'rgb(86, 7, 138)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' },
};

const sxSave = {
  ...btnBaseSx,
  bgcolor: 'rgb(7,138,7)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' },
};

const tableSx = { minWidth: 650 };

const SeeCompany = () => {
  const companyToSee = useSelector(state => state.companies.companyToSee);
  const [value, setValue] = useState(0);

  const handleChange = (_event, newValue) => setValue(newValue);

  const getDateDDMMAAAA = (mydate) => {
    const date = new Date(mydate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dd = day;
    const mm = month < 10 ? `0${month}` : month;
    return `${dd}-${mm}-${year}`;
  };

  return (
    <>
      {companyToSee ? (
        <div>
          <Layout2>
            <div className={styles2.tabsContainer}>
              <div className={styles.headerName}>
                <span className={styles.workerName}>{companyToSee.nombre}</span>
              </div>

              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                  <Tabs value={value} onChange={handleChange} aria-label="tabs empresa">
                    <Tab label="Información Básica" {...a11yProps(0)} />
                    <Tab label="Documentos" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>

                {/* TAB 0: Info básica */}
                <TabPanel value={value} index={0}>
                  <div className={styles.bodyContainer}>
                    <div className={styles.rowBodyContainer}>
                      <div className={styles.rowBody}>
                        <span className={styles.spanIcon}><LocationOnRoundedIcon /></span>
                        <h4 className={styles.title}>Información</h4>
                        <Divider className={styles.divider} />
                        <div className={styles.itemRow}>
                          <span className={styles.title}>Domicilio</span>
                          <span className={styles.spanLabel}>
                            {companyToSee.domicilio
                              ? companyToSee.domicilio
                              : `${companyToSee.calle} ${companyToSee.numero_calle}`}
                            , {companyToSee.ciudad}
                          </span>
                        </div>

                        {/* Delegados (si existen) */}
                        {Array.isArray(companyToSee.delegados) && companyToSee.delegados.length > 0 && (
                          <div className={styles.itemRow}>
                            <span className={styles.title}>Delegados</span>
                            <span className={styles.spanLabel}>
                              {companyToSee.delegados.map((d, idx) => (
                                <div key={`${d?.dni || d?.email || idx}`}>
                                  {d?.nombre} {d?.apellido}
                                </div>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.rowBody}>
                        <span className={styles.spanIcon}><MenuBookIcon /></span>
                        <h4 className={styles.title}>Otros datos</h4>
                        <Divider className={styles.divider} />
                        <div className={styles.itemRow}>
                          <span className={styles.title}>CUIT</span>
                          <span className={styles.spanLabel}>{companyToSee.cuit}</span>
                        </div>
                        <div className={styles.itemRow}>
                          <span className={styles.title}>Teléfono</span>
                          <span className={styles.spanLabel}>{companyToSee.telefono || '-'}</span>
                        </div>
                        <div className={styles.itemRow}>
                          <span className={styles.title}>Email</span>
                          <span className={styles.spanLabel}>{companyToSee.email || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* TAB 1: Documentos */}
                <TabPanel value={value} index={1}>
                  <TableContainer component={Paper}>
                    <Table aria-label="tabla documentos" sx={tableSx}>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Tipo</TableCell>
                          <TableCell align="left">Fecha</TableCell>
                          <TableCell align="left">Enlace</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(companyToSee.documentacion || [])
                          .slice()
                          .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0))
                          .map((row, idx) => (
                            <TableRow key={`${row.url || row.tipo || idx}`}>
                              <TableCell align="left">{row.tipo}</TableCell>
                              <TableCell align="left">{row.fecha && getDateDDMMAAAA(row.fecha)}</TableCell>
                              <TableCell align="left">
                                <Button
                                  component="a"
                                  href={row.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={sxPurple}
                                >
                                  Ver Documento
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </Box>

              <Link href="/generalWorkerList">
                <Button sx={sxSave}>Volver al Padrón</Button>
              </Link>
            </div>
          </Layout2>
        </div>
      ) : null}
    </>
  );
};

export default SeeCompany;

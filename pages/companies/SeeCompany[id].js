import React, { useState } from 'react';
import styles from "../css/employee[id].module.scss";
import styles2 from "../css/SeeCompany[id].module.scss";
import { useSelector } from "react-redux";
import { numberWithPoint, formatToCUIT } from "../../components/helpers/formHelper";

import Layout2 from '../../components/layout/Layout2';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from "next/link";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
//Icons
import PhoneAndroidRoundedIcon from '@material-ui/icons/PhoneAndroidRounded';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PermContactCalendarRoundedIcon from '@material-ui/icons/PermContactCalendarRounded';

const useStyles2 = makeStyles({
    table: {
        minWidth: 650,
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
        alignItems: "center",
        textAlign: "center",
    },
    buttonSuccess: {
        backgroundColor: "#00a441",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a441b5",
        }
    },
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
        }
    },
    buttonSave: {
        backgroundColor: "rgb(7,138,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(7,138,7, 0.7)",
        }
    },
    buttonBlue: {
        backgroundColor: "#3b5999;",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#3b5999b5",
        }
    },
});


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const SeeCompany = () => {
    const classes2 = useStyles2();
    const companyToSee = useSelector(state => state.companies.companyToSee);
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getDateDDMMAAAA = (mydate) => {
        let date = new Date(mydate);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let newdate = "";
        if (month < 10) {
            newdate = `${day}-0${month}-${year}`;
        } else {
            newdate = `${day}-${month}-${year}`;
        }
        return newdate;
    }

    const getDateAAAAMMDDFromFicha = (doc) => {
        let position = doc.url.indexOf("ficha_afiliado_");
        position = position + 15;
        let date = doc.url.substr(position, 10);
        return date;
    }


    return (<>
        {companyToSee ?
            <div>
                <Layout2>
                    <div className={styles2.tabsContainer}>
                        <div className={styles.headerName}>
                            <span className={styles.workerName}>{companyToSee.nombre}</span>
                        </div>
                        <div className={classes.root}>
                            <AppBar position="static">
                                <Tabs value={value} onChange={handleChange}
                                    aria-label="simple tabs example">
                                    <Tab label="Información Básica" {...a11yProps(0)} />
                                    <Tab label="Documentos" {...a11yProps(1)} />
                                </Tabs>
                            </AppBar>
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
                                                    {companyToSee.domicilio ? companyToSee.domicilio : companyToSee.calle + " " + companyToSee.numero_calle.toString()},
                                                        {companyToSee.ciudad}
                                                </span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Delegados</span>
                                                <span className={styles.spanLabel}>
                                                    {companyToSee.delegados && companyToSee.delegados.length > 0 &&
                                                        companyToSee.delegados.map(delegado => {
                                                            <p> {delegado.nombre + " " + delegado.apellido}</p>
                                                        })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.rowBody}>
                                            <span className={styles.spanIcon}><MenuBookIcon /></span>
                                            <h4 className={styles.title}>Otros datos</h4>
                                            <Divider className={styles.divider} />
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>CUIT</span>
                                                <span className={styles.spanLabel}>
                                                    {companyToSee.cuit}
                                                </span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Telefono</span>
                                                <span className={styles.spanLabel}>
                                                    {companyToSee.telefono && companyToSee.telefono}
                                                </span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Email</span>
                                                <span className={styles.spanLabel}>
                                                    {companyToSee.email && companyToSee.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <TableContainer component={Paper}>
                                    <Table className={classes2.table} aria-label="caption table">
                                        {/* <caption>A basic table example with a caption</caption> */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Tipo</TableCell>
                                                <TableCell align="left">Fecha</TableCell>
                                                <TableCell align="left">Enlace</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {companyToSee.documentacion.sort((a, b) => (a.fecha < b.fecha) ? 1 : ((b.fecha < a.fecha) ? -1 : 0)).map((row) => (
                                                <TableRow>
                                                    <TableCell align="left">{row.tipo}</TableCell>
                                                    <TableCell align="leftt">{getDateDDMMAAAA(row.fecha)}</TableCell>
                                                    <TableCell align="left">
                                                        <a className={`${classes2.btn} ${classes2.buttonPurple}`}
                                                            target="_blank"
                                                            href={row.url}
                                                            rel="noopener noreferrer">
                                                            Ver Documento
                                                        </a>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </div>
                        <Link href={"/generalWorkerList"}>
                            <a className={`${classes2.btn} ${classes2.buttonSave}`}
                            >Volver al Padrón</a>
                        </Link>
                    </div>
                </Layout2>
            </div >
            : null}
    </>);
}

export default SeeCompany;
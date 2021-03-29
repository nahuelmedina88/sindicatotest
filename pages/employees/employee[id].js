import React, { useEffect } from 'react';
import styles from "../css/employee[id].module.scss";
import { useSelector } from "react-redux";
import { calcularEdad } from "../../components/helpers/validHelper";
import Layout2 from '../../components/layout/Layout2';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

//Icons
import PhoneAndroidRoundedIcon from '@material-ui/icons/PhoneAndroidRounded';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import ContactsRoundedIcon from '@material-ui/icons/ContactsRounded';
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import PermContactCalendarRoundedIcon from '@material-ui/icons/PermContactCalendarRounded';
import CakeRoundedIcon from '@material-ui/icons/CakeRounded';
import HourglassEmptyRoundedIcon from '@material-ui/icons/HourglassEmptyRounded';

const useStyles2 = makeStyles({
    table: {
        minWidth: 650,
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


const SeeEmployee = () => {
    const classes2 = useStyles2();
    const employeeToSee = useSelector(state => state.employees.employeeToSee);
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (<>

        <div>
            <Layout2>
                <Grid container >
                    <div className={styles.imageContainer}>
                        <div className={styles.iconImage}>
                            <svg className={styles.icon}>
                                <use xlinkHref="/img/sprite.svg#icon-user"></use>
                            </svg>
                        </div>
                        {/* <Image
                            src="/nahueSuecia.jpg"
                            alt="Nahuel en Suecia"
                            width={100}
                            height={50}
                            className={styles.img}
                        /> */}
                        <div className={styles.sidebarInfoContainer}>
                            <div className={styles.rowSidebar}>
                                <h4 className={styles.title}>Edad</h4>
                                <span className={styles.spanIcon}><CakeRoundedIcon /></span>
                                <span className={styles.spanLabel}>{calcularEdad(employeeToSee.fecha_nacimiento)}</span>
                            </div>
                            <Divider variant="middle" />
                            <div className={styles.rowSidebar}>
                                <h4 className={styles.title}>Nro Afiliado</h4>
                                <span className={styles.spanIcon}><ContactsRoundedIcon /></span>
                                <span className={styles.spanLabel}>{employeeToSee.nroLegajo}</span>
                            </div>

                            <div className={styles.rowSidebar}>
                                <span className={styles.spanIcon}><BusinessRoundedIcon /></span>
                                <span className={styles.spanLabel}>{employeeToSee.empresa.nombre}</span>
                            </div>
                            <div className={styles.rowSidebar}>
                                <h4 className={styles.title}>Fecha de Ingreso</h4>
                                <span className={styles.spanIcon}><EventRoundedIcon /></span>
                                <span className={styles.spanLabel}>{employeeToSee.fecha_ingreso}</span>
                            </div>
                            <div className={styles.rowSidebar}>
                                <h4 className={styles.title}>Antigüedad</h4>
                                <span className={styles.spanIcon}><HourglassEmptyRoundedIcon /></span>
                                <span className={styles.spanLabel}>{calcularEdad(employeeToSee.fecha_ingreso)}</span>
                            </div>
                            <div className={styles.rowSidebar}>
                                <h4 className={styles.title}>Sección</h4>
                                {/* <span className={styles.spanIcon}><EventRoundedIcon /></span> */}
                                <span className={styles.spanLabel}>{employeeToSee.seccion.label}</span>
                            </div>
                            <div className={styles.rowSidebar}>
                                <h4 className={styles.title}>Categoría</h4>
                                {/* <span className={styles.spanIcon}><EventRoundedIcon /></span> */}
                                <span className={styles.spanLabel}>{employeeToSee.categoria.label}</span>
                            </div>
                        </div>

                    </div>
                    <div className={styles.tabsContainer}>
                        <div className={styles.headerName}>
                            <span className={styles.workerName}>{employeeToSee.nombre + " " + employeeToSee.apellido}</span>
                            {/* <span className={styles.companyName}>{employeeToSee.empresa.nombre}</span> */}
                        </div>
                        <div className={classes.root}>
                            <AppBar position="static">
                                <Tabs value={value} onChange={handleChange}
                                    aria-label="simple tabs example">
                                    <Tab label="Información Básica" {...a11yProps(0)} />
                                    <Tab label="Grupo Familiar" {...a11yProps(1)} />
                                    <Tab label="Documentos" {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>
                            <TabPanel value={value} index={0}>
                                <div className={styles.bodyContainer}>
                                    <div className={styles.rowBodyContainer}>
                                        <div className={styles.rowBody}>
                                            <span className={styles.spanIcon}><LocationOnRoundedIcon /></span>
                                            <h4 className={styles.title}>Lugar de Residencia</h4>
                                            <Divider className={styles.divider} />
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Domicilio</span>
                                                <span className={styles.spanLabel}>{employeeToSee.domicilio}, {employeeToSee.ciudad}</span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Código Postal</span>
                                                <span className={styles.spanLabel}>{employeeToSee.codigo_postal}</span>
                                            </div>
                                        </div>
                                        <div className={styles.rowBody}>
                                            <span className={styles.spanIcon}><PermContactCalendarRoundedIcon /></span>
                                            <h4 className={styles.title}>Mas datos personales</h4>
                                            <Divider className={styles.divider} />
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>DNI</span>
                                                <span className={styles.spanLabel}>{employeeToSee.dni}</span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Fecha de Nacimiento</span>
                                                <span className={styles.spanLabel}>{employeeToSee.fecha_nacimiento}</span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Estado Civil</span>
                                                <span className={styles.spanLabel}>{employeeToSee.estado_civil}</span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Nacionalidad</span>
                                                <span className={styles.spanLabel}>{employeeToSee.nacionalidad}</span>
                                            </div>
                                        </div>
                                        <div className={styles.rowBody}>
                                            <span className={styles.spanIcon}><PhoneAndroidRoundedIcon /> <MailOutlineRoundedIcon /></span>
                                            <h4 className={styles.title}>Contacto</h4>
                                            <Divider className={styles.divider} />
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Teléfono</span>
                                                <span className={styles.spanLabel}>{employeeToSee.telefono}</span>
                                            </div>
                                            <div className={styles.itemRow}>
                                                <span className={styles.title}>Correo Electrónico</span>
                                                <span className={styles.spanLabel}>{employeeToSee.email}</span>
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
                                                <TableCell>Apellido y Nombre</TableCell>
                                                <TableCell align="right">DNI</TableCell>
                                                <TableCell align="right">Fecha Nacimiento</TableCell>
                                                <TableCell align="right">Parentesco</TableCell>
                                                <TableCell align="right">Sexo</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {employeeToSee.familia.map((row) => (
                                                <TableRow key={row.dni_familia}>
                                                    <TableCell component="th" scope="row">
                                                        {row.apellido_familia}, {row.nombre_familia}
                                                    </TableCell>
                                                    <TableCell align="right">{row.dni_familia}</TableCell>
                                                    <TableCell align="right">{row.fecha_nacimiento_familia}</TableCell>
                                                    <TableCell align="right">{row.parentesco}</TableCell>
                                                    <TableCell align="right">{row.sexo}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                Documentos
      </TabPanel>
                        </div>
                    </div>
                </Grid>
            </Layout2>
        </div>

    </>);
}

export default SeeEmployee;
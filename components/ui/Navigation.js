import React, { useContext } from 'react';
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import styles from "../css/Navigation.module.scss"
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MuiMenu from "./MuiMenu";
import MuiMenuItem from "./MuiMenuItem";

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SearchIcon from '@material-ui/icons/Search';
import BusinessIcon from '@material-ui/icons/Business';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(MuiMenu);

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MuiMenuItem);


const Navigation = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElUtiles, setAnchorElUtiles] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickUtiles = (event) => {
        setAnchorElUtiles(event.currentTarget);
    };

    const handleCloseUtiles = () => {
        setAnchorElUtiles(null);
    };
    const { user, firebase } = useContext(FirebaseContext);

    return (
        <nav className={styles.nav}>
            <Link href="/" passHref ><a>Sindicato de la Carne</a></Link>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
            >Padrones
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Link href="/generalWorkerList" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LibraryBooksIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padron General" />
                    </StyledMenuItem>
                </Link>
                <Link href="/workerListByYear" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <BusinessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padrón por Año" />
                    </StyledMenuItem>
                </Link>
                <Link href="/workerListByCompany" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <BusinessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padrón por Empresa" />
                    </StyledMenuItem>
                </Link>
                <Link href="/workerListSearchForm" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <SearchIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Búsqueda de Padrón" />
                    </StyledMenuItem>
                </Link>
                <Link href="/foundationalWorkerList" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LibraryBooksIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padrón Fundacional" />
                    </StyledMenuItem>
                </Link>
                <Link href="/WorkerNoActiveList" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LibraryBooksIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Trabajadores dados de baja" />
                    </StyledMenuItem>
                </Link>
            </StyledMenu>
            <Button
                aria-controls="customized-menu-two"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClickUtiles}
            >Útiles Escolares
            </Button>
            <StyledMenu
                id="customized-menu-two"
                anchorEl={anchorElUtiles}
                keepMounted
                open={Boolean(anchorElUtiles)}
                onClose={handleCloseUtiles}
            >
                <Link href="/schoolSuppliesWorkerList" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LibraryBooksIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Agregar útiles" />
                    </StyledMenuItem>
                </Link>
                <Link href="/SchoolSuppliesReport" passHref>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <BusinessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Consulta e informe" />
                    </StyledMenuItem>
                </Link>
            </StyledMenu>
            {user ?
                <form className={styles.form}>
                    <span>{user.displayName}</span>
                    <button
                        type="button"
                        className="btn btnDanger"
                        onClick={() => firebase.cerrarSesion()}
                    >
                        Cerrar Sesion
                    </button>
                </form>
                :
                <form className={styles.form}>
                    <Link href="/login" passHref>
                        <button className="btn btnExploring" type="button">Login</button>
                    </Link>
                    <Link href="/signin" passHref>
                        <button className="btn btnInfo" type="button">Crear cuenta</button>
                    </Link>
                </form>
            }
        </nav >
    );
}

export default Navigation;
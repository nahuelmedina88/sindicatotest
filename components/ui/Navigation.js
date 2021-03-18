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

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SearchIcon from '@material-ui/icons/Search';
import BusinessIcon from '@material-ui/icons/Business';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);


const Navigation = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const { user, firebase } = useContext(FirebaseContext);

    return (
        <nav className={styles.nav}>
            <Link href="/" ><a>Sindicato de la Carne</a></Link>
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
                <Link href="/generalWorkerList">
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LibraryBooksIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padron General" />
                    </StyledMenuItem>
                </Link>
                <Link href="/workerListByCompany">
                    <StyledMenuItem>
                        <ListItemIcon>
                            <BusinessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padrón por Empresa" />
                    </StyledMenuItem>
                </Link>
                <Link href="/workerListSearchForm">
                    <StyledMenuItem>
                        <ListItemIcon>
                            <SearchIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Búsqueda de Padrón" />
                    </StyledMenuItem>
                </Link>
                <Link href="/foundationlWorkerList">
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LibraryBooksIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Padrón Fundacional" />
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
                    <Link href="/login">
                        <button className="btn btnExploring" type="button">Login</button>
                    </Link>
                    <Link href="/signin">
                        <button className="btn btnInfo" type="button">Crear cuenta</button>
                    </Link>
                </form>
            }
        </nav >
    );
}

export default Navigation;
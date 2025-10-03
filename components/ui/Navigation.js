// components/ui/Navigation.js
import React, { useContext } from 'react';
import Link from "next/link";
import FirebaseContext from "../../firebase/context";
import styles from "../css/Navigation.module.scss";

import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';

const StyledMenu = (props) => (
  <Menu
    {...props}
    slotProps={{ paper: { sx: { border: '1px solid #d3d4d5' } } }}
  />
);

const StyledMenuItem = (props) => (
  <MenuItem
    {...props}
    sx={{
      '&:focus': {
        bgcolor: 'primary.main',
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: 'common.white' },
      },
    }}
  />
);

const Navigation = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElUtiles, setAnchorElUtiles] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClickUtiles = (event) => setAnchorElUtiles(event.currentTarget);
  const handleCloseUtiles = () => setAnchorElUtiles(null);

  const { user, cerrarSesion } = useContext(FirebaseContext);

  return (
    <nav className={styles.nav}>
      <Link href="/">Sindicato de la Carne</Link>

      <Button variant="contained" color="primary" onClick={handleClick}>
        Padrones
      </Button>
      <StyledMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Link href="/generalWorkerList" passHref>
          <StyledMenuItem>
            <ListItemIcon><LibraryBooksIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Padron General" />
          </StyledMenuItem>
        </Link>
        <Link href="/workerListByYear" passHref>
          <StyledMenuItem>
            <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Padrón por Año" />
          </StyledMenuItem>
        </Link>
        <Link href="/workerListByCompany" passHref>
          <StyledMenuItem>
            <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Padrón por Empresa" />
          </StyledMenuItem>
        </Link>
        <Link href="/workerListSearchForm" passHref>
          <StyledMenuItem>
            <ListItemIcon><SearchIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Búsqueda de Padrón" />
          </StyledMenuItem>
        </Link>
        <Link href="/foundationalWorkerList" passHref>
          <StyledMenuItem>
            <ListItemIcon><LibraryBooksIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Padrón Fundacional" />
          </StyledMenuItem>
        </Link>
        <Link href="/WorkerNoActiveList" passHref>
          <StyledMenuItem>
            <ListItemIcon><LibraryBooksIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Trabajadores dados de baja" />
          </StyledMenuItem>
        </Link>
        <Link href="/SelectWorkerForFoundationWorkerList" passHref>
          <StyledMenuItem>
            <ListItemIcon><LibraryBooksIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Armar el padrón fundacional" />
          </StyledMenuItem>
        </Link>
      </StyledMenu>

      <Button variant="contained" color="primary" onClick={handleClickUtiles}>
        Útiles Escolares
      </Button>
      <StyledMenu anchorEl={anchorElUtiles} keepMounted open={Boolean(anchorElUtiles)} onClose={handleCloseUtiles}>
        <Link href="/schoolSuppliesWorkerList" passHref>
          <StyledMenuItem>
            <ListItemIcon><LibraryBooksIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Agregar útiles" />
          </StyledMenuItem>
        </Link>
        <Link href="/SchoolSuppliesReport" passHref>
          <StyledMenuItem>
            <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Consulta e informe" />
          </StyledMenuItem>
        </Link>
      </StyledMenu>

      {user ? (
        <form className={styles.form}>
          <span>{user.displayName}</span>
          <button type="button" className="btn btnDanger" onClick={() => cerrarSesion()}>
            Cerrar Sesion
          </button>
        </form>
      ) : (
        <form className={styles.form}>
          <Link href="/login" passHref>
            <button className="btn btnExploring" type="button">Login</button>
          </Link>
          <Link href="/signin" passHref>
            <button className="btn btnInfo" type="button">Crear cuenta</button>
          </Link>
        </form>
      )}
    </nav>
  );
};

export default Navigation;
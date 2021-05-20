import React, { useState } from 'react';
//Next
import Link from "next/link";
//Material UI
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
//Docx
import { getDocx } from "../../components/helpers/docxHelper";

const useStyles = makeStyles({
    buttonExport: {
        backgroundColor: "#FF5733",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#FF5733b5",
        }
    },
});

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

const ExportButton = ({ employeesSearch, employeesSorted }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const generate = (e) => {
        e.preventDefault();
        employeesSearch.length > 0 ?
            getDocx(employeesSearch, e.target.innerHTML) :
            getDocx(employeesSorted, e.target.innerHTML);
    }

    return (
        <>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                className={`${classes.buttonExport}`}
                onClick={handleClick}>
                Exportar
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Link href="#">
                    <StyledMenuItem
                        onClick={generate}
                    >
                        {/* <ListItemIcon>
                                            <LibraryBooksIcon fontSize="small" />
                                        </ListItemIcon> */}
                        <ListItemText primary="Con Firma" />
                    </StyledMenuItem>
                </Link>
                <Link href="#"
                >
                    <StyledMenuItem
                        onClick={generate}

                    >
                        {/* <ListItemIcon>
                                            <BusinessIcon fontSize="small" />
                                        </ListItemIcon> */}
                        <ListItemText primary="Sin Firma" />
                    </StyledMenuItem>
                </Link>
            </StyledMenu>
        </>
    );
}

export default ExportButton;
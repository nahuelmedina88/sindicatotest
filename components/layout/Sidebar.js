import React, { useEffect, useState } from 'react';
import styles from "../css/Sidebar.module.scss";
import { useRouter } from 'next/router';
import Link from "next/link";
import { getDocx } from '../helpers/docxHelper';

//Redux
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction, updateButtonStateAction } from "../redux/actions/GeneralActions";
import { updateEmployeesAction } from "../../components/redux/actions/EmployeeActions";

const Sidebar = () => {
    const dispatch = useDispatch();
    const pathnameStore = useSelector(state => state.general.pathname);
    const employeesSearch = useSelector(state => state.employees.employeesSearch);
    const employeesRedux = useSelector(state => state.employees.employees);
    const buttonPressed = useSelector(state => state.general.buttonPressed);

    const router = useRouter();
    const [pressed, setPressed] = useState(true);
    const [exportarButtonPressed, setExportarButton] = useState(false);
    const [objs, updateObjs] = useState([]);
    // const employees = useSelector(state => state.employees.employees)
    const [byLastName, setByLastName] = useState(false);

    const sidebarList = [
        {
            to: "/AddEmployee",
            label: "Agregar Afiliado",
            key: "1",
            icon: "/img/sprite.svg#icon-user-plus",
        },
        {
            to: "/AddCompany",
            label: "Agregar Empresa",
            key: "2",
            icon: "/img/sprite.svg#icon-office"
        },
        {
            to: "/companies",
            label: "Ver Empresas",
            key: "3",
            icon: "/img/sprite.svg#icon-office"

        },
        {
            to: "/generalWorkerList",
            label: "Ver Afiliados",
            key: "4",
            icon: "/img/sprite.svg#icon-user",
        }

    ]

    useEffect(() => {
        //esta solucion es una cagada.
        let screenSize = 0;
        if (process.browser) {
            screenSize = window.screen.width;
            if (screenSize < 500) {
                setPressed(false);
                dispatch(updateButtonStateAction(false));
            } else {
                setPressed(true);
                dispatch(updateButtonStateAction(true));
            }
        }
    }, []);

    const handleExport = (e) => {
        e.preventDefault();
        exportarButtonPressed ? setExportarButton(false) : setExportarButton(true);
    }

    const generate = (e) => {
        e.preventDefault();
        employeesSearch.length > 0 ?
            getDocx(employeesSearch, e.target.id) :
            getDocx(employeesRedux, e.target.id);
    }

    const handleMenu = (e) => {
        e.preventDefault();
        if (!pressed) {
            setPressed(true);
            dispatch(updateButtonStateAction(true))
        }
        else {
            setPressed(false);
            dispatch(updateButtonStateAction(false))
        }
    }
    let icon = "";
    (pressed) ? icon = "/img/sprite.svg#icon-cross" : icon = "/img/sprite.svg#icon-menu";

    return (
        <>
            <aside className={`${styles.aside} ${(pressed ? styles.btnNewPropertiesShow : styles.btnNewPropertiesHide)}`}>
                <nav className={`${styles.nav} ${(pressed ? styles.show : styles.hide)}`}>
                    <ul className={styles.ul}>
                        {sidebarList.map(obj => (
                            <li key={obj.key}>
                               <Link href={obj.to}>
                                <div className={styles.LinkContainer}>
                                    <svg className={styles.icon}>
                                    <use href={obj.icon}></use>
                                    </svg>
                                    <span className={styles.a}>{obj.label}</span>
                                </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <button className={`${styles.burgerButton} ${(!pressed ? styles.burguerButtonChanged : null)}`}
                    onClick={handleMenu}>
                    <svg className={styles.icon2}>
                        <use href={icon}></use>
                    </svg>
                </button>
            </aside >
        </>
    );
}

export default Sidebar;
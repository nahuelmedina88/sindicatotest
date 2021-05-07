import React, { useEffect, useState } from 'react';
import styles from "../css/Sidebar.module.scss";
import { useRouter } from 'next/router';
import Link from "next/link";
import { getDocx } from "../helpers/docxHelper";

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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
            icon: "img/sprite.svg#icon-user-plus",
        },
        {
            to: "/AddCompany",
            label: "Agregar Empresa",
            key: "2",
            icon: "img/sprite.svg#icon-office"
        },
        {
            to: "/companies",
            label: "Ver Empresas",
            key: "3",
            icon: "img/sprite.svg#icon-office"

        },
        {
            to: "/generalWorkerList",
            label: "Ver Afiliados",
            key: "4",
            icon: "img/sprite.svg#icon-user",
        }

    ]

    // const setState = (pathname) => {
    //     // console.log(pathname);
    //     switch (pathname) {
    //         case "/employees":
    //             updateObjs([{
    //                 to: "/AddEmployee",
    //                 label: "Agregar Empleado",
    //                 key: "1",
    //                 icon: "img/sprite.svg#icon-user-plus",
    //             },
    //             {
    //                 to: "/AddCompany",
    //                 label: "Agregar Empresa",
    //                 key: "2",
    //                 icon: "img/sprite.svg#icon-office"
    //             },
    //             {
    //                 to: "/companies",
    //                 label: "Ver Empresas",
    //                 key: "3",
    //                 icon: "img/sprite.svg#icon-office"

    //             },
    //             {
    //                 to: "/employees",
    //                 label: "Ver Empleados",
    //                 key: "4",
    //                 icon: "img/sprite.svg#icon-user",
    //             }]);
    //             break;
    //         case "/companies":
    //             updateObjs([{
    //                 to: "/AddCompany",
    //                 label: "Agregar Empresa",
    //                 key: "2",
    //                 icon: "img/sprite.svg#icon-office",
    //             },
    //             {
    //                 to: "/employees",
    //                 label: "Ver Empleados",
    //                 key: "4",
    //                 icon: "img/sprite.svg#icon-user",
    //             }
    //             ]);
    //             break;
    //         case "/AddEmployee":
    //             updateObjs([{
    //                 to: "/employees",
    //                 label: "Ver Empleados",
    //                 key: "4",
    //                 icon: "img/sprite.svg#icon-user",
    //             }]);
    //             break;
    //         case "/companies":
    //             updateObjs([{
    //                 to: "/AddCompany",
    //                 label: "Agregar Empresa",
    //                 key: "2",
    //                 icon: "img/sprite.svg#icon-office",
    //             },
    //             {
    //                 to: "/employees",
    //                 label: "Ver Empleados",
    //                 key: "4",
    //                 icon: "img/sprite.svg#icon-user",
    //             }
    //             ]);
    //             break;
    //         case "/AddCompany":
    //             updateObjs([{
    //                 to: "/employees",
    //                 label: "Ver Empleados",
    //                 key: "4",
    //                 icon: "img/sprite.svg#icon-user",
    //             },
    //             {
    //                 to: "/companies",
    //                 label: "Ver Empresas",
    //                 key: "5",
    //                 icon: "img/sprite.svg#icon-office",
    //             }
    //             ]);
    //             break;
    //     }
    // }
    // // const dispatch = useDispatch();
    // useEffect(() => {
    //     const currentPathname = router.pathname;
    //     const ejecutarAction = (currentPathname) => dispatch(updatePathnameAction(currentPathname));
    //     ejecutarAction(currentPathname);
    //     setState(currentPathname);
    // }, [pathnameStore]);

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
        employeesSearch.length > 0 ? getDocx(employeesSearch, e.target.id) : getDocx(employeesRedux, e.target.id);
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
    (pressed) ? icon = "img/sprite.svg#icon-cross" : icon = "img/sprite.svg#icon-menu";

    return (
        <>
            <aside className={`${styles.aside} ${(pressed ? styles.btnNewPropertiesShow : styles.btnNewPropertiesHide)}`}>
                <nav className={`${styles.nav} ${(pressed ? styles.show : styles.hide)}`}>
                    <ul className={styles.ul}>
                        {sidebarList.map(obj => (
                            <li key={obj.key}>
                                <Link
                                    href={obj.to}>
                                    <div className={styles.LinkContainer}>
                                        <svg className={styles.icon}>
                                            <use xlinkHref={obj.icon}></use>
                                        </svg>
                                        <a className={styles.a}>
                                            {obj.label}</a>
                                    </div>
                                </Link>
                            </li>
                        ))}

                        <li onClick={handleExport}>
                            <Link
                                className={styles.link}
                                href=""
                            >
                                <div className={styles.LinkContainer}>
                                    <svg className={styles.icon}>
                                        <use xlinkHref="img/sprite.svg#icon-file-word"></use>
                                    </svg>
                                    <a className={styles.a}>Exportar</a>
                                </div>
                            </Link>
                            <ul className={`${styles.subLista} ${exportarButtonPressed ? styles.showExportOptions : styles.hideExportOptions}`}>
                                <li onClick={generate}>
                                    <Link
                                        className={styles.linkSubLista}
                                        href=""
                                    >
                                        <div className={styles.LinkContainer}>
                                            <svg className={styles.icon}>
                                                <use xlinkHref="img/sprite.svg#icon-pencil"></use>
                                            </svg>
                                            <a id="confirma" className={styles.a}>Con Firma</a>
                                        </div>
                                    </Link>
                                </li>
                                <li onClick={generate}>
                                    <Link
                                        className={styles.link}
                                        href=""
                                    >
                                        <div className={styles.LinkContainer}>
                                            <svg className={styles.icon}>
                                                <use xlinkHref="img/sprite.svg#icon-table"></use>
                                            </svg>
                                            <a id="sinfirma" className={styles.a}
                                            >Sin Firma
                                            </a>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        {/* <li>
                            <Link
                                className={styles.link}
                                href="/graphs"
                            >
                                <div className={styles.LinkContainer}>
                                    <svg className={styles.icon}>
                                        <use xlinkHref="img/sprite.svg#icon-stats-bars"></use>
                                    </svg>
                                    <a className={styles.a}>Gráficos</a>
                                </div>
                            </Link>
                        </li> */}
                    </ul>
                </nav>
                <button className={`${styles.burgerButton} ${(!pressed ? styles.burguerButtonChanged : null)}`}
                    onClick={handleMenu}>
                    <svg className={styles.icon2}>
                        <use xlinkHref={icon}></use>
                    </svg>
                </button>
            </aside >

        </>
    );
}

export default Sidebar;
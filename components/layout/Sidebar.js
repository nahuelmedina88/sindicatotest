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
    const [objs, updateObjs] = useState([]);
    // const employees = useSelector(state => state.employees.employees)
    const [byLastName, setByLastName] = useState(false);

    const setState = (pathname) => {
        // console.log(pathname);
        switch (pathname) {
            case "/employees":
                updateObjs([{
                    to: "/AddEmployee",
                    label: "Agregar Empleado",
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

                }
                ]);
                break;
            case "/AddEmployee":
                updateObjs([{
                    to: "/employees",
                    label: "Ver Empleados",
                    key: "4",
                    icon: "img/sprite.svg#icon-user",
                }]);
                break;
            case "/companies":
                updateObjs([{
                    to: "/AddCompany",
                    label: "Agregar Empresa",
                    key: "2",
                    icon: "img/sprite.svg#icon-office",
                },
                {
                    to: "/employees",
                    label: "Ver Empleados",
                    key: "4",
                    icon: "img/sprite.svg#icon-user",
                }
                ]);
                break;
            case "/AddCompany":
                updateObjs([{
                    to: "/employees",
                    label: "Ver Empleados",
                    key: "4",
                    icon: "img/sprite.svg#icon-user",
                },
                {
                    to: "/companies",
                    label: "Ver Empresas",
                    key: "5",
                    icon: "img/sprite.svg#icon-office",
                }
                ]);
                break;
        }
    }
    // const dispatch = useDispatch();
    useEffect(() => {
        const currentPathname = router.pathname;
        const ejecutarAction = (currentPathname) => dispatch(updatePathnameAction(currentPathname));
        ejecutarAction(currentPathname);
        setState(currentPathname);
    }, [pathnameStore]);

    // useEffect(() => {

    // }, []);

    // const handleOrdenar = (e) => {
    //     e.preventDefault();
    //     pressed ? setPressed(false) : setPressed(true);
    // }

    // const handleByLastName = (e) => {

    //     console.log(e.target.checked);
    //     setByLastName(e.target.checked);
    //     let emp = [];
    //     if (e.target.checked) {
    //         if (employeesSearch.length > 0) {
    //             emp = employeesSearch.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    //         } else {
    //             let replica = employeesRedux;
    //             emp = replica.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    //         }
    //         dispatch(updateEmployeesAction(emp));
    //     } else {
    //         debugger;
    //         dispatch(updateEmployeesAction(employeesRedux));
    //     }
    // }
    const generate = (e) => {
        e.preventDefault();
        employeesSearch.length > 0 ? getDocx(employeesSearch) : getDocx(employeesRedux);
    }

    const handleMenu = (e) => {
        e.preventDefault();
        console.log("Desde Handle Menu");
        if (!pressed) {
            setPressed(true);
            dispatch(updateButtonStateAction(true))
        }
        else {
            setPressed(false);
            dispatch(updateButtonStateAction(false))
        }
    }

    return (
        <>
            <aside className={`${styles.aside} ${(pressed ? styles.asideChanged : null)} ${(pressed ? styles.btnNewPropertiesShow : null)}`}>
                <button className={`${styles.burgerButton} ${(!pressed ? styles.burguerButtonChanged : null)}`}
                    onClick={handleMenu}>
                    {/* <FontAwesomeIcon icon={faBars} className={styles.icon} /> */}
                    <svg className={styles.icon2}>
                        <use xlinkHref="img/sprite.svg#icon-menu"></use>
                    </svg>
                </button>
                <nav className={`${styles.nav} ${(pressed ? styles.show : styles.hide)}`}>
                    <ul className={styles.ul}>
                        {objs.map(obj => (
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

                        <li>
                            <Link
                                className={styles.link}
                                href=""
                            >
                                <div className={styles.LinkContainer}>
                                    <svg className={styles.icon}>
                                        <use xlinkHref="img/sprite.svg#icon-folder-download"></use>
                                    </svg>
                                    <a className={styles.a}
                                        onClick={generate}>Exportar
                            </a>
                                </div>
                            </Link>
                        </li>
                        <li>
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
                        </li>
                        {/* <li className={"nav-item active " + styles.navItemCs}>
                        <Link
                            className={"nav-link " + styles.navLinkCs}
                            href=""
                        ><a onClick={generate}>Exportar</a>
                        </Link>
                    </li> */}
                        {/* <li className={"nav-item active " + styles.navItemCs}>
                        <Link
                            className={"nav-link " + styles.navLinkCs}
                            href=""
                        ><a onClick={handleOrdenar}>Ordenar</a>
                        </Link>
                    </li>
                    <li>
                        <div className={"card card-body " + (pressed ? styles.show : styles.hide)}>
                            <ul>
                                <li>
                                    <input
                                        type="checkbox"
                                        name="byLastName"
                                        value={byLastName}
                                        onChange={handleByLastName}
                                    />
                                     Por Apellido

                                </li>
                                <li><input type="checkbox" id="vehicle2" name="vehicle2" value="Car" />
                                    <label for="vehicle2"> Por Nombre</label><br />
                                </li>
                                <li><input type="checkbox" id="vehicle2" name="vehicle2" value="Car" />
                                    <label for="vehicle2"> Por Nro legajo</label><br />
                                </li>
                                <li>
                                    <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat" />
                                    <label for="vehicle3"> Por DNI</label><br />
                                </li>
                                <li>
                                    <input type="checkbox" id="vehicle4" name="vehicle4" value="Boat" />
                                    <label for="vehicle4"> Por Empresa</label><br />
                                </li>
                            </ul>
                        </div>
                    </li> */}
                    </ul>
                </nav>
            </aside >
        </>
    );
}

export default Sidebar;
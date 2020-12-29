import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
import Layout from "../components/layout/Layout";
import Login from "./login";
import Company from "../components/Company";
//Firebase
import { FirebaseContext } from "../firebase";

const Companies = () => {
    const dispatch = useDispatch();
    const companies = useSelector(state => state.companies.companies);
    const { user, firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
        loadPathname();
    }, []);

    return (
        <>
            {user ?
                <Layout>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Ciudad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.length === 0 ? "No hay resultados" :
                                companies.map(company => (
                                    <Company
                                        key={company.id}
                                        company={company}
                                    />
                                ))
                            }
                        </tbody>
                    </table>
                </Layout> :
                <Login />}
        </>
    );
}


export default Companies;
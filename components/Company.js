import React from 'react';

const Company = ({ company }) => {

    const { nombre, ciudad, domicilio, cuit, razonSocial } = company;
    return (
        <tr>
            <td>{nombre}</td>
            <td>{ciudad}</td>
            <td>{domicilio}</td>
            <td>{cuit}</td>
            <td>{razonSocial}</td>
        </tr >
    )
};
export default Company;
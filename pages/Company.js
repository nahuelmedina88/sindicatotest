import React from 'react';

const Company = ({ company }) => {

    const { nombre, ciudad } = company;
    return (
        <tr>
            <td>{nombre}</td>
            <td>{ciudad}</td>
        </tr >
    );
}

export default Company;
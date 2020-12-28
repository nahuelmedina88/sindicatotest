import React, { useContext } from 'react';

// import { Link, useHistory } from 'react-router-dom';
import Link from "next/link";
import { deleteEmployeeAction, editEmployeeAction } from "../components/redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";
import swal from "sweetalert2";
//Firebase
import { FirebaseContext } from "../firebase";

const EmployeeList = ({ employee }) => {

    const dispatch = useDispatch();
    // const history = useRouter();
    const { firebase } = useContext(FirebaseContext);
    const handleOnClick = (id) => {
        swal.fire({
            title: "Estas seguro de eliminarlo?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: 'Si, estoy segurisimo!',
            denyButtonText: 'No, prefiero cancelar!',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                swal.fire('Empleado Eliminado!', 'Fue eliminado correctamente!', 'success');
                dispatch(deleteEmployeeAction(id, firebase));
            } else if (result.isDenied) {
                swal.fire("Cancelado", "Tranquilo, el empleado no fue borrado", 'info');
            }
        });
    }
    const { id, nroLegajo, apellido, nombre, dni } = employee;

    const redirectToEdit = (employee) => {
        dispatch(editEmployeeAction(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }

    return (
        <tr>
            <td>{nroLegajo}</td>
            <td>{apellido}</td>
            <td>{nombre}</td>
            <td>{dni}</td>
            <td>{employee.empresa.nombre}</td>

            <td>
                <Link
                    href="/employees/[id]"
                    as={`/employees/${id}`}
                >
                    <a className="btn btnPrimary btnTable"
                        onClick={() => redirectToEdit(employee)}
                    >
                        Editar
                    </a>
                </Link>
            </td>
            <td>
                <Link
                    href=""
                >
                    <a className="btn btnDanger btnTable"
                        onClick={() => handleOnClick(id)}
                    >
                        Eliminar
                    </a>
                </Link>
                {/* <button
                    className="btn btnPrimary"
                    onClick={() => handleOnClick(id)}
                >Eliminar</button> */}
            </td>
        </tr >
    );
}

export default EmployeeList;
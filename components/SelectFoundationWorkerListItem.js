import React, { useContext } from 'react';

// MUI
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

// Helpers
import { numberWithPoint } from "./helpers/formHelper";

// Redux
import { useDispatch } from "react-redux";
import { editEmployeeWithoutAlertAction } from "./redux/actions/EmployeeActions";

// Firebase
import { FirebaseContext } from "../firebase";

const SelectFoundationWorkerListItem = ({ employee }) => {
  const dispatch = useDispatch();
  const { firebase } = useContext(FirebaseContext);

  const handleChangeCheckBox = (e) => {
    const dniChecked = parseInt(e.target.id, 10);
    const newEmployee = { ...employee };
    newEmployee.padron_fundacional = employee.dni === dniChecked && e.target.checked;
    dispatch(editEmployeeWithoutAlertAction(newEmployee, firebase));
  };

  const isChecked = !!employee.padron_fundacional;

  return (
    <TableRow
      key={employee.dni}
      sx={{ bgcolor: isChecked ? '#98b3e4b5' : '#f2747480' }}
    >
      <TableCell align="right">{employee.nroLegajo}</TableCell>
      <TableCell align="right">{employee.apellido}</TableCell>
      <TableCell align="right">{employee.nombre}</TableCell>
      <TableCell align="right">{numberWithPoint(employee.dni)}</TableCell>
      <TableCell align="right">{employee.empresa?.nombre}</TableCell>
      <TableCell align="right">
        <Checkbox
          id={String(employee.dni)}
          checked={isChecked}
          onChange={handleChangeCheckBox}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>
    </TableRow>
  );
};

export default SelectFoundationWorkerListItem;
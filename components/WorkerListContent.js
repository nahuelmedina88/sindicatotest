import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import HeaderList from "./HeaderList";
import EmployeeListItem from "../components/EmployeeListItem";

const WorkerListContent = ({ employees }) => {
    return (
        <>
            <HeaderList />
            {employees.length > 0 ?
                <TableBody>
                    {
                        employees.map(employee => (
                            <EmployeeListItem
                                key={employee.id}
                                employee={employee} />
                        ))
                    }
                </TableBody>
                :
                <TableBody>
                    <TableRow><TableCell>No hay trabajadores</TableCell></TableRow>
                </TableBody>
            }
        </>
    );
}

export default WorkerListContent;
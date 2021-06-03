import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const HeaderList = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell align="right">Nro Legajo</TableCell>
                <TableCell align="right">Apellido</TableCell>
                <TableCell align="right">Nombre</TableCell>
                <TableCell align="right">DNI</TableCell>
                <TableCell align="right">Empresa</TableCell>
            </TableRow>
        </TableHead>
    );
}

export default HeaderList;
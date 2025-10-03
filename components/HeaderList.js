import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

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
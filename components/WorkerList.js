import React from 'react';
import { SearchBoxContext } from "./context/SearchBoxContext";
import WorkerListContent from './WorkerListContent';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
});

const WorkerList = ({ employeesSearch, employeesSorted }) => {
    const { searchBoxValue, setSearchBoxValue } = React.useContext(SearchBoxContext);
    const { companySelectValue, setcompanySelectValue } = React.useContext(SearchBoxContext);
    const { chosenYearValue, setChosenYearValue } = React.useContext(SearchBoxContext);

    const classes = useStyles();
    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="caption table">
                    {!chosenYearValue && !companySelectValue && !searchBoxValue ?
                        <WorkerListContent employees={employeesSorted} />
                        :
                        <WorkerListContent employees={employeesSearch} />
                    }
                </Table>
            </TableContainer>
        </>
    );
}

export default WorkerList;


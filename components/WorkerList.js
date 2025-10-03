// components/WorkerList.js
import React from 'react';
import { SearchBoxContext } from "./context/SearchBoxContext";
import WorkerListContent from './WorkerListContent';

// Material UI
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

const WorkerList = ({ employeesSearch, employeesSorted }) => {
  const { searchBoxValue } = React.useContext(SearchBoxContext);
  const { companySelectValue } = React.useContext(SearchBoxContext);
  const { chosenYearValue } = React.useContext(SearchBoxContext);

  const showFiltered = chosenYearValue || companySelectValue || searchBoxValue;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ tableLayout: 'fixed' }} aria-label="caption table">
        {showFiltered
          ? <WorkerListContent employees={employeesSearch} />
          : <WorkerListContent employees={employeesSorted} />
        }
      </Table>
    </TableContainer>
  );
};

export default WorkerList;
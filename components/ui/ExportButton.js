// components/ui/ExportButton.js
import React, { useState } from 'react';

// MUI
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Docx
import { getDocx } from '../helpers/docxHelper';

const ExportButton = ({ employeesSearch, employeesSorted }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const generate = (e) => {
    e.preventDefault();
    const label = e.currentTarget.innerText; // "Con Firma" | "Sin Firma"
    const data = employeesSearch.length > 0 ? employeesSearch : employeesSorted;
    getDocx(data, label);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#FF5733',
          color: '#fff',
          '&:hover': { backgroundColor: '#FF5733b5' },
        }}
        onClick={handleClick}
      >
        Exportar
      </Button>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
        slotProps={{
          paper: { sx: { border: '1px solid #d3d4d5' } },
        }}
      >
        <MenuItem
          onClick={generate}
          sx={{
            '&:focus': {
              bgcolor: 'primary.main',
              '& .MuiListItemText-primary': { color: 'common.white' },
            },
          }}
        >
          <ListItemText primary="Con Firma" />
        </MenuItem>

        <MenuItem
          onClick={generate}
          sx={{
            '&:focus': {
              bgcolor: 'primary.main',
              '& .MuiListItemText-primary': { color: 'common.white' },
            },
          }}
        >
          <ListItemText primary="Sin Firma" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ExportButton;
import React from "react";
import MenuItem from "@mui/material/Menu";

const MuiMenuItem = React.forwardRef((props, ref) => {
    return <MenuItem ref={ref} {...props} />;
});

export default MuiMenuItem;
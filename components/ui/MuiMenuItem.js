import React from "react";
import MenuItem from "@material-ui/core/MenuItem";

const MuiMenuItem = React.forwardRef((props, ref) => {
    return <MenuItem ref={ref} {...props} />;
});

export default MuiMenuItem;
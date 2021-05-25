import React from "react";
import Menu from "@material-ui/core/Menu";
import { withStyles } from '@material-ui/core/styles';

const MuiMenu = React.forwardRef((props, ref) => {
    return <Menu ref={ref} {...props} />;
});

export default MuiMenu;

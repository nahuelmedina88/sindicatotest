import React from "react";
import Menu from "@mui/material/Menu";

const MuiMenu = React.forwardRef((props, ref) => {
  return <Menu ref={ref} {...props} />;
});

export default MuiMenu;
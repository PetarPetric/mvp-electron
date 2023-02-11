import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { getTipProizvoda } from "./services/dataservice";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  ListItemButton,
  ListItemText,
  List,
} from "@mui/material";

import "../src/styles/App.css";

const App = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   getTipProizvoda().then((res) => {
  //     console.log(res);
  //   });
  // }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="root">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className="menuButton"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon color="white" />
            <Typography variant="h6" className="title">
              MVPizzeria
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="persistent"
        open={open}
        onClose={toggleDrawer}
      >
        <div className="list" role="presentation">
          <List>
            <ListItemButton
              className="drawerBtnClose"
              alignItems="center"
              divider={true}
              onClick={toggleDrawer}
            >
              <ChevronLeftIcon />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            >
              <ListItemText primary="Stolovi" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                navigate("/roba");
                setOpen(false);
              }}
            >
              <ListItemText primary="Roba" />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
      <Outlet />
    </div>
  );
};

export default App;

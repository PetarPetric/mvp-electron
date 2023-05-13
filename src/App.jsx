import React, { useState } from "react";
import { setDatabase } from "./services/dataservice";
import { Outlet, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PasswordDialog from "./components/PasswordDialog";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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
setDatabase();

const App = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [location, setLocation] = useState("");

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
              Aleksandar-SC
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
            <ListItemButton
              onClick={() => {
                setLocation("izvestaji");
                setPasswordDialogOpen(true);
              }}
            >
              <ListItemText secondary="Izvestaji" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setLocation("dnevni-izvestaj");
                setPasswordDialogOpen(true);
              }}
            >
              <ListItemText secondary="Dnevni Izvestaj" />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
      <Outlet />
      <PasswordDialog
        open={passwordDialogOpen}
        setOpen={setOpen}
        setOpenModal={setPasswordDialogOpen}
        type={location}
      />
    </div>
  );
};

export default App;

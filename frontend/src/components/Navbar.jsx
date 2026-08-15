import React, { useState } from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider
} from "@mui/material";

import { AccountCircle, Logout } from "@mui/icons-material";

import { useAuthStore } from "../store/auth";


// ======================================================
// NAVBAR
// ======================================================

const Navbar = () => {

    const { authUser, logout } = useAuthStore();

    const [anchorEl, setAnchorEl] = useState(null);

    const menuOpen = Boolean(anchorEl);


    // ==================================================
    // MENU COMPTE
    // ==================================================

    const handleOpenMenu = (event) => {

        setAnchorEl(event.currentTarget);

    };

    const handleCloseMenu = () => {

        setAnchorEl(null);

    };

    const handleLogout = () => {

        handleCloseMenu();
        logout();

    };


    // ==================================================
    // RENDU
    // ==================================================

    return (

        <AppBar position="static" color="secondary">

            <Toolbar>

                <Typography
                    variant="h3"
                    noWrap
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".2rem",
                        color: "third.dark"
                    }}
                >
                    CANICULE
                </Typography>


                {authUser && (

                    <Typography
                        sx={{
                            mr: 1,
                            display: { xs: "none", sm: "block" }
                        }}
                    >
                        {authUser.fullName}
                    </Typography>

                )}


                <IconButton
                    onClick={handleOpenMenu}
                    size="large"
                    color="inherit"
                >
                    <AccountCircle fontSize="large" />
                </IconButton>


                <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >

                    {authUser && (

                        <MenuItem disabled>
                            {authUser.email}
                        </MenuItem>

                    )}

                    <Divider />

                    <MenuItem onClick={handleLogout}>

                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>

                        Déconnexion

                    </MenuItem>

                </Menu>

            </Toolbar>

        </AppBar>

    );

};

export default Navbar;
import React from "react";

import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { useAuthStore } from "../../store/auth";

// ======================================================
// PROTÈGE UNE ROUTE : redirige vers /login si non connecté
// ======================================================

const ProtectedRoute = ({ children }) => {

    const { authUser, isCheckingAuth } = useAuthStore();


    if (isCheckingAuth) {

        return (

            <Box
                sx={{
                    height: "100dvh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>

        );

    }

    if (!authUser) {

        return <Navigate to="/login" replace />;

    }

    return children;

};

export default ProtectedRoute;
import React from "react";

import {
    Box,
    Typography
} from "@mui/material";

import BarcodeScanner from "./BarcodeScanner.jsx";

const BarcodeStep = ({ onScan }) => {

    return (
        <Box>

            <Typography
                variant="h6"
                gutterBottom
            >
                Scanner le code-barres
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Placez le code-barres devant la caméra.
            </Typography>

            <BarcodeScanner
                onScan={onScan}
            />

        </Box>
    );
};

export default BarcodeStep;
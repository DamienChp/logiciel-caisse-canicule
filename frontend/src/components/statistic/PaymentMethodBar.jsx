import React from "react";

import { 
    Box, 
    Typography, 
    Grid 
} from "@mui/material";

import { formatPercentage, formatEuro } from "../../store/statistic";

// ======================================================
// BARRE DE PROGRESSION POUR UN MOYEN DE PAIEMENT
// ======================================================

const PaymentMethodBar = ({ label, percentage, count, revenue }) => {

    return (

        <Grid size={{ xs: 12, md: 4 }}>

            <Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1
                    }}
                >

                    <Typography>{label}</Typography>

                    <Typography fontWeight="bold">
                        {formatPercentage(percentage)}
                    </Typography>

                </Box>

                <Box
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "action.hover",
                        overflow: "hidden"
                    }}
                >

                    <Box
                        sx={{
                            width: `${percentage}%`,
                            height: "100%",
                            bgcolor: "primary.main",
                            transition: "width 0.3s"
                        }}
                    />

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1
                    }}
                >
 
                    <Typography variant="body2" color="text.secondary">
                        {count} vente(s)
                    </Typography>
 
                    <Typography variant="body2" color="text.secondary">
                        {formatEuro(revenue)}
                    </Typography>
 
                </Box>

            </Box>

        </Grid>

    );

};

export default PaymentMethodBar;
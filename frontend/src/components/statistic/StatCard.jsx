import React from "react";

import { 
    Box, 
    Typography, 
    Paper 
} from "@mui/material";

// ======================================================
// CARTE STATISTIQUE
// ======================================================

const StatCard = ({ title, value, subtitle, icon }) => {

    return (

        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: "100%",
                minHeight: 150,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box"
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2
                }}
            >

                <Box sx={{ minWidth: 0 }}>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            lineHeight: 1.2,
                            wordBreak: "break-word"
                        }}
                    >
                        {value}
                    </Typography>

                </Box>

                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        minWidth: 48,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {icon}
                </Box>

            </Box>

            {subtitle && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {subtitle}
                </Typography>
            )}

        </Paper>

    );

};

export default StatCard;
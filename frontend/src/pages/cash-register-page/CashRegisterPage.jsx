import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Button
} from "@mui/material";

import {
    PointOfSale,
    LockOpen,
    Lock
} from "@mui/icons-material";

import OpenCashRegister from "../../components/cash-register/OpenCashRegister";
import { useCashRegisterStore } from "../../store/cashRegister";

const CashRegisterPage = () => {

    const [openDialog, setOpenDialog] = useState(false);

    const {
        cashRegister
    } = useCashRegisterStore();

    const isOpen = cashRegister?.status === "open";

    return (
        <Box
            sx={{
                p: 3
            }}
        >

            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <PointOfSale
                        sx={{
                            fontSize: 32
                        }}
                    />

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Caisse
                    </Typography>

                </Box>

            </Box>


            {/* CAISSE FERMÉE */}
            {!isOpen && (

                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3
                    }}
                >

                    <Lock
                        sx={{
                            fontSize: 55,
                            mb: 2
                        }}
                    />

                    <Typography
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                    >
                        Caisse fermée
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 3
                        }}
                    >
                        Vous devez ouvrir la caisse
                        avant de commencer les ventes.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LockOpen />}
                        onClick={() =>
                            setOpenDialog(true)
                        }
                    >
                        Ouvrir la caisse
                    </Button>

                </Paper>

            )}


            {/* CAISSE OUVERTE */}
            {isOpen && (

                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        borderRadius: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                    >
                        🟢 Caisse ouverte
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 2
                        }}
                    >
                        Fond de caisse
                    </Typography>

                    <Typography
                        variant="h3"
                        fontWeight={700}
                    >
                        {Number(
                            cashRegister.openingCash
                        ).toFixed(2)} €
                    </Typography>

                </Paper>

            )}


            {/* DIALOG OUVERTURE */}

            <OpenCashRegister
                open={openDialog}
                onClose={() =>
                    setOpenDialog(false)
                }
            />

        </Box>
    );
};

export default CashRegisterPage;
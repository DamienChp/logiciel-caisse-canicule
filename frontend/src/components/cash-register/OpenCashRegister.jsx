import React, { useMemo, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    Divider
} from "@mui/material";

import { useCashRegisterStore } from "../../store/cashRegister";

const DENOMINATIONS = [
    {
        type: "billet",
        value: 500,
        label: "500 €"
    },
    {
        type: "billet",
        value: 200,
        label: "200 €"
    },
    {
        type: "billet",
        value: 100,
        label: "100 €"
    },
    {
        type: "billet",
        value: 50,
        label: "50 €"
    },
    {
        type: "billet",
        value: 20,
        label: "20 €"
    },
    {
        type: "billet",
        value: 10,
        label: "10 €"
    },
    {
        type: "billet",
        value: 5,
        label: "5 €"
    },
    {
        type: "piece",
        value: 2,
        label: "2 €"
    },
    {
        type: "piece",
        value: 1,
        label: "1 €"
    },
    {
        type: "piece",
        value: 0.5,
        label: "0,50 €"
    },
    {
        type: "piece",
        value: 0.2,
        label: "0,20 €"
    },
    {
        type: "piece",
        value: 0.1,
        label: "0,10 €"
    },
    {
        type: "piece",
        value: 0.05,
        label: "0,05 €"
    },
    {
        type: "piece",
        value: 0.02,
        label: "0,02 €"
    },
    {
        type: "piece",
        value: 0.01,
        label: "0,01 €"
    }
];

const OpenCashRegister = ({open, onClose}) => {

    const {
        openCashRegister,
        loading
    } = useCashRegisterStore();

    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (value, quantity) => {

        const parsedQuantity = Number(quantity);

        setQuantities((current) => ({
            ...current,
            [value]: Number.isNaN(
                parsedQuantity
            )
                ? 0
                : Math.max(
                    0,
                    Math.floor(
                        parsedQuantity
                    )
                )
        }));
    };

    const total = useMemo(() => {

        return DENOMINATIONS.reduce(
            (sum, denomination) => {

                const quantity =
                    quantities[
                        denomination.value
                    ] || 0;

                return (
                    sum +
                    denomination.value *
                    quantity
                );

            },
            0
        );

    }, [quantities]);

    const handleOpen = async () => {

        try {

            await openCashRegister(
                Number(total.toFixed(2))
            );

            setQuantities({});
            onClose();

        } catch (error) {

            console.error(
                error
            );
        }
    };

    const handleClose = () => {

        setQuantities({});
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Ouverture de caisse
            </DialogTitle>

            <DialogContent>

                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 3
                    }}
                >
                    Comptez les billets et les
                    pièces présents dans la caisse.
                </Typography>

                {/* BILLETS */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        mb: 1.5
                    }}
                >
                    💶 Billets
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >

                    {DENOMINATIONS
                        .filter(
                            (item) =>
                                item.type ===
                                "billet"
                        )
                        .map(
                            (denomination) => {

                                const quantity =
                                    quantities[
                                        denomination.value
                                    ] || 0;

                                const subtotal =
                                    denomination.value *
                                    quantity;

                                return (
                                    <Box
                                        key={
                                            denomination.value
                                        }
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 2
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                width: 70,
                                                fontWeight:
                                                    500
                                            }}
                                        >
                                            {
                                                denomination.label
                                            }
                                        </Typography>

                                        <TextField
                                            size="small"
                                            type="number"
                                            value={
                                                quantity
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleQuantityChange(
                                                    denomination.value,
                                                    event.target.value
                                                )
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0,
                                                    step: 1
                                                }
                                            }}
                                            sx={{
                                                width: 100
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                ml: "auto",
                                                minWidth: 80,
                                                textAlign:
                                                    "right"
                                            }}
                                        >
                                            {subtotal.toFixed(
                                                2
                                            )} €
                                        </Typography>

                                    </Box>
                                );
                            }
                        )}

                </Box>

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                {/* PIECES */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        mb: 1.5
                    }}
                >
                    🪙 Pièces
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >

                    {DENOMINATIONS
                        .filter(
                            (item) =>
                                item.type ===
                                "piece"
                        )
                        .map(
                            (denomination) => {

                                const quantity =
                                    quantities[
                                        denomination.value
                                    ] || 0;

                                const subtotal =
                                    denomination.value *
                                    quantity;

                                return (
                                    <Box
                                        key={
                                            denomination.value
                                        }
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 2
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                width: 70,
                                                fontWeight:
                                                    500
                                            }}
                                        >
                                            {
                                                denomination.label
                                            }
                                        </Typography>

                                        <TextField
                                            size="small"
                                            type="number"
                                            value={
                                                quantity
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleQuantityChange(
                                                    denomination.value,
                                                    event.target.value
                                                )
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0,
                                                    step: 1
                                                }
                                            }}
                                            sx={{
                                                width: 100
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                ml: "auto",
                                                minWidth: 80,
                                                textAlign:
                                                    "right"
                                            }}
                                        >
                                            {subtotal.toFixed(
                                                2
                                            )} €
                                        </Typography>

                                    </Box>
                                );
                            }
                        )}

                </Box>

                <Divider
                    sx={{
                        my: 3
                    }}
                />

                {/* TOTAL */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Fond de caisse
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {total.toFixed(2)} €
                    </Typography>

                </Box>

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    onClick={handleClose}
                >
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    onClick={handleOpen}
                    disabled={
                        loading ||
                        total <= 0
                    }
                >
                    {loading
                        ? "Ouverture..."
                        : "Ouvrir la caisse"
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default OpenCashRegister;
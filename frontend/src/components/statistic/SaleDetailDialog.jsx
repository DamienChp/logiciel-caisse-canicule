import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Chip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@mui/material";

import { Person, Payments, Event } from "@mui/icons-material";

import { formatEuro } from "../../store/statistic";

// ======================================================
// LIBELLÉS DES MOYENS DE PAIEMENT
// ======================================================

const paymentMethodLabel = {

    cash: "Espèces",
    card: "Carte bancaire",
    cheque: "Chèque",
    check: "Chèque"

};


// ======================================================
// DIALOG : RÉCAPITULATIF D'UNE VENTE
// ======================================================

const SaleDetailDialog = ({ open, sale, onClose }) => {

    if (!sale) {
        return null;
    }


    const customer = sale.customer;

    const customerName = customer
        ? (customer.fullName ||
            `${customer.first_name || ""} ${customer.last_name || ""}`.trim())
        : null;


    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle sx={{ fontWeight: "bold" }}>
                Détail de la vente
            </DialogTitle>

            <DialogContent dividers>

                {/* ==================================== */}
                {/* INFOS GÉNÉRALES */}
                {/* ==================================== */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 3
                    }}
                >

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        <Event fontSize="small" color="action" />

                        <Typography variant="body2">

                            {new Date(sale.createdAt).toLocaleString("fr-FR", {
                                dateStyle: "long",
                                timeStyle: "short"
                            })}

                        </Typography>

                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        <Payments fontSize="small" color="action" />

                        <Chip
                            label={
                                paymentMethodLabel[sale.paymentMethod] ||
                                sale.paymentMethod
                            }
                            size="small"
                        />

                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        <Person fontSize="small" color="action" />

                        <Typography variant="body2">

                            {customerName || "Client non assigné"}

                        </Typography>

                    </Box>

                </Box>


                <Divider sx={{ mb: 2 }} />


                {/* ==================================== */}
                {/* PRODUITS */}
                {/* ==================================== */}

                <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                >
                    Produits
                </Typography>

                <Table size="small">

                    <TableHead>

                        <TableRow>

                            <TableCell>Produit</TableCell>
                            <TableCell align="right">Qté</TableCell>
                            <TableCell align="right">Prix unitaire</TableCell>
                            <TableCell align="right">Sous-total</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {sale.products.map((item, index) => {

                            const name =
                                item.name ||
                                item.product?.name ||
                                "Produit";

                            const unitPrice = Number(
                                item.price ?? item.product?.price ?? 0
                            );

                            const quantity = Number(item.quantity || 0);

                            return (

                                <TableRow key={index}>

                                    <TableCell>{name}</TableCell>
                                    <TableCell align="right">{quantity}</TableCell>
                                    <TableCell align="right">
                                        {formatEuro(unitPrice)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatEuro(unitPrice * quantity)}
                                    </TableCell>

                                </TableRow>

                            );

                        })}

                    </TableBody>

                </Table>


                <Divider sx={{ my: 2 }} />


                {/* ==================================== */}
                {/* TOTAL */}
                {/* ==================================== */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Total
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {formatEuro(Number(sale.total || 0))}
                    </Typography>

                </Box>

            </DialogContent>

            <DialogActions>

                <Button
                    variant="contained" 
                    onClick={onClose}
                >
                    Fermer
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default SaleDetailDialog;
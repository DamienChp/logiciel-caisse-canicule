import React, { useState } from 'react'

import {
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";

// import {
//     CreditCard,
//     Payments,
//     Receipt
// } from "@mui/icons-material";

import { useCartStore } from "../../store/cart";
import { useSaleStore } from "../../store/sale"

const PaymentButtons = () => {

    const cart = useCartStore(
        (state) => state.cart
    );

    const client = useCartStore(
        (state) => state.client
    );

    const cartDiscount = useCartStore(
        (state) => state.cartDiscount
    );

    const getTotal = useCartStore(
        (state) => state.getTotal
    );

    const clearCart = useCartStore(
        (state) => state.clearCart
    );

    const createSale = useSaleStore(
        (state) => state.createSale
    );

    const loading = useSaleStore(
        (state) => state.loading
    );

    // Moyen de paiement sélectionné
    const [selectedPayment, setSelectedPayment] = useState(null);

    // Ouverture de la fenêtre reçu
    const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);


    const handlePayment = async (paymentMethod) => {

        // Aucun produit dans le panier
        if (cart.length === 0) {
            return;
        }

        // On mémorise le moyen de paiement
        setSelectedPayment(paymentMethod);

        // Si un client est associé,
        // on demande comment envoyer le reçu
        if (client) {
            setReceiptDialogOpen(true);
            return;
        }

        // Sinon on enregistre directement
        await processSale(
            paymentMethod,
            null
        );
    };

    const processSale = async (paymentMethod, receiptMethod) => {
        const saleData = {

            // Peut être null si aucun client
            customer: client?._id || null,

            products: cart.map((product) => ({
                product: product._id,
                size: product.size || null,
                quantity: product.quantity,
                priceTTC: product.priceTTC,
                discount: product.discount || 0
            })),

            // Remise globale
            cartDiscount: cartDiscount || 0,

            // Total final
            total: getTotal(),

            // Moyen de paiement
            paymentMethod,

            // Moyen d'envoi du reçu
            receiptMethod
        };

        const result = await createSale(
            saleData
        );

        if (result.success) {

            clearCart();

            // Ferme la popup
            setReceiptDialogOpen(false);

            setSelectedPayment(null);
        };
    };

    const handleReceipt = async (receiptMethod) => {

        if (!selectedPayment) {
            return;
        }

        await processSale(
            selectedPayment,
            receiptMethod
        );
    };


    return (

        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    width: "100%"
                }}
            >

                <Button
                    variant="contained"
                    // startIcon={<CreditCard />}
                    disabled={
                        loading ||
                        cart.length === 0
                    }
                    onClick={() => handlePayment("card")}
                    sx={{
                        flex: 1
                    }}
                >
                    CB
                </Button>

                <Button
                    variant="contained"
                    // startIcon={<Payments />}
                    disabled={
                        loading ||
                        cart.length === 0
                    }
                    onClick={() => handlePayment("cash")}
                    sx={{
                        flex: 1
                    }}
                >
                    Cash
                </Button>

                <Button
                    variant="contained"
                    // startIcon={<Receipt />}
                    disabled={
                        loading ||
                        cart.length === 0
                    }
                    onClick={() => handlePayment("cheque")}
                    sx={{
                        flex: 1
                    }}
                >
                    Chèque
                </Button>

            </Stack>

            <Dialog
                open={receiptDialogOpen}
                onClose={() =>
                    setReceiptDialogOpen(false)
                }
                fullWidth
                maxWidth="xs"
            >

                <DialogTitle>
                    Envoyer le reçu 
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        Comment souhaitez-vous envoyer
                        le reçu à {client?.first_name} {client?.last_name} ?
                    </Typography>

                </DialogContent>

                <DialogActions
                    sx={{
                        flexDirection: "column",
                        gap: 1,
                        p: 2
                    }}
                >

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() =>
                            handleReceipt("email")
                        }
                        disabled={loading}
                    >
                        Envoyer par email
                    </Button>


                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() =>
                            handleReceipt("phone")
                        }
                        disabled={loading}
                    >
                        Envoyer par téléphone
                    </Button>


                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() =>
                            handleReceipt(null)
                        }
                        disabled={loading}
                    >
                        Ne pas envoyer
                    </Button>

                </DialogActions>

            </Dialog>
        </>
    );
};

export default PaymentButtons;
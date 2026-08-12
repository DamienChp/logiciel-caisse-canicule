import React, { useState } from "react";

import {
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    LinearProgress,
    Snackbar,
    Alert
} from "@mui/material";

import { useCartStore } from "../../store/cart";
import { useSaleStore } from "../../store/sale";


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

    const sendSaleReceipt = useSaleStore(
        (state) => state.sendSaleReceipt
    );

    const loading = useSaleStore(
        (state) => state.loading
    );


    // MOYEN DE PAIEMENT SÉLECTIONNÉ
    const [selectedPayment, setSelectedPayment] =
        useState(null);


    // OUVERTURE POPUP REÇU
    const [receiptDialogOpen, setReceiptDialogOpen] =
        useState(false);


    // ENVOI DU REÇU EN COURS
    const [sendingReceipt, setSendingReceipt] = useState(false);


    // ==========================================
    // MESSAGE DE SUCCÈS
    // ==========================================

    const [successMessage, setSuccessMessage] = useState("");


    const [successOpen, setSuccessOpen] = useState(false);


    // ==========================================
    // CLIQUE SUR CB / CASH / CHÈQUE
    // ==========================================

    const handlePayment = async (paymentMethod) => {

        // Aucun produit
        if (cart.length === 0) {
            return;
        }

        // On mémorise le moyen de paiement
        setSelectedPayment(paymentMethod);

        // AVEC CLIENT
        if (client) {
            setReceiptDialogOpen(true);
            return;
        }

        // SANS CLIENT
        await processSale(
            paymentMethod,
            null
        );

    };


    // ==========================================
    // CRÉATION DE LA VENTE
    // ==========================================

    const processSale = async (paymentMethod, receiptMethod) => {

        // DONNÉES DE LA VENTE
        const saleData = {

            // Client éventuellement null
            customer: client?._id || null,

            // Produits du panier
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


        // CRÉATION DE LA VENTE
        const result = await createSale(saleData);

        // Vente non créée
        if (!result.success) {
            return;
        }

        // ID DE LA VENTE
        const saleId = result.sale._id;

        // ======================================
        // EMAIL
        // ======================================

        if (receiptMethod === "email") {

            setSendingReceipt(true);

            const receiptResult = await sendSaleReceipt(saleId);

            // Envoi échoué
            if (!receiptResult.success) {
                setSendingReceipt(false);
                return;
            }

            // Envoi terminé
            setSendingReceipt(false);

            // Message de succès
            setSuccessMessage("Le reçu a bien été envoyé par email.");

            setSuccessOpen(true);
        }


        // ======================================
        // TÉLÉPHONE
        // ======================================

        if (receiptMethod === "phone") {

            setSendingReceipt(true);

            /*
            =====================================
            À FAIRE PLUS TARD

            const receiptResult =
                await sendSaleReceiptByPhone(
                    saleId
                );

            if (!receiptResult.success) {

                setSendingReceipt(false);

                return;
            }
            =====================================
            */

            // Pour le moment
            // on simule la fin de l'envoi
            setSendingReceipt(false);

            setSuccessMessage("Le reçu sera envoyé par téléphone.");

            setSuccessOpen(true);
        }

        // ======================================
        // AUCUN RECU
        // ======================================

        if (receiptMethod === null ) {
            let paymentMethodFR = paymentMethod;

            if (paymentMethod === "card") {
                paymentMethodFR = "carte";
            }

            if (paymentMethod === "cash") {
                paymentMethodFR = "espèces";
            }

            if (paymentMethod === "cheque") {
                paymentMethodFR = "chèque";
            }
            setSuccessMessage(`Vente par ${paymentMethodFR} à bien été enregistré`);
            
            setSuccessOpen(true);
        }


        // ======================================
        // FIN DE LA VENTE
        // ======================================

        clearCart();

        // Fermer le popup
        setReceiptDialogOpen(false);

        // Réinitialiser le paiement
        setSelectedPayment(null);
    };


    // ==========================================
    // CHOIX DU REÇU
    // ==========================================

    const handleReceipt = async (
        receiptMethod
    ) => {

        // Aucun moyen de paiement
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

            {/* ================================= */}
            {/* BOUTONS DE PAIEMENT                */}
            {/* ================================= */}

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    width: "100%"
                }}
            >

                {/* ============================= */}
                {/* CB                            */}
                {/* ============================= */}

                <Button
                    variant="contained"

                    disabled={
                        loading ||
                        sendingReceipt ||
                        cart.length === 0
                    }

                    onClick={() =>
                        handlePayment("card")
                    }

                    sx={{
                        flex: 1
                    }}
                >
                    CB
                </Button>


                {/* ============================= */}
                {/* CASH                          */}
                {/* ============================= */}

                <Button
                    variant="contained"

                    disabled={
                        loading ||
                        sendingReceipt ||
                        cart.length === 0
                    }

                    onClick={() =>
                        handlePayment("cash")
                    }

                    sx={{
                        flex: 1
                    }}
                >
                    Cash
                </Button>


                {/* ============================= */}
                {/* CHÈQUE                        */}
                {/* ============================= */}

                <Button
                    variant="contained"

                    disabled={
                        loading ||
                        sendingReceipt ||
                        cart.length === 0
                    }

                    onClick={() =>
                        handlePayment("cheque")
                    }

                    sx={{
                        flex: 1
                    }}
                >
                    Chèque
                </Button>

            </Stack>


            {/* ================================= */}
            {/* POPUP CHOIX DU REÇU               */}
            {/* ================================= */}

            <Dialog
                open={receiptDialogOpen}

                onClose={() => {

                    if (!sendingReceipt) {

                        setReceiptDialogOpen(
                            false
                        );
                    }

                }}

                fullWidth

                maxWidth="xs"
            >

                <DialogTitle>
                    Envoyer le reçu
                </DialogTitle>


                <DialogContent>

                    <Typography>
                        Comment souhaitez-vous
                        envoyer le reçu à{" "}

                        {client?.first_name}{" "}

                        {client?.last_name} ?
                    </Typography>


                    {/* ========================= */}
                    {/* BARRE DE CHARGEMENT       */}
                    {/* ========================= */}

                    {sendingReceipt && (

                        <Stack
                            spacing={1}
                            sx={{
                                mt: 3
                            }}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Envoi du reçu...
                            </Typography>


                            <LinearProgress />

                        </Stack>
                    )}

                </DialogContent>


                <DialogActions
                    sx={{
                        flexDirection: "column",
                        gap: 1,
                        p: 2
                    }}
                >

                    {/* ========================= */}
                    {/* EMAIL                     */}
                    {/* ========================= */}

                    <Button
                        fullWidth
                        variant="contained"

                        onClick={() =>
                            handleReceipt(
                                "email"
                            )
                        }

                        disabled={
                            loading ||
                            sendingReceipt
                        }
                    >
                        Envoyer par email
                    </Button>


                    {/* ========================= */}
                    {/* TÉLÉPHONE                 */}
                    {/* ========================= */}

                    <Button
                        fullWidth
                        variant="contained"

                        onClick={() =>
                            handleReceipt(
                                "phone"
                            )
                        }

                        disabled={
                            loading ||
                            sendingReceipt
                        }
                    >
                        Envoyer par téléphone
                    </Button>


                    {/* ========================= */}
                    {/* NE PAS ENVOYER            */}
                    {/* ========================= */}

                    <Button
                        fullWidth
                        variant="outlined"

                        onClick={() =>
                            handleReceipt(null)
                        }

                        disabled={
                            loading ||
                            sendingReceipt
                        }
                    >
                        Ne pas envoyer
                    </Button>

                </DialogActions>

            </Dialog>


            {/* ================================= */}
            {/* POPUP SUCCÈS                      */}
            {/* ================================= */}

            <Snackbar
                open={successOpen}

                autoHideDuration={3000}

                onClose={() =>
                    setSuccessOpen(false)
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    onClose={() =>
                        setSuccessOpen(false)
                    }

                    severity="success"

                    variant="filled"

                    sx={{
                        width: "100%"
                    }}
                >
                    {successMessage}
                </Alert>

            </Snackbar>

        </>
    );
};


export default PaymentButtons;
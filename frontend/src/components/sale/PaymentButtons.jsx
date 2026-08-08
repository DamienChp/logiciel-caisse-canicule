import {
    Button,
    Stack
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

    const handlePayment = async (paymentMethod) => {

        // Aucun produit dans le panier
        if (cart.length === 0) {
            return;
        }

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
            paymentMethod
        };

        const result = await createSale(
            saleData
        );

        // On vide le panier uniquement
        // si la vente a bien été enregistrée
        if (result.success) {
            clearCart();
        }
    };

    return (
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
    );
};

export default PaymentButtons;
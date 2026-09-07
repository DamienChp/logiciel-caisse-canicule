import React, { 
    useCallback, 
    useEffect, 
    useState,
    useRef
} from 'react'

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material'

import ClientSelector from '../../components/sale/ClientSelector.jsx';
import SaleProductTable from "../../components/sale/SaleProductTable.jsx"
import PaymentButtons from '../../components/sale/PaymentButtons.jsx';
import ProductSelector from '../../components/sale/ProductSelector.jsx';
import BarcodeScanner from '../../components/BarcodeScanner.jsx';

import { useProductStore } from "../../store/product.js"
import { useCartStore } from '../../store/cart.js';


const SalePage = () => {

    // ======================================================
    // PRODUITS
    // ======================================================

    const {
        products,
        getAllProducts
    } = useProductStore();

    const [isTabletDevice, setIsTabletDevice] = useState(false);


    // ======================================================
    // CART STORE
    // ======================================================

    const {
        carts,
        activeCartId,
        setActiveCart,

        getActiveCart,

        setClient,
        addProduct,

        setCartDiscount,
        setCartDiscountType,

        getProductsTotal,
        getTotal
    } = useCartStore();

    
    // ======================================================
    // VENTE ACTIVE
    // ======================================================
    
    const activeCart = getActiveCart();

    const client = activeCart?.client || null;
    const cart = activeCart?.cart || [];
    const cartDiscount = activeCart?.cartDiscount || 0;
    const cartDiscountType = activeCart?.cartDiscountType || "percent";


    // ======================================================
    // PRODUITS
    // ======================================================

    useEffect(() => {
        getAllProducts();
        setIsTabletDevice(isTablet());

    }, [getAllProducts]);


    // ======================================================
    // TOTALS
    // ======================================================

    const productsTotal = getProductsTotal();
    const total = getTotal();


    // ======================================================
    // SCAN BARCODE
    // ======================================================

    const handleScan = useCallback(
        async (barcode) => {

            const product = products.find(
                (p) =>
                    String(p.barcode).trim() ===
                    String(barcode).trim()
            );

            if (!product) {
                alert("Produit introuvable");
                return;
            }

            addProduct(product);

        },
        [products, addProduct]
    );

    const barcodeBuffer = useRef("");
    const barcodeTimeout = useRef(null);

    useEffect(() => {

        const handleKeyDown = (event) => {

            // ENTER = fin du scan
            if (event.key === "Enter") {

                const barcode = barcodeBuffer.current.trim();

                if (barcode) {

                    console.log(
                        "Scanner physique :",
                        barcode
                    );

                    handleScan(barcode);

                    barcodeBuffer.current = "";
                }

                return;
            }

            // On récupère les caractères envoyés par la scanette
            if (event.key.length === 1) {

                barcodeBuffer.current += event.key;

                clearTimeout(barcodeTimeout.current);

                barcodeTimeout.current = setTimeout(() => {
                    barcodeBuffer.current = "";
                }, 100);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            clearTimeout(
                barcodeTimeout.current
            );
        };

    }, [handleScan]);


    // ======================================================
    // SELECTEUR PRODUIT
    // ======================================================

    const handleProductSelect = useCallback(
        (product) => {
            addProduct(product);
        },
        [addProduct]
    );

    // ======================================================
    // Vérification tablette ou ordinateur 
    // ======================================================

    const isTablet = () => {
        const userAgent = navigator.userAgent.toLowerCase();

        return (
            /ipad|tablet|android(?!.*mobile)/i.test(userAgent)
        );
    };


    return (

        <Box
            sx={{
                flex: 1,
                width: "100%",
                height: "100%",
                minHeight: 0,
                boxSizing: "border-box",

                p: 2,

                overflow: "hidden",

                display: "flex",
                flexDirection: "column",

                gap: 1.5
            }}
        >

            {/* ================================================= */}
            {/* SELECTEUR DES VENTES */}
            {/* ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 1,
                    borderRadius: 2,
                    display: "flex",
                    gap: 1
                }}
            >

                {carts.map((sale, index) => (

                    <Button
                        key={sale.id}
                        variant={
                            sale.id === activeCartId
                                ? "contained"
                                : "outlined"
                        }
                        onClick={() =>
                            setActiveCart(sale.id)
                        }
                        sx={{
                            flex: 1,
                            height: 25
                        }}
                    >
                        Vente {index + 1}
                    </Button>

                ))}

            </Paper>


            {/* ================================================= */}
            {/* HEADER CLIENT + TOTAL */}
            {/* ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 2
                }}
            >

                <ClientSelector
                    client={client}
                    setClient={setClient}
                />


                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                    }}
                >

                    {/* REMISE PANIER */}

                    <Box
                        sx={{
                            textAlign: "right"
                        }}
                    >

                        <Typography sx={{ mb: 1 }}>
                            Remise panier
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "flex-end"
                            }}
                        >

                            <TextField
                                type="number"
                                size="small"
                                value={cartDiscount}
                                onChange={(e) =>
                                    setCartDiscount(
                                        e.target.value
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    ...(cartDiscountType === "percent"
                                        ? { max: 100 }
                                        : {})
                                }}
                                sx={{
                                    width: 100
                                }}
                                InputProps={{
                                    endAdornment:
                                        cartDiscountType === "percent"
                                            ? "%"
                                            : "€"
                                }}
                            />

                            <ToggleButtonGroup
                                value={cartDiscountType}
                                exclusive
                                size="small"
                                onChange={(e, newType) => {
                                    if (newType !== null) {
                                        setCartDiscountType(newType);
                                    }
                                }}
                            >
                                <ToggleButton value="percent">
                                    %
                                </ToggleButton>
                                <ToggleButton value="amount">
                                    €
                                </ToggleButton>
                            </ToggleButtonGroup>

                        </Box>

                    </Box>


                    {/* TOTAL */}

                    <Box
                        sx={{
                            textAlign: "right"
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total vente
                        </Typography>


                        {cartDiscount > 0 && (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    textDecoration:
                                        "line-through"
                                }}
                            >
                                {productsTotal.toFixed(2)} €
                            </Typography>

                        )}


                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {total.toFixed(2)} €
                        </Typography>

                    </Box>

                </Box>

            </Paper>


            {/* ================================================= */}
            {/* ZONE CENTRALE */}
            {/* ================================================= */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    gap: 2
                }}
            >

                {/* ================================================= */}
                {/* CAMERA */}
                {/* ================================================= */}

                {isTabletDevice && (
                    <Paper
                        elevation={2}
                        sx={{
                            flex: 1,
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            overflow: "hidden"
                        }}
                    >

                        <Typography
                            variant="h6"
                            mb={2}
                        >
                            Scanner
                        </Typography>

                        <Box
                            sx={{
                                flex: 1,
                                minHeight: 0
                            }}
                        >

                            <BarcodeScanner
                                onScan={handleScan}
                            />

                        </Box>

                    </Paper>
                )}


                {/* ================================================= */}
                {/* TABLEAU */}
                {/* ================================================= */}

                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden"
                    }}
                >

                    <Box
                        pb={2}
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center"
                        }}
                    >

                        <Typography variant="h6">
                            Produits
                        </Typography>


                        <ProductSelector
                            products={products}
                            onSelect={handleProductSelect}
                        />

                    </Box>


                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 10,
                            overflow: "hidden"
                        }}
                    >

                        <SaleProductTable
                            products={cart}
                        />

                    </Box>

                </Paper>

            </Box>


            {/* ================================================= */}
            {/* FOOTER PAIEMENT */}
            {/* ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: 2
                }}
            >

                <Typography
                    variant="h6"
                    mb={2}
                >
                    Encaissement
                </Typography>

                <PaymentButtons />

            </Paper>

        </Box>
    )
}

export default SalePage
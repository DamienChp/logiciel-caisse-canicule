import React, { useCallback, useEffect, useState } from 'react'

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button
} from '@mui/material'

import BarcodeScanner from "../../components/stock/BarcodeScanner.jsx"
import ClientSelector from '../../components/sale/ClientSelector.jsx';
import SaleProductTable from "../../components/sale/SaleProductTable.jsx"
import PaymentButtons from '../../components/sale/PaymentButtons.jsx';
import ProductSelector from '../../components/sale/ProductSelector.jsx';

import { useProductStore } from "../../store/product.js"
import { useCartStore } from '../../store/cart.js';

const SalePage = () => {

    const [open, setOpen] = useState(false)

    const {
        products,
        getAllProducts
    } = useProductStore();

    const {
        client,
        cart,
        setClient,
        addProduct,
        cartDiscount,
        setCartDiscount,
        getSubtotal,
        getProductsTotal,
        getTotal
    } = useCartStore();

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    const subtotal = getSubtotal();
    const productsTotal = getProductsTotal();
    const total = getTotal();

    const handleScan = useCallback(async (barcode) => {

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

    }, [products, addProduct]);

    const handleProductSelect = useCallback((product) => {
        addProduct(product);
    }, [addProduct]);

    return (

        <Box
            sx={{
                flex: 8,
                p: 2,
                height: "80dvh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >

            {/* HEADER CLIENT + TOTAL */}

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
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >

                        <Typography>
                            Remise panier
                        </Typography>

                        <TextField
                            type="number"
                            size="small"
                            value={cartDiscount}
                            onChange={(e) =>
                                setCartDiscount(e.target.value)
                            }
                            inputProps={{
                                min: 0,
                                max: 100
                            }}
                            sx={{
                                width: 100
                            }}
                            InputProps={{
                                endAdornment: "%"
                            }}
                        />

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
                                    textDecoration: "line-through"
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


            {/* ZONE CENTRALE */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    gap: 2
                }}
            >

                {/* CAMERA */}

                <Paper
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


                {/* TABLEAU */}

                <Paper
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
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                        >
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


            {/* FOOTER PAIEMENT */}

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
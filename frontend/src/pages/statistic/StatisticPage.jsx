import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    TextField,
    MenuItem
} from "@mui/material";

import {
    Euro,
    ShoppingCart,
    Inventory,
    Payments,
    ReceiptLong
} from "@mui/icons-material";

import { useSaleStore } from "../../store/sale.js";


// ======================================================
// CARTE STATISTIQUE
// ======================================================

const StatCard = ({
    title,
    value,
    subtitle,
    icon
}) => {

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

                <Box
                    sx={{
                        minWidth: 0
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1
                        }}
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
                    sx={{
                        mt: 2
                    }}
                >
                    {subtitle}
                </Typography>

            )}

        </Paper>

    );

};


// ======================================================
// PAGE STATISTIQUES
// ======================================================

const StatisticPage = () => {

    const {
        sales,
        getAllSales,
        loading,
        error
    } = useSaleStore();


    const [period, setPeriod] = useState("today");


    // ==================================================
    // RÉCUPÉRATION DES VENTES
    // ==================================================

    useEffect(() => {

        getAllSales();

    }, []);


    // ==================================================
    // NOM DE LA PÉRIODE
    // ==================================================

    const periodLabel = {

        today: "Aujourd'hui",

        week: "Cette semaine",

        month: "Ce mois",

        year: "Cette année",

        all: "Toutes les ventes"

    };


    // ==================================================
    // FILTRAGE DES VENTES
    // ==================================================

    const filteredSales = useMemo(() => {

        if (!sales || sales.length === 0) {
            return [];
        }


        if (period === "all") {
            return sales;
        }


        const now = new Date();


        return sales.filter((sale) => {

            const saleDate =
                new Date(sale.createdAt);


            // ==========================================
            // AUJOURD'HUI
            // ==========================================

            if (period === "today") {

                return (

                    saleDate.getDate() ===
                        now.getDate()

                    &&

                    saleDate.getMonth() ===
                        now.getMonth()

                    &&

                    saleDate.getFullYear() ===
                        now.getFullYear()

                );

            }


            // ==========================================
            // CETTE SEMAINE
            // ==========================================

            if (period === "week") {

                const currentDay =
                    now.getDay();


                const difference =
                    currentDay === 0
                        ? 6
                        : currentDay - 1;


                const startOfWeek =
                    new Date(now);


                startOfWeek.setHours(
                    0,
                    0,
                    0,
                    0
                );


                startOfWeek.setDate(
                    now.getDate() -
                    difference
                );


                return saleDate >= startOfWeek;

            }


            // ==========================================
            // CE MOIS
            // ==========================================

            if (period === "month") {

                return (

                    saleDate.getMonth() ===
                        now.getMonth()

                    &&

                    saleDate.getFullYear() ===
                        now.getFullYear()

                );

            }


            // ==========================================
            // CETTE ANNÉE
            // ==========================================

            if (period === "year") {

                return (

                    saleDate.getFullYear() ===
                    now.getFullYear()

                );

            }


            return false;

        });

    }, [sales, period]);


    // ==================================================
    // CHIFFRE D'AFFAIRES
    // ==================================================

    const revenue = useMemo(() => {

        return filteredSales.reduce(
            (total, sale) => {

                return (
                    total +
                    Number(sale.total || 0)
                );

            },
            0
        );

    }, [filteredSales]);


    // ==================================================
    // NOMBRE DE VENTES
    // ==================================================

    const numberOfSales =
        filteredSales.length;


    // ==================================================
    // PANIER MOYEN
    // ==================================================

    const averageBasket =
        numberOfSales > 0
            ? revenue / numberOfSales
            : 0;


    // ==================================================
    // PRODUITS VENDUS
    // ==================================================

    const productsSold = useMemo(() => {

        return filteredSales.reduce(
            (total, sale) => {

                return (

                    total +

                    sale.products.reduce(
                        (
                            quantity,
                            item
                        ) => {

                            return (
                                quantity +
                                Number(
                                    item.quantity || 0
                                )
                            );

                        },
                        0
                    )

                );

            },
            0
        );

    }, [filteredSales]);


    // ==================================================
    // MOYENS DE PAIEMENT
    // ==================================================

    const paymentStats = useMemo(() => {

        const stats = {

            cash: 0,

            card: 0,

            cheque: 0

        };


        filteredSales.forEach((sale) => {

            if (
                sale.paymentMethod ===
                "cash"
            ) {

                stats.cash++;

            }


            if (
                sale.paymentMethod ===
                "card"
            ) {

                stats.card++;

            }


            if (
                sale.paymentMethod ===
                    "cheque"
                ||
                sale.paymentMethod ===
                    "check"
            ) {

                stats.cheque++;

            }

        });


        return stats;

    }, [filteredSales]);


    const totalPayments =
        filteredSales.length;


    const cashPercentage =
        totalPayments > 0
            ? (
                paymentStats.cash /
                totalPayments
            ) * 100
            : 0;


    const cardPercentage =
        totalPayments > 0
            ? (
                paymentStats.card /
                totalPayments
            ) * 100
            : 0;


    const chequePercentage =
        totalPayments > 0
            ? (
                paymentStats.cheque /
                totalPayments
            ) * 100
            : 0;


    // ==================================================
    // FORMAT EURO
    // ==================================================

    const formatEuro = (value) => {

        return new Intl.NumberFormat(
            "fr-FR",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(value);

    };


    // ==================================================
    // FORMAT POURCENTAGE
    // ==================================================

    const formatPercentage = (value) => {

        return `${value.toFixed(1)} %`;

    };


    // ==================================================
    // RENDU
    // ==================================================

    return (

        <Box
            sx={{
                flex: 8,
                width: "100%",
                boxSizing: "border-box",
                p: {
                    xs: 2,
                    md: 3
                }
            }}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    mb: 4
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        mb: 1
                    }}
                >
                    Statistiques
                </Typography>


                <Typography
                    color="text.secondary"
                >
                    Vue d'ensemble de votre activité
                </Typography>

            </Box>


            {/* ================================================= */}
            {/* MENU PÉRIODE */}
            {/* ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 4,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >

                <Typography
                    sx={{
                        fontWeight: 500
                    }}
                >
                    Période
                </Typography>


                <TextField
                    select
                    size="small"
                    value={period}
                    onChange={(event) => {

                        setPeriod(
                            event.target.value
                        );

                    }}
                    sx={{
                        minWidth: 220
                    }}
                >

                    <MenuItem value="today">
                        Aujourd'hui
                    </MenuItem>


                    <MenuItem value="week">
                        Cette semaine
                    </MenuItem>


                    <MenuItem value="month">
                        Ce mois
                    </MenuItem>


                    <MenuItem value="year">
                        Cette année
                    </MenuItem>


                    <MenuItem value="all">
                        Toutes les ventes
                    </MenuItem>

                </TextField>

            </Paper>


            {/* ================================================= */}
            {/* CHARGEMENT */}
            {/* ================================================= */}

            {loading && (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6
                    }}
                >

                    <CircularProgress />

                </Box>

            )}


            {/* ================================================= */}
            {/* ERREUR */}
            {/* ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                >
                    {error}
                </Alert>

            )}


            {!loading && (

                <>

                    {/* ========================================= */}
                    {/* PÉRIODE ACTIVE */}
                    {/* ========================================= */}

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            fontWeight: "bold"
                        }}
                    >
                        {periodLabel[period]}
                    </Typography>


                    {/* ========================================= */}
                    {/* CARTES PRINCIPALES */}
                    {/* ========================================= */}

                    <Grid
                        container
                        spacing={3}
                        sx={{
                            mb: 4
                        }}
                    >

                        {/* CA */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                lg: 3
                            }}
                        >

                            <StatCard
                                title="Chiffre d'affaires"
                                value={
                                    formatEuro(
                                        revenue
                                    )
                                }
                                subtitle={
                                    `${numberOfSales} vente(s)`
                                }
                                icon={
                                    <Euro />
                                }
                            />

                        </Grid>


                        {/* PANIER MOYEN */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                lg: 3
                            }}
                        >

                            <StatCard
                                title="Panier moyen"
                                value={
                                    formatEuro(
                                        averageBasket
                                    )
                                }
                                subtitle="Par vente"
                                icon={
                                    <ShoppingCart />
                                }
                            />

                        </Grid>


                        {/* VENTES */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                lg: 3
                            }}
                        >

                            <StatCard
                                title="Nombre de ventes"
                                value={
                                    numberOfSales
                                }
                                subtitle={
                                    periodLabel[
                                        period
                                    ]
                                }
                                icon={
                                    <ReceiptLong />
                                }
                            />

                        </Grid>


                        {/* PRODUITS */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                lg: 3
                            }}
                        >

                            <StatCard
                                title="Produits vendus"
                                value={
                                    productsSold
                                }
                                subtitle="Articles vendus"
                                icon={
                                    <Inventory />
                                }
                            />

                        </Grid>

                    </Grid>


                    {/* ================================================= */}
                    {/* MOYENS DE PAIEMENT */}
                    {/* ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2,
                                md: 3
                            },
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            mb: 4,
                            boxSizing: "border-box"
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 3
                            }}
                        >

                            <Payments />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold"
                                }}
                            >
                                Moyens de paiement
                            </Typography>

                        </Box>


                        <Grid
                            container
                            spacing={3}
                        >

                            {/* ================================= */}
                            {/* ESPÈCES */}
                            {/* ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 4
                                }}
                            >

                                <Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            mb: 1
                                        }}
                                    >

                                        <Typography>
                                            Espèces
                                        </Typography>


                                        <Typography
                                            fontWeight="bold"
                                        >
                                            {
                                                formatPercentage(
                                                    cashPercentage
                                                )
                                            }
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor:
                                                "action.hover",
                                            overflow: "hidden"
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width:
                                                    `${cashPercentage}%`,
                                                height: "100%",
                                                bgcolor:
                                                    "primary.main",
                                                transition:
                                                    "width 0.3s"
                                            }}
                                        />

                                    </Box>


                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mt: 1
                                        }}
                                    >
                                        {
                                            paymentStats.cash
                                        } vente(s)
                                    </Typography>

                                </Box>

                            </Grid>


                            {/* ================================= */}
                            {/* CARTE */}
                            {/* ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 4
                                }}
                            >

                                <Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            mb: 1
                                        }}
                                    >

                                        <Typography>
                                            Carte bancaire
                                        </Typography>


                                        <Typography
                                            fontWeight="bold"
                                        >
                                            {
                                                formatPercentage(
                                                    cardPercentage
                                                )
                                            }
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor:
                                                "action.hover",
                                            overflow: "hidden"
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width:
                                                    `${cardPercentage}%`,
                                                height: "100%",
                                                bgcolor:
                                                    "primary.main",
                                                transition:
                                                    "width 0.3s"
                                            }}
                                        />

                                    </Box>


                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mt: 1
                                        }}
                                    >
                                        {
                                            paymentStats.card
                                        } vente(s)
                                    </Typography>

                                </Box>

                            </Grid>


                            {/* ================================= */}
                            {/* CHÈQUE */}
                            {/* ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 4
                                }}
                            >

                                <Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            mb: 1
                                        }}
                                    >

                                        <Typography>
                                            Chèque
                                        </Typography>


                                        <Typography
                                            fontWeight="bold"
                                        >
                                            {
                                                formatPercentage(
                                                    chequePercentage
                                                )
                                            }
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor:
                                                "action.hover",
                                            overflow: "hidden"
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width:
                                                    `${chequePercentage}%`,
                                                height: "100%",
                                                bgcolor:
                                                    "primary.main",
                                                transition:
                                                    "width 0.3s"
                                            }}
                                        />

                                    </Box>


                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mt: 1
                                        }}
                                    >
                                        {
                                            paymentStats.cheque
                                        } vente(s)
                                    </Typography>

                                </Box>

                            </Grid>

                        </Grid>

                    </Paper>


                    {/* ================================================= */}
                    {/* RÉSUMÉ */}
                    {/* ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider"
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mb: 2
                            }}
                        >
                            Résumé
                        </Typography>


                        <Divider
                            sx={{
                                mb: 2
                            }}
                        />


                        <Typography
                            color="text.secondary"
                        >

                            {numberOfSales === 0

                                ? `Aucune vente pour ${
                                    periodLabel[
                                        period
                                    ].toLowerCase()
                                }.`

                                : `${numberOfSales} vente(s) pour un chiffre d'affaires de ${formatEuro(
                                    revenue
                                )}.`

                            }

                        </Typography>

                    </Paper>

                </>

            )}

        </Box>

    );

};

export default StatisticPage;
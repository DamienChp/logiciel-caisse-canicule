import React, { useEffect, useState } from "react";

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
import { useSalesStatistics, periodLabel, formatEuro } from "../../store/statistic.js";

import StatCard from "../../components/statistic/StatCard.jsx";
import PaymentMethodBar from "../../components/statistic/PaymentMethodBar.jsx";
import SalesTable from "../../components/statistic/SalesTable.jsx";


const StatisticPage = () => {

    const { sales, getAllSales, loading, error } = useSaleStore();

    const [period, setPeriod] = useState("today");


    useEffect(() => {

        getAllSales();

    }, []);


    const {
        filteredSales,
        numberOfSales,
        revenue,
        averageBasket,
        productsSold,
        paymentStats,
        cashPercentage,
        cardPercentage,
        chequePercentage
    } = useSalesStatistics(sales, period);


    // ==================================================
    // RENDU
    // ==================================================

    return (

        <Box
            sx={{
                flex: 8,
                width: "100%",
                boxSizing: "border-box",
                p: { xs: 2, md: 3 }
            }}
        >

            {/* HEADER */}

            <Box sx={{ mb: 4 }}>

                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    Statistiques
                </Typography>

                <Typography color="text.secondary">
                    Vue d'ensemble de votre activité
                </Typography>

            </Box>


            {/* MENU PÉRIODE */}

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

                <Typography sx={{ fontWeight: 500 }}>Période</Typography>

                <TextField
                    select
                    size="small"
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    sx={{ minWidth: 220 }}
                >

                    <MenuItem value="today">Aujourd'hui</MenuItem>
                    <MenuItem value="week">Cette semaine</MenuItem>
                    <MenuItem value="month">Ce mois</MenuItem>
                    <MenuItem value="year">Cette année</MenuItem>
                    <MenuItem value="all">Toutes les ventes</MenuItem>

                </TextField>

            </Paper>


            {/* CHARGEMENT */}

            {loading && (

                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress />
                </Box>

            )}


            {/* ERREUR */}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}


            {!loading && (

                <>

                    <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold" }}
                    >
                        {periodLabel[period]}
                    </Typography>


                    {/* CARTES PRINCIPALES */}

                    <Grid container spacing={3} sx={{ mb: 4 }}>

                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="Chiffre d'affaires"
                                value={formatEuro(revenue)}
                                subtitle={`${numberOfSales} vente(s)`}
                                icon={<Euro />}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="Panier moyen"
                                value={formatEuro(averageBasket)}
                                subtitle="Par vente"
                                icon={<ShoppingCart />}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="Nombre de ventes"
                                value={numberOfSales}
                                subtitle={periodLabel[period]}
                                icon={<ReceiptLong />}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="Produits vendus"
                                value={productsSold}
                                subtitle="Articles vendus"
                                icon={<Inventory />}
                            />
                        </Grid>

                    </Grid>


                    {/* MOYENS DE PAIEMENT */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 3 },
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
                                sx={{ fontWeight: "bold" }}
                            >
                                Moyens de paiement
                            </Typography>

                        </Box>

                        <Grid container spacing={3}>

                            <PaymentMethodBar
                                label="Espèces"
                                percentage={cashPercentage}
                                count={paymentStats.cash}
                                revenue={paymentStats.cashRevenue}
                            />

                            <PaymentMethodBar
                                label="Carte bancaire"
                                percentage={cardPercentage}
                                count={paymentStats.card}
                                revenue={paymentStats.cardRevenue}
                            />

                            <PaymentMethodBar
                                label="Chèque"
                                percentage={chequePercentage}
                                count={paymentStats.cheque}
                                revenue={paymentStats.chequeRevenue}
                            />

                        </Grid>

                    </Paper>


                    {/* DÉTAIL DES VENTES */}

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
                            sx={{ fontWeight: "bold", mb: 2 }}
                        >
                            Détail des ventes
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <SalesTable 
                            sales={filteredSales} 
                        />

                    </Paper>

                </>

            )}

        </Box>

    );

};

export default StatisticPage;
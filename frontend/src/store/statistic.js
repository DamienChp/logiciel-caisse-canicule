import { useMemo } from "react";

// ==================================================
// LIBELLÉS DES PÉRIODES
// ==================================================

export const periodLabel = {
    today: "Aujourd'hui",
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année",
    all: "Toutes les ventes"
};


// ==================================================
// FILTRAGE DES VENTES SELON LA PÉRIODE
// ==================================================

export const filterSalesByPeriod = (sales, period) => {

    if (!sales || sales.length === 0) {
        return [];
    }

    if (period === "all") {
        return sales;
    }

    const now = new Date();

    return sales.filter((sale) => {

        const saleDate = new Date(sale.createdAt);

        // ==========================================
        // AUJOURD'HUI
        // ==========================================

        if (period === "today") {

            return (
                saleDate.getDate() === now.getDate() &&
                saleDate.getMonth() === now.getMonth() &&
                saleDate.getFullYear() === now.getFullYear()
            );

        }

        // ==========================================
        // CETTE SEMAINE
        // ==========================================

        if (period === "week") {

            const currentDay = now.getDay();

            const difference =
                currentDay === 0 ? 6 : currentDay - 1;

            const startOfWeek = new Date(now);

            startOfWeek.setHours(0, 0, 0, 0);

            startOfWeek.setDate(now.getDate() - difference);

            return saleDate >= startOfWeek;

        }

        // ==========================================
        // CE MOIS
        // ==========================================

        if (period === "month") {

            return (
                saleDate.getMonth() === now.getMonth() &&
                saleDate.getFullYear() === now.getFullYear()
            );

        }

        // ==========================================
        // CETTE ANNÉE
        // ==========================================

        if (period === "year") {

            return saleDate.getFullYear() === now.getFullYear();

        }

        return false;

    });

};

// ======================================================
// HOOK : CALCUL DES STATISTIQUES DE VENTES
// ======================================================

export const useSalesStatistics = (sales, period) => {

    // ==================================================
    // VENTES FILTRÉES SELON LA PÉRIODE
    // ==================================================

    const filteredSales = useMemo(() => {

        return filterSalesByPeriod(sales, period);

    }, [sales, period]);


    // ==================================================
    // CHIFFRE D'AFFAIRES
    // ==================================================

    const revenue = useMemo(() => {

        return filteredSales.reduce(
            (total, sale) => total + Number(sale.total || 0),
            0
        );

    }, [filteredSales]);


    // ==================================================
    // NOMBRE DE VENTES
    // ==================================================

    const numberOfSales = filteredSales.length;


    // ==================================================
    // PANIER MOYEN
    // ==================================================

    const averageBasket =
        numberOfSales > 0 ? revenue / numberOfSales : 0;


    // ==================================================
    // PRODUITS VENDUS
    // ==================================================

    const productsSold = useMemo(() => {

        return filteredSales.reduce((total, sale) => {

            return (
                total +
                sale.products.reduce(
                    (quantity, item) =>
                        quantity + Number(item.quantity || 0),
                    0
                )
            );

        }, 0);

    }, [filteredSales]);


    // ==================================================
    // MOYENS DE PAIEMENT
    // ==================================================

    const paymentStats = useMemo(() => {

        const stats = { 
            cash: 0, 
            card: 0, 
            cheque: 0,
            cashRevenue: 0,
            cardRevenue: 0,
            chequeRevenue: 0
        };

        filteredSales.forEach((sale) => {

            const amount = Number(sale.total || 0);

            if (sale.paymentMethod === "cash") {
                stats.cash++;
                stats.cashRevenue += amount;
            }

            if (sale.paymentMethod === "card") {
                stats.card++;
                stats.cardRevenue += amount;
            }

            if (
                sale.paymentMethod === "cheque" ||
                sale.paymentMethod === "check"
            ) {
                stats.cheque++;
                stats.chequeRevenue += amount;
            }

        });

        return stats;

    }, [filteredSales]);


    const totalPayments = filteredSales.length;

    const cashPercentage =
        totalPayments > 0
            ? (paymentStats.cash / totalPayments) * 100
            : 0;

    const cardPercentage =
        totalPayments > 0
            ? (paymentStats.card / totalPayments) * 100
            : 0;

    const chequePercentage =
        totalPayments > 0
            ? (paymentStats.cheque / totalPayments) * 100
            : 0;


    // ==================================================
    // RETOUR DU HOOK
    // ==================================================

    return {
        filteredSales,
        revenue,
        numberOfSales,
        averageBasket,
        productsSold,
        paymentStats,
        cashPercentage,
        cardPercentage,
        chequePercentage
    };

};

// ==================================================
// FORMAT EURO
// ==================================================

export const formatEuro = (value) => {

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
    }).format(value);

};


// ==================================================
// FORMAT POURCENTAGE
// ==================================================

export const formatPercentage = (value) => {

    return `${value.toFixed(1)} %`;

};


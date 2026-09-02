import React, { useMemo, useState } from "react";

import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    MenuItem,
    Select,
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Divider
} from "@mui/material";

import { Download, TableChart } from "@mui/icons-material";

import * as XLSX from "xlsx";

import CustomTable from "../CustomTable.jsx";
import { formatEuro } from "../../store/statistic.js";


// ======================================================
// UTILITAIRES
// ======================================================

const resolveName = (id, list, fallbackLabel) => {

    if (!id) return fallbackLabel;

    if (!list || list.length === 0) return id;

    const found = list.find((entry) => entry._id === id);

    return found ? (found.name || found.label || id) : id;

};

const FILTER_OPTIONS = [
    { value: "brand", label: "Marque" },
    { value: "rayon", label: "Rayon" },
    { value: "family", label: "Famille" },
    { value: "article", label: "Article" },
];

const SORT_OPTIONS = [
    { value: "revenue", label: "CA décroissant" },
    { value: "quantity", label: "Quantité décroissante" },
    { value: "margin", label: "Marge décroissante" },
    { value: "name", label: "Nom (A → Z)" }
];

// Colonnes utilisées pour l'export (raw = champ numérique brut à exporter)
const EXPORT_COLUMNS = [
    { header: "Nom", raw: "name" },
    { header: "Quantité", raw: "quantity" },
    { header: "CA TTC", raw: "revenueValue" },
    { header: "% CA", raw: "percentageValue" },
    { header: "Prix moyen", raw: "averagePriceValue" },
    { header: "Marge", raw: "marginValue" },
    { header: "% Marge", raw: "marginPercentageValue" }
];

const buildExportRows = (rows, columns) =>
    rows.map((row) => {

        const exportRow = {};

        columns.forEach((col) => {
            exportRow[col.header] = row[col.raw] ?? "";
        });

        return exportRow;

    });

const exportToCSV = (rows, columns, filename) => {

    const exportRows = buildExportRows(rows, columns);

    const headers = columns.map((col) => col.header).join(";");

    const lines = exportRows.map((row) =>
        columns
            .map((col) => {

                const value = row[col.header];

                // Remplace le point décimal par une virgule pour Excel FR
                const formatted = typeof value === "number"
                    ? String(value).replace(".", ",")
                    : value;

                return `"${String(formatted).replace(/"/g, '""')}"`;

            })
            .join(";")
    );

    const csvContent = [headers, ...lines].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

};

const exportToXLSX = (rows, columns, filename) => {

    const exportRows = buildExportRows(rows, columns);

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistiques");

    XLSX.writeFile(workbook, `${filename}.xlsx`);

};


// ======================================================
// TABLEAU DES STATISTIQUES
// ======================================================

const SalesStatisticsTable = ({
    sales,
    searchText = "",
    brands = [],
    rayons = [],
    families = []
}) => {

    const [groupBy, setGroupBy] = useState("brand");
    const [sortBy, setSortBy] = useState("revenue");
    const [hideEmpty, setHideEmpty] = useState(true);
    const [selectedGroupId, setSelectedGroupId] = useState("");


    // ==================================================
    // COLONNES (tableau groupé)
    // ==================================================

    const columns = [
        { field: "name", headerName: getLabel(groupBy), flex: 2 },
        { field: "quantity", headerName: "Articles vendus", flex: 1 },
        { field: "revenue", headerName: "CA TTC", flex: 1 },
        { field: "percentage", headerName: "% CA", flex: 1 },
        { field: "averagePrice", headerName: "Prix moyen", flex: 1 },
        { field: "margin", headerName: "Marge", flex: 1 },
        { field: "marginPercentage", headerName: "% Marge", flex: 1 }
    ];

    // Colonnes du tableau détail (liste des articles d'un groupe)
    const detailColumns = [
        { field: "name", headerName: "Article", flex: 2 },
        { field: "quantity", headerName: "Quantité vendue", flex: 1 },
        { field: "revenue", headerName: "CA TTC", flex: 1 },
        { field: "percentage", headerName: "% du groupe", flex: 1 },
        { field: "averagePrice", headerName: "Prix moyen", flex: 1 }
    ];


    // ==================================================
    // AGRÉGATION DES VENTES PAR GROUPE (+ détail articles)
    // ==================================================

    const groupedStats = useMemo(() => {

        const stats = {};

        sales.forEach((sale) => {

            sale.products?.forEach((item) => {

                const product = item.product || item;

                const quantity = Number(item.quantity || 0);
                const unitPriceTTC = Number(item.priceTTC || product.priceTTC || 0);
                const unitCost = Number(item.purchasePrice || product.purchasePrice || 0);

                const revenue = quantity * unitPriceTTC;
                const cost = quantity * unitCost;
                const margin = revenue - cost;

                let key;
                let label;

                switch (groupBy) {

                    case "brand":
                        key = product.brand || "none";
                        label = resolveName(product.brand, brands, "Sans marque");
                        break;

                    case "rayon":
                        key = product.rayon || "none";
                        label = resolveName(product.rayon, rayons, "Sans rayon");
                        break;

                    case "family":
                        key = product.family || "none";
                        label = resolveName(product.family, families, "Sans famille");
                        break;

                    case "article":
                        key = product.name || "none";
                        label = product.name || "Sans article";
                        break;

                    default:
                        key = "none";
                        label = "Non défini";
                        break;
                }

                if (!stats[key]) {

                    stats[key] = {
                        id: key,
                        name: label,
                        quantity: 0,
                        revenueValue: 0,
                        marginValue: 0,
                        articles: {}
                    };

                }

                stats[key].quantity += quantity;
                stats[key].revenueValue += revenue;
                stats[key].marginValue += margin;

                // ---- Détail par article, à l'intérieur du groupe ----

                const articleKey = product._id || product.articleCode || product.name;

                if (!stats[key].articles[articleKey]) {

                    stats[key].articles[articleKey] = {
                        id: articleKey,
                        name: product.name || "Article inconnu",
                        quantity: 0,
                        revenueValue: 0
                    };

                }

                stats[key].articles[articleKey].quantity += quantity;
                stats[key].articles[articleKey].revenueValue += revenue;

            });

        });

        return Object.values(stats);

    }, [sales, groupBy, brands, rayons, families]);


    // ==================================================
    // LIGNES DU TABLEAU GROUPÉ (formatage + tri)
    // ==================================================

    const rows = useMemo(() => {

        const totalRevenue = groupedStats.reduce((sum, item) => sum + item.revenueValue, 0);

        let list = groupedStats
            .filter((item) => !hideEmpty || item.quantity > 0)
            .map((item) => {

                const percentageValue = totalRevenue > 0
                    ? (item.revenueValue / totalRevenue) * 100
                    : 0;

                const averagePriceValue = item.quantity > 0
                    ? item.revenueValue / item.quantity
                    : 0;

                const marginPercentageValue = item.revenueValue > 0
                    ? (item.marginValue / item.revenueValue) * 100
                    : 0;

                return {
                    ...item,
                    percentageValue,
                    averagePriceValue,
                    marginPercentageValue,
                    revenue: formatEuro(item.revenueValue),
                    percentage: `${percentageValue.toFixed(1)} %`,
                    averagePrice: formatEuro(averagePriceValue),
                    margin: formatEuro(item.marginValue),
                    marginPercentage: `${marginPercentageValue.toFixed(1)} %`
                };

            });

        switch (sortBy) {

            case "quantity":
                list = list.sort((a, b) => b.quantity - a.quantity);
                break;

            case "margin":
                list = list.sort((a, b) => b.marginValue - a.marginValue);
                break;

            case "name":
                list = list.sort((a, b) => a.name.localeCompare(b.name));
                break;

            case "revenue":
            default:
                list = list.sort((a, b) => b.revenueValue - a.revenueValue);
                break;

        }

        return list;

    }, [groupedStats, sortBy, hideEmpty]);


    // ==================================================
    // LIGNES DU TABLEAU DÉTAIL (articles du groupe sélectionné)
    // ==================================================

    const detailRows = useMemo(() => {

        if (!selectedGroupId) return [];

        const group = groupedStats.find((item) => item.id === selectedGroupId);

        if (!group) return [];

        const articles = Object.values(group.articles);

        const totalRevenue = articles.reduce((sum, a) => sum + a.revenueValue, 0);

        return articles
            .map((article) => {

                const percentageValue = totalRevenue > 0
                    ? (article.revenueValue / totalRevenue) * 100
                    : 0;

                const averagePriceValue = article.quantity > 0
                    ? article.revenueValue / article.quantity
                    : 0;

                return {
                    ...article,
                    percentageValue,
                    averagePriceValue,
                    revenue: formatEuro(article.revenueValue),
                    percentage: `${percentageValue.toFixed(1)} %`,
                    averagePrice: formatEuro(averagePriceValue)
                };

            })
            .sort((a, b) => b.revenueValue - a.revenueValue);

    }, [groupedStats, selectedGroupId]);


    // ==================================================
    // KPI GLOBAUX
    // ==================================================

    const kpis = useMemo(() => {

        const totalRevenue = groupedStats.reduce((sum, item) => sum + item.revenueValue, 0);
        const totalMargin = groupedStats.reduce((sum, item) => sum + item.marginValue, 0);
        const totalQuantity = groupedStats.reduce((sum, item) => sum + item.quantity, 0);
        const nbSales = sales.length;
        const averageBasket = nbSales > 0 ? totalRevenue / nbSales : 0;

        return { totalRevenue, totalMargin, totalQuantity, averageBasket };

    }, [groupedStats, sales]);


    // ==================================================
    // RENDU
    // ==================================================

    return (

        <Box>

            {/* CONTRÔLES */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ sm: "center" }}
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >

                <ButtonGroup size="small">

                    {FILTER_OPTIONS.map((option) => (

                        <Button
                            key={option.value}
                            variant={groupBy === option.value ? "contained" : "outlined"}
                            onClick={() => {
                                setGroupBy(option.value);
                                setSelectedGroupId("");
                            }}
                        >
                            {option.label}
                        </Button>

                    ))}

                </ButtonGroup>

                <Stack direction="row" spacing={2} alignItems="center">

                    <FormControl size="small" sx={{ minWidth: 180 }}>

                        <InputLabel>Trier par</InputLabel>

                        <Select
                            label="Trier par"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >

                            {SORT_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}

                        </Select>

                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                checked={hideEmpty}
                                onChange={(e) => setHideEmpty(e.target.checked)}
                            />
                        }
                        label="Masquer les vides"
                    />

                </Stack>

            </Stack>

            {/* EXPORTS */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>

                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => exportToCSV(rows, EXPORT_COLUMNS, `statistiques-${groupBy}`)}
                >
                    Exporter CSV
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<TableChart />}
                    onClick={() => exportToXLSX(rows, EXPORT_COLUMNS, `statistiques-${groupBy}`)}
                >
                    Exporter Excel
                </Button>

            </Stack>

            <CustomTable
                rows={rows}
                columns={columns}
                searchText={searchText}
                searchFields={["name"]}
                height={500}
                onRowClick={(params) => {
                    setSelectedGroupId(params.row.id);
                }}
            />

            {/* DÉTAIL PAR ARTICLE */}
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                Détail des articles par {getLabel(groupBy).toLowerCase()}
            </Typography>

            <FormControl size="small" sx={{ minWidth: 260, mb: 2 }}>

                <InputLabel>{getLabel(groupBy)}</InputLabel>

                <Select
                    label={getLabel(groupBy)}
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                >

                    <MenuItem value="">
                        <em>Sélectionner {getLabel(groupBy).toLowerCase()}</em>
                    </MenuItem>

                    {rows.map((row) => (
                        <MenuItem key={row.id} value={row.id}>
                            {row.name}
                        </MenuItem>
                    ))}

                </Select>

            </FormControl>

            {selectedGroupId && (

                <>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => exportToCSV(
                                detailRows,
                                EXPORT_COLUMNS.filter((c) => c.raw !== "marginValue" && c.raw !== "marginPercentageValue"),
                                `detail-articles-${selectedGroupId}`
                            )}
                        >
                            Exporter CSV
                        </Button>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TableChart />}
                            onClick={() => exportToXLSX(
                                detailRows,
                                EXPORT_COLUMNS.filter((c) => c.raw !== "marginValue" && c.raw !== "marginPercentageValue"),
                                `detail-articles-${selectedGroupId}`
                            )}
                        >
                            Exporter Excel
                        </Button>

                    </Stack>

                    <CustomTable
                        rows={detailRows}
                        columns={detailColumns}
                        searchFields={["name"]}
                        height={400}
                    />

                </>

            )}

        </Box>

    );

};


// ======================================================
// LIBELLÉS
// ======================================================

const getLabel = (groupBy) => {
    const option = FILTER_OPTIONS.find((o) => o.value === groupBy);
    return option ? option.label : "Nom";
};

export default SalesStatisticsTable;
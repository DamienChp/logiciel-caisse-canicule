import React, { useMemo, useState } from "react";

import { Chip } from "@mui/material";

import CustomTable from "../CustomTable.jsx";
import SaleDetailDialog from "./SaleDetailDialog";

import { formatEuro } from "../../store/statistic.js";


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
// TABLEAU DES VENTES
// ======================================================

const SalesTable = ({ sales, searchText = "" }) => {

    const [selectedSale, setSelectedSale] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);


    // ==================================================
    // COLONNES
    // ==================================================

    const columns = [

        {
            field: "date",
            headerName: "Date",
            flex: 1
        },

        {
            field: "customerName",
            headerName: "Client",
            flex: 1
        },

        {
            field: "productsCount",
            headerName: "Nb produits",
            flex: 1
        },

        {
            field: "paymentMethod",
            headerName: "Paiement",
            flex: 1,

            renderCell: (params) => (

                <Chip
                    label={params.value}
                    size="small"
                    variant="outlined"
                />

            )
        },

        {
            field: "total",
            headerName: "Total",
            flex: 1
        }

    ];


    // ==================================================
    // LIGNES
    // ==================================================

    const rows = useMemo(() => {

        return sales.map((sale) => {

            const productsCount = sale.products.reduce(
                (quantity, item) => quantity + Number(item.quantity || 0),
                0
            );

            const customer = sale.customer;

            const customerName = customer
                ? (customer.fullName ||
                    `${customer.first_name || ""} ${customer.last_name || ""}`.trim())
                : "Non assigné";

            return {

                id: sale._id,

                sale,

                date: new Date(sale.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short"
                }),

                customerName,

                productsCount,

                paymentMethod:
                    paymentMethodLabel[sale.paymentMethod] ||
                    sale.paymentMethod,

                total: formatEuro(Number(sale.total || 0))

            };

        });

    }, [sales]);


    // ==================================================
    // CLIC SUR UNE LIGNE
    // ==================================================

    const handleRowClick = (params) => {

        setSelectedSale(params.row.sale);
        setDetailOpen(true);

    };


    // ==================================================
    // RENDU
    // ==================================================

    return (

        <>

            <CustomTable
                rows={rows}
                columns={columns}
                searchText={searchText}
                searchFields={["paymentMethod", "customerName"]}
                onRowClick={handleRowClick}
                height={500}
            />

            <SaleDetailDialog
                open={detailOpen}
                sale={selectedSale}
                onClose={() => {
                    setDetailOpen(false);
                    setSelectedSale(null);
                }}
            />

        </>

    );

};

export default SalesTable;
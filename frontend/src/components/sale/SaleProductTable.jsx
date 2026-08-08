import React from "react";

import {
    IconButton
} from "@mui/material";

import {
    Delete
} from "@mui/icons-material";

import CustomTable from "../CustomTable";

import { useCartStore } from "../../store/cart.js";

const SaleProductsTable = ({ products }) => {

    const { removeProduct } = useCartStore();

    const handleDelete = (id) => {
        removeProduct(id);
    };

    const columns = [

        {
            field: "name",
            headerName: "Produit",
            flex: 1
        },

        {
            field: "size",
            headerName: "Taille",
            width: 100
        },

        {
            field: "price",
            headerName: "Prix",
            width: 100,

            valueFormatter: (value) =>
                `${value} €`
        },

        {
            field: "quantity",
            headerName: "Qté",
            width: 80
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 100,

            renderCell: (params) => (

                <IconButton
                    color="error"
                    onClick={() =>
                        handleDelete(params.row.id)
                    }
                >
                    <Delete />
                </IconButton>

            )
        }
    ];

    const rows = products.map(
        (product) => ({
            id: product._id,
            name: product.name,
            size: product.size || "-",
            price: product.priceTTC,
            quantity: product.quantity,
            total: product.priceTTC * product.quantity
        })
    );

    return (
        <CustomTable
            rows={rows}
            columns={columns}
            searchFields={[
                "name",
                "barcode"
            ]}
        />
    );
};

export default SaleProductsTable;
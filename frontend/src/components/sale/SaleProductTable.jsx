import React from "react";

import {
    IconButton,
    TextField
} from "@mui/material";

import {
    Delete
} from "@mui/icons-material";

import CustomTable from "../CustomTable";

import { useCartStore } from "../../store/cart.js";

const SaleProductsTable = ({ products }) => {

    const {
        removeProduct,
        setProductDiscount
    } = useCartStore();

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
            field: "discount",
            headerName: "Remise",
            width: 110,

            renderCell: (params) => (
                <TextField
                    type="number"
                    size="small"
                    value={params.row.discount}
                    onChange={(e) => {

                        const value = Math.min(
                            100,
                            Math.max(
                                0,
                                Number(e.target.value)
                            )
                        );

                        setProductDiscount(
                            params.row.id,
                            value
                        );
                    }}
                    inputProps={{
                        min: 0,
                        max: 100
                    }}
                    sx={{
                        width: 80
                    }}
                    InputProps={{
                        endAdornment: "%"
                    }}
                />
            )
        },

        {
            field: "total",
            headerName: "Total",
            width: 110,

            valueFormatter: (value) =>
                `${value.toFixed(2)} €`
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 60,

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


    const rows = products.map((product) => {

        const subtotal = product.priceTTC * product.quantity;

        const discount =
            subtotal *
            (product.discount || 0) /
            100;

        const total = subtotal - discount;

        return {
            id: product._id,
            name: product.name,
            size: product.size || "-",
            price: product.priceTTC,
            quantity: product.quantity,
            discount: product.discount || 0,
            total
        };
    });


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
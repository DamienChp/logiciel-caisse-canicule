import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import { useProductStore } from "../../store/product";
import CustomTable from "../CustomTable";

const ProductTable = ({ searchText, brand }) => {

    const { products } = useProductStore();
    
    const brandProducts = products.filter(
        (product) =>
            product.brand?._id === brand
    );

    const columns = [

        {
            field: "name",
            headerName: "Produit",
            flex: 1
        },


        {
            field: "articleCode",
            headerName: "Code article",
            flex: 1
        },


        {
            field: "color",
            headerName: "Couleur",
            flex: 1
        },

        {
            field: "size",
            headerName: "Taille",
            flex: 0.7
        },

        {
            field: "stock",
            headerName: "Stock",
            flex: 0.7
        },

        {
            field: "barcode",
            headerName: "barcode",
            flex: 0.7
        },


        {
            field: "priceHT",
            headerName: "Prix HT",
            flex: 1,

            valueFormatter: (value) =>
                `${value} €`
        },


        {
            field: "priceTTC",
            headerName: "Prix TTC",
            flex: 1,

            valueFormatter: (value) =>
                `${value} €`
        },

        {
            field: "purchasePrice",
            headerName: "Prix d'achat",
            flex: 1,

            valueFormatter: (value) =>
                `${value} €`
        }

    ];

    const rows = brandProducts.map(
        (product) => ({
            id: product._id,
            name: product.name,
            articleCode: product.articleCode,
            barcode: product.barcode,
            color: product.color,
            size: product.size,
            stock: product.stock,
            priceHT: product.priceHT,
            priceTTC: product.priceTTC,
            purchasePrice: product.purchasePrice
        })
    );




    return (

       <CustomTable
            rows={rows}
            columns={columns}
            searchText={searchText}
            searchFields={[
                "name",
                "articleCode",
                "color"
            ]}
        />

    );
};


export default ProductTable;
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


const ProductTable = ({ products }) => {
    console.log('products', products)

    return (

        <TableContainer
            component={Paper}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Produit
                        </TableCell>

                        <TableCell>
                            Catégorie
                        </TableCell>

                        <TableCell>
                            Genre
                        </TableCell>

                        <TableCell>
                            Prix HT
                        </TableCell>

                        <TableCell>
                            Prix TTC
                        </TableCell>

                        <TableCell>
                            Stock
                        </TableCell>

                        <TableCell>
                            Code-barres
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {products.map((product) => (

                        <TableRow
                            key={product._id}
                            hover
                        >

                            <TableCell>
                                {product.name}
                            </TableCell>

                            <TableCell>
                                {product.category}
                            </TableCell>

                            <TableCell>
                                {product.gender}
                            </TableCell>

                            <TableCell>
                                {product.priceHT} €
                            </TableCell>

                            <TableCell>
                                {product.priceTTC} €
                            </TableCell>

                            <TableCell>

                                {product.size?.map((item) => (

                                    <div
                                        key={item._id}
                                    >
                                        {item.size} : {item.stock}
                                    </div>

                                ))}

                            </TableCell>

                            <TableCell>
                                {product.barcode}
                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );
};


export default ProductTable;
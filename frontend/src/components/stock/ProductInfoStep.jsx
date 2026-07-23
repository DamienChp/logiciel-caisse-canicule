import React from "react";

import {
    Box,
    MenuItem,
    TextField
} from "@mui/material";

const ProductInfoStep = ({ product, brand, onChange }) => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >

            <TextField
                label="Marque"
                value={brand?.name || ""}
                disabled
                fullWidth
            />

            <TextField
                label="Code-barres"
                value={product.barcode}
                disabled
                fullWidth
            />

            <TextField
                label="Nom du produit"
                name="name"
                value={product.name}
                onChange={onChange}
                fullWidth
            />

            <TextField
                select
                label="Catégorie"
                name="category"
                value={product.category}
                onChange={onChange}
                fullWidth
            >
                <MenuItem value="Swimwear">
                    Swimwear
                </MenuItem>

                <MenuItem value="Clothing">
                    Clothing
                </MenuItem>

                <MenuItem value="Accessory">
                    Accessoire
                </MenuItem>
            </TextField>

            <TextField
                select
                label="Genre"
                name="gender"
                value={product.gender}
                onChange={onChange}
                fullWidth
            >
                <MenuItem value="man">
                    Homme
                </MenuItem>

                <MenuItem value="woman">
                    Femme
                </MenuItem>
            </TextField>

            <Box
                sx={{
                    display: "flex",
                    gap: 2
                }}
            >
                <TextField
                    label="Prix HT"
                    name="priceHT"
                    type="number"
                    value={product.priceHT}
                    onChange={onChange}
                    fullWidth
                />

                <TextField
                    label="Prix TTC"
                    name="priceTTC"
                    type="number"
                    value={product.priceTTC}
                    onChange={onChange}
                    fullWidth
                />
            </Box>

        </Box>
    );
};

export default ProductInfoStep;
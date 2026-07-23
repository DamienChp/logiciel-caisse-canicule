import React, { useState } from "react";

import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";

const sizeOptions = {
    clothing: ["XS", "S", "M", "L", "XL"],
    numeric: ["34", "36", "38", "40", "42", "44"],
};

const ProductSizeStep = ({ sizes, onChange }) => {

    const [sizeType, setSizeType] = useState("clothing");

    const selectedSizes = sizes.map((item) => item.size);

    const handleSizeToggle = (size) => {

        const sizeAlreadyExists = sizes.some(
            (item) => item.size === size
        );

        if (sizeAlreadyExists) {

            const newSizes = sizes.filter(
                (item) => item.size !== size
            );

            onChange(newSizes);

        } else {

            onChange([
                ...sizes,
                {
                    size,
                    stock: 0
                }
            ]);
        }
    };

    const handleStockChange = (size, stock) => {

        const newSizes = sizes.map((item) => {

            if (item.size === size) {
                return {
                    ...item,
                    stock: Number(stock)
                };
            }

            return item;
        });

        onChange(newSizes);
    };

    return (
        <Box>

            <Typography
                variant="h6"
                gutterBottom
            >
                Tailles et stock
            </Typography>

            <FormControl
                fullWidth
                sx={{ mb: 3 }}
            >
                <InputLabel>
                    Type de taille
                </InputLabel>

                <Select
                    value={sizeType}
                    label="Type de taille"
                    onChange={(e) => {
                        setSizeType(e.target.value);
                    }}
                >
                    <MenuItem value="clothing">
                        Tailles vêtements
                    </MenuItem>

                    <MenuItem value="numeric">
                        Tailles numériques
                    </MenuItem>
                </Select>
            </FormControl>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 3
                }}
            >
                {sizeOptions[sizeType].map((size) => (

                    <FormControlLabel
                        key={size}
                        control={
                            <Checkbox
                                checked={selectedSizes.includes(size)}
                                onChange={() => {
                                    handleSizeToggle(size);
                                }}
                            />
                        }
                        label={size}
                    />

                ))}
            </Box>

            {sizes.map((item) => (

                <Box
                    key={item.size}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2
                    }}
                >

                    <Typography
                        sx={{
                            width: 80,
                            fontWeight: 600
                        }}
                    >
                        Taille {item.size}
                    </Typography>

                    <TextField
                        label="Stock"
                        type="number"
                        value={item.stock}
                        onChange={(e) => {
                            handleStockChange(
                                item.size,
                                e.target.value
                            );
                        }}
                    />

                </Box>

            ))}

        </Box>
    );
};

export default ProductSizeStep;
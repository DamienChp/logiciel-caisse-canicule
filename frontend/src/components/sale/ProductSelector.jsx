import React, { useState} from "react";

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    TextField,
    ListItemButton,
    ListItemText
} from "@mui/material";

const ProductSelector = ({ products, onSelect }) => {
    
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleSelect = (product) => {
        onSelect(product);
        setOpen(false);
        setSearch("");
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Rechercher un produit
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Rechercher un produit
                </DialogTitle>

                <DialogContent>

                    <TextField
                        fullWidth
                        autoFocus
                        placeholder="Nom du produit..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <List>
                        {filteredProducts.map((product) => (
                            <ListItemButton
                                key={product._id}
                                onClick={() =>
                                    handleSelect(product)
                                }
                            >
                                <ListItemText
                                    primary={product.name}
                                    secondary={`${product.priceTTC} €`}
                                />
                            </ListItemButton>
                        ))}
                    </List>

                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProductSelector;
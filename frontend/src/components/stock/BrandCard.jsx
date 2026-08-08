import React, { useState } from "react";

import {
    Card,
    CardActionArea,
    CardMedia,
    CardActions,
    Typography,
    Button
} from "@mui/material";

import { Link } from "react-router-dom";

import EditBrand from "./EditBrand";
import { useBrandStore } from "../../store/brand";

const BrandCard = ({ brand }) => {

    const [editOpen, setEditOpen] = useState(false);

    const { deleteBrand } = useBrandStore();

    const brandName = brand.name;
    const brandImage = brand.image || ""

    const handleEdit = (e) => {
        e.stopPropagation(); 
        setEditOpen(true);
    }

    const handleDelete = async (e) => {
        e.stopPropagation();

        const confirmDelete = window.confirm(
            `Supprimer "${brand.name}" et TOUS ses produits ?`
        );

        if (!confirmDelete) return;

        const result = await deleteBrand(brand._id);

        if (!result.success) {
            console.error(result.message);
        }
    };

    const handleCloseEdit = () => { 
        setEditOpen(false); 
    }; 

    return (
        <>
            <Card
                sx={{
                    textDecoration: "none",
                    border: "1px solid #e5e7eb",
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "#E7FBF7",
                    transition: "all 0.2s ease",

                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
                        borderColor: "#c5c5c5"
                    }
                }}
            >
                <CardActionArea
                    component={Link}
                    to={`/stock/${brand._id}`}
                >

                    <CardMedia
                        component="img"
                        image={brandImage}
                        alt={brandName}
                        sx={{
                            height: 150,
                            objectFit: "contain",
                            paddingTop: 2
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            fontWeight: 600,
                            color: "#222",
                            padding: "12px 16px 16px"
                        }}
                    >
                        {brand.name.charAt(0).toUpperCase() + brand.name.slice(1)}
                    </Typography>

                </CardActionArea>

                <CardActions
                    sx={{
                        justifyContent: "center",
                        gap: 1,
                        padding: "0 12px 12px"
                    }}
                >
                    <Button
                        variant="contained" 
                        size="small"
                        onClick={handleEdit}
                        sx={{ 
                            flex: 1, 
                            backgroundColor: "#F7ECCB", 
                            color: "#222", 
                            boxShadow: "none", 
                            "&:hover": { 
                                backgroundColor: "#eedfae",
                                boxShadow: "none" 
                            } 
                        }}
                    >
                        Modifier
                    </Button>

                    <Button
                        variant="contained" 
                        size="small"
                        onClick={handleDelete}
                        sx={{ 
                            flex: 1, 
                            backgroundColor: "#F7ECCB", 
                            color: "#222", 
                            boxShadow: "none", 
                            "&:hover": { 
                                backgroundColor: "#eedfae",
                                boxShadow: "none" 
                            } 
                        }}
                    >
                        Supprimer
                    </Button>
                </CardActions>
            </Card>

            <EditBrand
                open={editOpen}
                onClose={handleCloseEdit}
                brandToEdit={brand}
            />
        </>
    );
};

export default BrandCard;
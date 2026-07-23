import React from "react";

import {
    Card,
    CardActionArea,
    CardMedia,
    Typography
} from "@mui/material";

import { Link } from "react-router-dom";

const BrandCard = ({ brand }) => {

    const brandName = brand.name;
    const brandImage = brand.image || "https://images.squarespace-cdn.com/content/v1/647a0b2ceda9214b0db40b9c/42701ba5-224d-42d7-a815-c423a717f406/CANICULE-PDP-LOGO.png"

    return (
        <Card
            component={Link}
            to={`/stock/${brand._id}`}
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
            <CardActionArea>

                <CardMedia
                    component="img"
                    image={brandImage}
                    alt={brandName}
                    sx={{
                        height: 150,
                        objectFit: "contain",
                        // padding: 20
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
        </Card>
    );
};

export default BrandCard;
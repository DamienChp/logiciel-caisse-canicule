import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Button,
    Typography
} from "@mui/material";

import {
    useParams
} from "react-router-dom";

import {
    useProductStore
} from "../../store/product";

import {
    useBrandStore
} from "../../store/brand";

import AddProduct from "../../components/stock/AddProduct";

import ProductTable from "../../components/stock/ProductTable";

const BrandProducts = () => {

    const { products, getAllProducts } = useProductStore();

    const { brand } = useParams();

    const { brands } = useBrandStore();

    const currentBrand = brands.find((item) => item._id === brand);

    const [open,setOpen] = useState(false);


    useEffect(() => {

        getAllProducts();

    }, [getAllProducts]);

    const brandProducts = products.filter(
        (product) => product.brand === brand
    );


    return (

        <Box
            flex={8}
            p={3}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                >
                    {currentBrand?.name || ""}
                </Typography>


                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                >
                    Ajouter un produit
                </Button>

            </Box>


            <ProductTable
                products={brandProducts}
            />


            <AddProduct
                open={open}
                onClose={() => setOpen(false)}
                brand={currentBrand}
            />

        </Box>

    );
};


export default BrandProducts;
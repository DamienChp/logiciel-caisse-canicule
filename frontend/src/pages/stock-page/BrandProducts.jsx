import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton
} from "@mui/material";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
    useParams,
    useNavigate
} from "react-router-dom";

import { useProductStore } from "../../store/product";
import { useBrandStore } from "../../store/brand";

import AddProduct from "../../components/stock/AddProduct";
import ProductTable from "../../components/stock/ProductTable";

const BrandProducts = () => {

    const navigate = useNavigate();

    const [ searchText, setSearchText ] = useState("");

    const { getAllProducts } = useProductStore();
    const { brands, getAllBrands } = useBrandStore();
    const { brand } = useParams();


    const currentBrand = brands.find((item) => item._id === brand);

    const [ open, setOpen ] = useState(false);


    useEffect(() => {
        getAllProducts();
        getAllBrands();

    }, [getAllProducts, getAllBrands]);


    return (

        <Box
            flex={8}
            p={3}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2
                }}
            >

                <IconButton
                    onClick={() => navigate("/stock")}
                >
                    <ArrowBackIcon />
                </IconButton>


                <Typography
                    variant="h4"
                >
                    {currentBrand?.name || ""}
                </Typography>

            </Box>

            <Box
                display="flex"
                gap={2}
                mb={3}
            >

                <TextField
                    label="Rechercher un produit"
                    fullWidth
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                >
                    Ajouter un produit
                </Button>

            </Box>
            


            <ProductTable
                searchText = {searchText}
                brand = {brand}
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
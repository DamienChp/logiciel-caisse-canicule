import React, { useEffect, useState } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Step,
    StepLabel,
    Stepper
} from "@mui/material";

import { useProductStore } from "../../store/product";

import BarcodeStep from "./step-add-product/BarcodeStep";
import ProductInfoStep from "./step-add-product/ProductInfoStep";
import ProductSizeStep from "./step-add-product/ProductSizeStep";

const steps = [
    "Scanner le produit",
    "Informations",
    "Tailles et stock"
];

const AddProduct = ({ open, onClose, brand }) => {

    const { createProduct } = useProductStore();

    const [activeStep, setActiveStep] = useState(0);

    const [product, setProduct] = useState({
        name: "",
        brand: "",
        category: "",
        gender: "",
        priceHT: "",
        priceTTC: "",
        barcode: "",
        size: []
    });

    useEffect(() => {
        if (brand) {
            setProduct((prev) => ({
                ...prev,
                brand: brand._id
            }));
        }
    }, [brand]);

    //Permet le changement des champs dans le formulaire 
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBarcodeScan = (barcode) => {
        setProduct((prev) => ({
            ...prev,
            barcode: barcode
        }));

        setActiveStep(1);
    };

    const handleSizesChange = (sizes) => {
        setProduct((prev) => ({
            ...prev,
            size: sizes
        }));
    };

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {

        console.log("Produit envoyé :", product);

        const result = await createProduct(product);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setActiveStep(0);

        setProduct({
            name: "",
            brand: brand?._id || "",
            category: "",
            gender: "",
            priceHT: "",
            priceTTC: "",
            barcode: "",
            size: []
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                Ajouter un produit
            </DialogTitle>

            <DialogContent>

                <Stepper
                    activeStep={activeStep}
                    sx={{ mb: 4 }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === 0 && (
                    <BarcodeStep
                        onScan={handleBarcodeScan}
                    />
                )}

                {activeStep === 1 && (
                    <ProductInfoStep
                        product={product}
                        brand={brand}
                        onChange={handleChange}
                    />
                )}

                {activeStep === 2 && (
                    <ProductSizeStep
                        sizes={product.size}
                        onChange={handleSizesChange}
                    />
                )}

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={handleClose}
                >
                    Annuler
                </Button>

                {activeStep > 0 && (
                    <Button
                        onClick={handleBack}
                    >
                        Retour
                    </Button>
                )}

                {activeStep === 1 && (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                    >
                        Suivant
                    </Button>
                )}

                {activeStep === 2 && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Ajouter le produit
                    </Button>
                )}

            </DialogActions>

        </Dialog>
    );
};

export default AddProduct;
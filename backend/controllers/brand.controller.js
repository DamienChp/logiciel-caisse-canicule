import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js"
import mongoose from "mongoose";

export const getBrands = async(req, res) => {
    try {
        const brands = await Brand.find({});
        res.status(200).json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const createBrand = async (req, res) => {
    const brand = req.body;

    if (!brand.name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    try {
        const newBrand = await Brand.create(brand);

        res.status(201).json({
            success: true,
            data: newBrand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        const brand = await Brand.findByIdAndUpdate(
            id,
            { 
                name,
                image 
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Marque introuvable"
            });
        }

        res.status(200).json({
            success: true,
            data: brand
        });

    } catch (error) {
        console.error("Erreur update brand :", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        // Supprime tous les produits liés à cette marque
        await Product.deleteMany({
            brand: id
        });

        //Suppression de la marque
        const brand = await Brand.findByIdAndDelete(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Marque introuvable"
            });
        }

        res.status(200).json({
            success: true,
            message: "Marque supprimée avec succès"
        });

    } catch (error) {
        console.error("Erreur suppression marque :", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
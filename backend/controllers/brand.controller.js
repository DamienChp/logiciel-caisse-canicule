import Brand from "../models/brand.model.js";
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
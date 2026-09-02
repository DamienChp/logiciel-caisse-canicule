import Famille from "../models/famille.model.js"
import mongoose from "mongoose";

export const getFamilles = async(req, res) => {
    try {
        const familles = await Famille.find({});
        res.status(200).json({ success: true, data: familles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

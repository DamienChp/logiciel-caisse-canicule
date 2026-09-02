import Rayon from "../models/rayon.model.js"
import mongoose from "mongoose";

export const getRayons = async(req, res) => {
    try {
        const rayons = await Rayon.find({});
        res.status(200).json({ success: true, data: rayons });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

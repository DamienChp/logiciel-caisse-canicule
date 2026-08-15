import jwt from "jsonwebtoken";

import User from "../models/user.model.js";


// ======================================================
// PROTÈGE UNE ROUTE : vérifie le cookie JWT et attache l'utilisateur
// ======================================================

export const protectRoute = async (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        if (!token) {

            return res.status(401).json({
                message: "Non autorisé, token manquant."
            });

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {

            return res.status(401).json({
                message: "Non autorisé, token invalide."
            });

        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "Utilisateur introuvable."
            });

        }

        req.user = user;

        next();

    } catch (error) {

        console.error("Erreur dans protectRoute :", error);

        res.status(401).json({
            message: "Non autorisé."
        });

    }

};
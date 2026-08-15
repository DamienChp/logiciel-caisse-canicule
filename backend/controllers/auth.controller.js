import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import { generateToken } from "../lib/utils.js";

// ======================================================
// INSCRIPTION (à utiliser une fois pour créer tes comptes,
// ou à protéger/retirer ensuite si tu ne veux pas d'auto-inscription)
// ======================================================

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {

            return res.status(400).json({
                message: "Tous les champs sont requis."
            });

        }

        if (password.length < 6) {

            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 6 caractères."
            });

        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Un compte existe déjà avec cet email."
            });

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email
        });

    } catch (error) {

        console.error("Erreur dans signup :", error);

        res.status(500).json({
            message: "Erreur serveur."
        });

    }

};


// ======================================================
// CONNEXION
// ======================================================

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        if (!email || !password) {

            return res.status(400).json({
                message: "Email et mot de passe requis."
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Identifiants invalides."
            });

        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {

            return res.status(400).json({
                message: "Identifiants invalides."
            });

        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        });

    } catch (error) {

        console.error("Erreur dans login :", error);

        res.status(500).json({
            message: "Erreur serveur."
        });

    }

};


// ======================================================
// DÉCONNEXION
// ======================================================

export const logout = (req, res) => {

    try {

        res.cookie("jwt", "", { maxAge: 0 });

        res.status(200).json({
            message: "Déconnexion réussie."
        });

    } catch (error) {

        console.error("Erreur dans logout :", error);

        res.status(500).json({
            message: "Erreur serveur."
        });

    }

};


// ======================================================
// VÉRIFICATION DE LA SESSION (appelé au chargement du front)
// ======================================================

export const checkAuth = (req, res) => {

    try {

        res.status(200).json(req.user);

    } catch (error) {

        console.error("Erreur dans checkAuth :", error);

        res.status(500).json({
            message: "Erreur serveur."
        });

    }

};
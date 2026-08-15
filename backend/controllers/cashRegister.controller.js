import CashRegister from "../models/CashRegister.js";

export const openCashRegister = async (req, res) => {
    try {
        // Vérifie qu'il n'existe pas déjà une caisse ouverte
        const existingRegister = await CashRegister.findOne({
            status: "open"
        });

        if (existingRegister) {
            return res.status(400).json({
                message: "Une caisse est déjà ouverte."
            });
        }

        const { openingCash } = req.body;

        if (
            openingCash === undefined ||
            openingCash === null ||
            openingCash < 0
        ) {
            return res.status(400).json({
                message: "Le fond de caisse est invalide."
            });
        }

        const cashRegister = await CashRegister.create({
            openingCash,
            openedAt: new Date(),
            date: new Date(),
            status: "open"
        });

        res.status(201).json(cashRegister);

    } catch (error) {

        console.error(
            "Erreur ouverture caisse :",
            error
        );

        res.status(500).json({
            message: "Erreur lors de l'ouverture de la caisse."
        });
    }
};
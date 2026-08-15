import mongoose from "mongoose";

const cashRegisterSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        openedAt: {
            type: Date,
            required: true
        },

        closedAt: {
            type: Date,
            default: null
        },

        // =========================
        // OUVERTURE
        // =========================

        openingCash: {
            type: Number,
            required: true,
            min: 0
        },

        // =========================
        // VENTES
        // =========================

        cashSales: {
            type: Number,
            default: 0
        },

        cardSales: {
            type: Number,
            default: 0
        },

        chequeSales: {
            type: Number,
            default: 0
        },

        // =========================
        // MOUVEMENTS DE CAISSE
        // =========================

        cashIn: {
            type: Number,
            default: 0
        },

        cashOut: {
            type: Number,
            default: 0
        },

        // =========================
        // FERMETURE
        // =========================

        expectedCash: {
            type: Number,
            default: 0
        },

        actualCash: {
            type: Number,
            default: null
        },

        cashDifference: {
            type: Number,
            default: null
        },

        expectedCard: {
            type: Number,
            default: 0
        },

        actualCard: {
            type: Number,
            default: null
        },

        cardDifference: {
            type: Number,
            default: null
        },

        expectedCheque: {
            type: Number,
            default: 0
        },

        actualCheque: {
            type: Number,
            default: null
        },

        chequeDifference: {
            type: Number,
            default: null
        },

        // =========================
        // STATUT
        // =========================

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("CashRegister", cashRegisterSchema);
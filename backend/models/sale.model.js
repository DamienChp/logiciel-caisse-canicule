import mongoose from "mongoose";

const saleProductSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        // On garde le prix ici pour si jamais on le chnage a la suite
        // la vente reste au prix ou il a été vendu
        priceTTC: {
            type: Number,
            required: true
        },

        size: {
            type: String,
            default: null
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        _id: false
    }
);

const saleSchema = new mongoose.Schema(
    {
        saleNumber: {
            type: Number,
            required: true,
            unique: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        products: {
            type: [saleProductSchema],
            required: true
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        cartDiscount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        paymentMethod: {
            type: String,
            enum: ["card", "cash", "cheque"],
            required: true
        },

        receiptMethod: {
            type: String,
            enum: ["email", "phone"],
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
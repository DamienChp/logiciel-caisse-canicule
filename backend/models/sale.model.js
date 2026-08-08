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
        }
    },
    {
        _id: false
    }
);

const saleSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null
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

        paymentMethod: {
            type: String,
            enum: ["card", "cash", "cheque"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
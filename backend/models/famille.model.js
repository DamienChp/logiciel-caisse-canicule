import mongoose from "mongoose";

const familleSchema = new mongoose.Schema(
    {
        code: {
            type: Number,
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        rayon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rayon",
            required: true
        }
    },
    {
        timestamps: true
    }
);

familleSchema.index(
    { code: 1, rayon: 1 },
    { unique: true }
);

export default mongoose.model("Famille", familleSchema);
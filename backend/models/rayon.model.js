import mongoose from "mongoose";

const rayonSchema = new mongoose.Schema(
    {
        code: {
            type: Number,
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

rayonSchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Rayon", rayonSchema);
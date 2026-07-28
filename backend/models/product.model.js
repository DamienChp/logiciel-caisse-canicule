import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
    {
        size: { 
            type: String, 
            required: true, 
            trim: true 
        },
        stock: { 
            type: Number, 
            default: 0,
            min: 0
        },
        barcode : { 
            type: String, 
            default: null, 
            trim: true
        }
    },
    {
        _id: false
    }
);

const productSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: true, 
        //unique: true 
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    articleCode: {
        type: String, 
        default: null
    },
    color: {
        type: String, 
        default: null
    },
    size: {
        type: String, 
        default: null
    },
    barcode : { 
        type: String, 
        default: null 
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    purchasePrice: {
        type: String, 
        default: null
    },
    priceHT : { 
        type: Number, 
        required: true 
    },
    priceTTC : { 
        type: Number, 
    },
    family: {
        type: String,
        default: null
    },
    rayon: {
        type: String,
        default: null
    },
    season: {
        type: String,
        default: null
    },
    codeTVA: {
        type: String,
        default: null
    },
    // size : [sizeSchema],
}, { timestamps : true });


const Product = mongoose.model('Product', productSchema);

export default Product ;
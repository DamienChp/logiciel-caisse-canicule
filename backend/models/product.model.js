import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    category : { type: String, enum: ['Swimwear', 'Clothing', 'Accessory'], required: true },
    gender : { type: String, enum: ['man', 'woman'], required: true },
    size : [sizeSchema],
    priceHT : { type: Number, required: true },
    priceTTC : { type: Number, required: true },
    barcode : { type: String, required: true },
}, { timestamps : true });


const Product = mongoose.model('Product', productSchema);

export default Product ;
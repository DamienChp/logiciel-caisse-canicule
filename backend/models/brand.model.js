import mongoose from "mongoose";


const brandSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true },
    image: {type: String, required: false}
})

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getProducts = async(req, res) => {
    try {
        //const products = await Product.find({});
        const products = await Product
            .find({})
            .populate("brand");

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const createProduct = async(req, res) => {
//     const product = req.body;
//     const requireFields = Object.keys(Product.schema.obj)

//     for (const field of requireFields) {
//         if (!product[field]) {
//             return res.status(400).json({ success: false, message: 'All field are required'})
//         }
//     }

//     const newProduct = new Product(product);

//     try {
//         newProduct.save();
//         res.status(201).json({ success: true, data: newProduct });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const createProduct = async (req, res) => {

    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();

        const product = await Product
            .findById(savedProduct._id)
            .populate("brand");


        res.status(201).json({
            success: true,
            data: product
        });

        // res.status(201).json({
        //     success: true,
        //     data: savedProduct
        // });

    } catch (error) {

        console.error("Error creating product:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async(req, res) => {
    const id = req.params.id;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
                id,
                product,
                {
                    new: true,
                    runValidators: true
                }
            ).populate("brand");
        //const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) { 
        res.status(505).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async(req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Servor error" });
    }
};
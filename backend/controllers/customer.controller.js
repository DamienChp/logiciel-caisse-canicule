import Customer from "../models/customer.model.js";
import mongoose from "mongoose";

export const getCustomer = async(req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json({ success: true, data: customers})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

export const getOneCustomer = async(req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Customer not found" });
    }
    
    try {
        const customer = await Customer.findById(id);
        res.status(200).json({ success: true, data: customer});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

export const createCustomer = async(req, res) => {
    const customer = req.body;

    if (!customer.first_name ||
        !customer.last_name ||
        !customer.email ||
        !customer.phone_number) {
            return res.status(400).json({ success: false, message: 'All field are required'})
        }

    const newCustomer = new Customer(customer);

    try {
        newCustomer.save();
        res.status(201).json({ success: true, data: newCustomer})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

export const updateCustomer = async(req, res) => {
    const id = req.params.id;
    const customer = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Customer not found" });
    }

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, { new: true });
        res.status(200).json({ success: true, data: updatedCustomer });
    } catch (error) { 
        res.status(505).json({ success: false, message: "Server error" });
    }
}

export const deleteCustomer = async(req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Customer not found" });
    }

    try {
        await Customer.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Customer deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Servor error" });
    }
};
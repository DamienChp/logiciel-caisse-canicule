import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    first_name : { 
        type: String, 
        require: true,
        // Majscule au nom et prénom
        set: (value) =>
            value
                ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                : value
    },
    last_name : { 
        type: String, 
        require: true,
        set: (value) =>
            value
                ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                : value
    },
    email :  { 
        type: String, 
        require: true, 
        unique: true
    },
    phone_number : { 
        type: String, 
        require: true 
    },
    city: {
        type: String, 
        require: true  
    },
    totalSpent: {
        type: Number,
        default: 0,
        min: 0
    },
}, { timestamps: true })

const Customer = mongoose.model('Customer', customerSchema);

export default Customer
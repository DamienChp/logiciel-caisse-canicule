import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    first_name : { 
        type: String, 
        require: true 
    },
    last_name : { 
        type: String, 
        require: true
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
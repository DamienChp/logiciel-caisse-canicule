import React, { useState } from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material'

import { useCustomerStore } from '../../store/customer'


const AddCustomer = ({open,onClose}) => {

    const { createCustomer, getAllCustomers } = useCustomerStore()

    const [customer,setCustomer] = useState({
        first_name:"",
        last_name:"",
        email:"",
        phone_number:""
    })

    const handleChange = (e)=>{

        setCustomer({
            ...customer,
            [e.target.name]:e.target.value
        })

    }

    const handleSubmit = async()=>{

        await createCustomer(customer)

        setCustomer({
            first_name:"",
            last_name:"",
            email:"",
            phone_number:""
        })

        getAllCustomers()
        onClose()
    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >

            <DialogTitle>
                Ajouter un client
            </DialogTitle>

            <DialogContent>
                <TextField
                    margin="dense"
                    label="Prénom"
                    name="first_name"
                    fullWidth
                    value={customer.first_name}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Nom"
                    name="last_name"
                    fullWidth
                    value={customer.last_name}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Email"
                    name="email"
                    fullWidth
                    value={customer.email}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Téléphone"
                    name="phone_number"
                    fullWidth
                    value={customer.phone_number}
                    onChange={handleChange}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>

    )
};


export default AddCustomer;
import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";

import { useCustomerStore } from "../../store/customer";


const EditCustomer = ({ open, customer, onClose }) => {

    const { updateCustomer } = useCustomerStore();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        city: ""
    });


    useEffect(() => {

        if (customer) {

            setFormData({
                first_name: customer.first_name || "",
                last_name: customer.last_name || "",
                email: customer.email || "",
                phone_number: customer.phone_number || "",
                city: customer.city || ""
            });

        }

    }, [customer]);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

    };


    const handleSubmit = async () => {

        try {

            await updateCustomer({
                ...customer,
                ...formData
            });

            onClose();

        } catch (error) {

            console.error(
                "Erreur lors de la modification du client :",
                error
            );

        }

    };


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Modifier le client
            </DialogTitle>


            <DialogContent>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Prénom"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Nom"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Téléphone"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                />

            </DialogContent>


            <DialogActions>

                <Button 
                    variant="contained"
                    onClick={onClose}
                >
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Enregistrer
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default EditCustomer;
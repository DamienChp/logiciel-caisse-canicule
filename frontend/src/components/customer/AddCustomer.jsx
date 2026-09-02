import React, { useState } from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Avatar,
    Alert
} from '@mui/material'

import { PersonAddAlt } from '@mui/icons-material'

import { useCustomerStore } from '../../store/customer'


const AddCustomer = ({ open, onClose, onCreated }) => {

    const { createCustomer, getAllCustomers } = useCustomerStore()

    const [customer,setCustomer] = useState({
        first_name:"",
        last_name:"",
        email:"",
        phone_number:"",
        city: ""
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e)=>{

        setCustomer({
            ...customer,
            [e.target.name]:e.target.value
        })

    }

    const resetForm = () => {

        setCustomer({
            first_name:"",
            last_name:"",
            email:"",
            phone_number:"",
            city:""
        })

    }

    const handleSubmit = async()=>{

        setSubmitting(true)
        setError("")

        try {

            const result = await createCustomer(customer)

            if (!result?.success) {
                setError(result?.message || "Erreur lors de la création du client")
                return
            }

            await getAllCustomers()

            resetForm()

            if (onCreated) {
                onCreated(result.data)
            }

            onClose()

        } finally {

            setSubmitting(false)

        }

    }

    const handleClose = () => {

        resetForm()
        setError("")
        onClose()

    }

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(0,0,0,0.08)"
                }}
            >

                <Avatar
                    sx={{
                        bgcolor: "#02595A",
                        width: 34,
                        height: 34
                    }}
                >
                    <PersonAddAlt fontSize="small" />
                </Avatar>

                Ajouter un client

            </DialogTitle>

            <DialogContent
                sx={{
                    pt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5
                }}
            >

                {
                    error &&
                    <Alert
                        severity="error"
                        sx={{ mb: 1 }}
                    >
                        {error}
                    </Alert>
                }

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 1
                    }}
                >

                    <TextField
                        label="Prénom"
                        name="first_name"
                        fullWidth
                        value={customer.first_name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Nom"
                        name="last_name"
                        fullWidth
                        value={customer.last_name}
                        onChange={handleChange}
                    />

                </Box>

                <TextField
                    margin="dense"
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={customer.email}
                    onChange={handleChange}
                />

                <Box
                    sx={{
                        display: "flex",
                        gap: 2
                    }}
                >

                    <TextField
                        margin="dense"
                        label="Téléphone"
                        name="phone_number"
                        fullWidth
                        value={customer.phone_number}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="dense"
                        label="Ville"
                        name="city"
                        fullWidth
                        value={customer.city}
                        onChange={handleChange}
                    />

                </Box>

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2.5,
                    pt: 1
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting || !customer.first_name || !customer.last_name}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    {submitting ? "Ajout..." : "Ajouter"}
                </Button>
            </DialogActions>
        </Dialog>

    )
};


export default AddCustomer;
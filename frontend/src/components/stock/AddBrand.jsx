import React, { useState } from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material'

import { useBrandStore } from '../../store/brand'

const AddBrand = ({open, onClose}) => {
    const { 
        createBrand, 
        getAllBrands
    } = useBrandStore();

    const [brand, setBrand] = useState({
        name: "",
        image: ""
    });

    const handleChange = (e)=>{

        setBrand({
            ...brand,
            [e.target.name]:e.target.value
        })

    };

    const handleSubmit = async()=>{

        await createBrand(brand)

        setBrand({
            name:"",
            image:""
        })

        getAllBrands()
        onClose()
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >

            <DialogTitle>
                Ajouter une marque
            </DialogTitle>

            <DialogContent>
                <TextField
                    margin="dense"
                    label="Nom de la marque"
                    name="name"
                    fullWidth
                    value={brand.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Logo"
                    name="image"
                    fullWidth
                    value={brand.image}
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

export default AddBrand;
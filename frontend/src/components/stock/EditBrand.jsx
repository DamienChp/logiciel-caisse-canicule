import React, { useState, useEffect } from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material'

import { useBrandStore } from '../../store/brand'

const EditBrand = ({open, onClose, brandToEdit}) => {
    
    const { 
        updateBrand,
        getAllBrands
    } = useBrandStore();

    const [brand, setBrand] = useState({
        name: "",
        image: ""
    });

    // Si on ouvre le dialog pour modifier une marque 
    useEffect(() => { 
        if (open && brandToEdit) { 
           setBrand({
                name: brandToEdit.name || "",
                image: brandToEdit.image || ""
            });
        } 
    }, [open]);

    const handleChange = (e)=>{

        setBrand({
            ...brand,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async()=>{

        const result = await updateBrand(
            brandToEdit._id, 
            {
                name: brand.name,
                image: brand.image
            }
        );

        if (!result.success) {
            console.error(result.message);
            return;
        }

        await getAllBrands();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >

            <DialogTitle>
                Modifier une marque
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

export default EditBrand;
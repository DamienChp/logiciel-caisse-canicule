import React, { useState, useEffect } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton
} from "@mui/material";

import { Close } from "@mui/icons-material";

import { useCustomerStore } from "../../store/customer";

const ClientSelector = ({ client, setClient }) => {

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const {customers, getAllCustomers} = useCustomerStore();

    useEffect(()=>{

        getAllCustomers();

    },[getAllCustomers]);

    const filteredCustomers =
        customers.filter((customer) => {

            const name =
                `${customer.first_name} ${customer.last_name}`
                .toLowerCase();

            return name.includes(
                search.toLowerCase()
            );
        });

    return (

        <>

            {
                client ?

                <Box
                    sx={{
                        display:"flex",
                        alignItems:"center",
                        gap:1
                    }}
                >
                    <strong>

                        {client.first_name}
                        {" "}
                        {client.last_name}

                    </strong>

                    <IconButton
                        color="error"
                        onClick={() => setClient(null)}
                    >

                        <Close/>

                    </IconButton>

                </Box>

                :

                <Button
                    variant="contained"
                    onClick={() =>setOpen(true)}
                >
                    Assigner un client
                </Button>
            }

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
            >
                <DialogTitle>

                    Choisir un client

                </DialogTitle>

                <DialogContent>

                    <TextField
                        fullWidth
                        label="Rechercher un client"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            mb:2
                        }}
                    />

                    <Button
                        variant="contained"
                        sx={{
                            mb:2
                        }}
                    >

                        Ajouter un client

                    </Button>

                    <List>

                    {
                        filteredCustomers.map((customer)=>(

                            <ListItem
                                key={customer._id}
                            >
                                <ListItemButton

                                    onClick={()=>{
                                        setClient(customer);
                                        setOpen(false);
                                    }}

                                >

                                    <ListItemText
                                        primary={
                                            `${customer.first_name} ${customer.last_name}`
                                        }
                                        secondary={
                                            customer.phone_number
                                        }

                                    />

                                </ListItemButton>
                            </ListItem>
                        ))

                    }


                    </List>
                </DialogContent>
            </Dialog>

        </>

    );


};


export default ClientSelector;
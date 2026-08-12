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

import AddCustomer from "../customer/AddCustomer";

const ClientSelector = ({ client, setClient }) => {

    const [open, setOpen] = useState(false);
    const [openClient, setOpenClient] = useState(false);

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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        px: 2,
                        py: 1.2,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        minWidth: 280,
                        maxWidth: 400
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0
                        }}
                    >

                        <Box
                            sx={{
                                fontWeight: 500,
                                color: "#02595A",
                                fontSize: "1rem"
                            }}
                        >
                            {client.first_name} {client.last_name}
                        </Box>

                        <Box
                            sx={{
                                fontSize: "0.8rem",
                                opacity: 0.7
                            }}
                        >
                            {client.phone_number}
                        </Box>

                    </Box>

                    <IconButton
                        size="small"
                        onClick={() => setClient(null)}
                        sx={{
                            transition: "all 0.2s ease",

                            "&:hover": {
                                transform: "rotate(90deg) scale(1.15)",
                                backgroundColor: "rgba(211, 47, 47, 0.1)"
                            }
                        }}
                    >
                        <Close fontSize="small" />
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
                        onClick={()=>setOpenClient(true)}                 
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

            <AddCustomer
                open={openClient}
                onClose={()=>setOpenClient(false)}
            />

        </>

    );


};


export default ClientSelector;
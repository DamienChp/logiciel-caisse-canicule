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
    ListItemAvatar,
    Avatar,
    IconButton,
    InputAdornment,
    Typography,
    Divider
} from "@mui/material";

import { Close, Search, PersonOff, Phone } from "@mui/icons-material";

import { useCustomerStore } from "../../store/customer";

import AddCustomer from "../customer/AddCustomer";

// Palette tournante pour les avatars, dérivée du nom du client
const AVATAR_COLORS = [
    "#02595A", "#D97757", "#3D5A80", "#8A5A44",
    "#4A6741", "#6B4E71", "#B5654F", "#2F6690"
];

const getAvatarColor = (id) => {
    const str = String(id || "");
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (first, last) =>
    `${(first || "?")[0]}${(last || "")[0] || ""}`.toUpperCase();

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
                        bgcolor: "primary.light",
                        minWidth: 280,
                        maxWidth: 400
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 0
                        }}
                    >

                        <Avatar
                            sx={{
                                bgcolor: getAvatarColor(client._id),
                                width: 36,
                                height: 36,
                                fontSize: "0.85rem",
                                fontWeight: 600
                            }}
                        >
                            {getInitials(client.first_name, client.last_name)}
                        </Avatar>

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
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    fontSize: "0.8rem",
                                    opacity: 0.7
                                }}
                            >
                                <Phone sx={{ fontSize: "0.9rem" }} />
                                {client.phone_number}
                            </Box>

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
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 600,
                        borderBottom: "1px solid rgba(0,0,0,0.08)"
                    }}
                >

                    Choisir un client

                </DialogTitle>

                <DialogContent
                    sx={{
                        pt: 3
                    }}
                >

                    <TextField
                        fullWidth
                        label="Rechercher un client"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ opacity: 0.5 }} />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            mt: 1,
                            mb: 2
                        }}
                    />

                    <Button
                        variant="contained"
                        onClick={()=>setOpenClient(true)}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600
                        }}
                    >

                        + Ajouter un client

                    </Button>

                    {
                        filteredCustomers.length === 0 ?

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1,
                                py: 5,
                                opacity: 0.5
                            }}
                        >
                            <PersonOff sx={{ fontSize: "2.5rem" }} />
                            <Typography variant="body2">
                                Aucun client trouvé
                            </Typography>
                        </Box>

                        :

                        <List
                            sx={{
                                maxHeight: 360,
                                overflowY: "auto",
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                border: "1px solid rgba(0,0,0,0.08)",
                                py: 0
                            }}
                        >

                        {
                            filteredCustomers.map((customer, index)=>(

                                <React.Fragment key={customer._id}>

                                    <ListItem disablePadding>

                                        <ListItemButton

                                            onClick={()=>{
                                                setClient(customer);
                                                setOpen(false);
                                            }}

                                            sx={{
                                                py: 1.2,
                                                transition: "background-color 0.15s ease",

                                                "&:hover": {
                                                    bgcolor: "rgba(2, 89, 90, 0.06)"
                                                }
                                            }}

                                        >

                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: getAvatarColor(customer._id),
                                                        width: 38,
                                                        height: 38,
                                                        fontSize: "0.85rem",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {getInitials(customer.first_name, customer.last_name)}
                                                </Avatar>
                                            </ListItemAvatar>

                                            <ListItemText
                                                primary={
                                                    `${customer.first_name} ${customer.last_name}`
                                                }
                                                primaryTypographyProps={{
                                                    fontWeight: 500
                                                }}
                                                secondary={
                                                    customer.phone_number
                                                }
                                            />

                                        </ListItemButton>

                                    </ListItem>

                                    {
                                        index < filteredCustomers.length - 1 &&
                                        <Divider component="li" sx={{ ml: 9 }} />
                                    }

                                </React.Fragment>
                            ))

                        }

                        </List>
                    }

                </DialogContent>
            </Dialog>

            <AddCustomer
                open={openClient}
                onClose={()=>setOpenClient(false)}
                onCreated={(newCustomer)=>{
                    setClient(newCustomer);
                    setOpenClient(false);
                    setOpen(false);
                }}
            />

        </>

    );


};


export default ClientSelector;
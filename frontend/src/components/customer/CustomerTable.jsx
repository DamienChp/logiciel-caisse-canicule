import React, { useEffect, useState } from 'react'

import {
    Paper,
    IconButton
} from '@mui/material'


import {
    DataGrid
} from '@mui/x-data-grid'


import {
    Edit,
    Delete
} from '@mui/icons-material'


import {
    Link
} from 'react-router-dom'


import { useCustomerStore } from '../../store/customer'

import CustomTable from '../CustomTable.jsx';
import EditCustomer from './EditCustomer.jsx';


const CustomerTable = ({searchText}) => {

    const { customers, deleteCustomer, getAllCustomers } = useCustomerStore();

    const [editOpen, setEditOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        getAllCustomers();
    }, [getAllCustomers]);

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setEditOpen(true);
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce client ?"
        );

        if (!confirmed) return;

        try {

            await deleteCustomer(id);

        } catch (error) {

            console.error(
                "Erreur lors de la suppression du client :",
                error
            );

        }

    };

    const columns=[

        {
            field:"fullName",
            headerName:"Nom Prénom",
            flex:1,
        },

        {
            field:"email",
            headerName:"Email",
            flex:1
        },

        {
            field:"phone_number",
            headerName:"Téléphone",
            flex:1
        },

        {
            field:"city",
            headerName:"Ville",
            flex:1
        },

        {
            field:"totalSpent",
            headerName:"Vente",
            flex:1
        },

        {
            field:"actions",
            headerName:"Actions",
            width:120,

            renderCell:(params)=>(

                <>

                    <IconButton
                        onClick={() => handleEdit(params.row.customer)}
                        color="info"
                    >
                        <Edit/>
                    </IconButton>


                    <IconButton
                        color="error"
                        onClick={()=>handleDelete(params.row.id)}
                    >
                        <Delete/>
                    </IconButton>


                </>

            )
        }

    ]


    const rows = customers.map((customer)=>(
        {
            id: customer._id,
            customer: customer,
            fullName:`${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone_number: customer.phone_number,
            city: customer.city,
            totalSpent: customer.totalSpent || 0
        }


    ));

    return (
        <>
            <CustomTable
                rows={rows}
                columns={columns}
                searchText={searchText}
                searchFields={[
                    "fullName",
                    "email",
                    "phone_number"
                ]}
            />

            <EditCustomer
                open={editOpen}
                customer={selectedCustomer}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedCustomer(null);
                }}
            />
        </>

    );
}


export default CustomerTable
import React, { useEffect, useState } from 'react'
import { Box, TextField, Button } from '@mui/material'

import CustomerTable from '../../components/customer/CustomerTable'
import AddCustomer from '../../components/customer/AddCustomer'

import { useCustomerStore } from '../../store/customer'


const CustomerPage = () => {

    const { getAllCustomers } = useCustomerStore()

    const [searchText, setSearchText] = useState('')
    const [open, setOpen] = useState(false)


    useEffect(() => {
        getAllCustomers()
    }, [getAllCustomers])


    return (
        <Box 
            flex={8}
            sx={{
                padding:3
            }}
        >

            <Box
                display="flex"
                gap={2}
                mb={3}
            >

                <TextField
                    label="Rechercher un client"
                    fullWidth
                    value={searchText}
                    onChange={(e)=>setSearchText(e.target.value)}
                />


                <Button
                    variant="contained"
                    onClick={()=>setOpen(true)}
                >
                    Ajouter un client
                </Button>


            </Box>


            <CustomerTable 
                searchText={searchText}
            />


            <AddCustomer
                open={open}
                onClose={()=>setOpen(false)}
            />


        </Box>
    )
}


export default CustomerPage
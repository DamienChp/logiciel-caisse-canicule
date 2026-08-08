import React, { useMemo } from 'react'

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
import CustomTable from '../CustomTable.jsx'


const CustomerTable = ({searchText}) => {


    const { customers } = useCustomerStore()



    const handleDelete = (id)=>{

        console.log(
            "Supprimer client :",
            id
        )

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
            field:"points",
            headerName:"Points",
            flex:1
        },

        {
            field:"actions",
            headerName:"Actions",
            width:120,

            renderCell:(params)=>(

                <>

                    <IconButton
                        component={Link}
                        to={`/customers/${params.row.id}`}
                        color="primary"
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
            fullName:`${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone_number: customer.phone_number,
            points: customer.points
        }


    ));

    // const rows = useMemo(()=>{

    //     const search = searchText.toLowerCase()

    //     return customers

    //     .filter(c=>{

    //         const name =
    //         `${c.first_name} ${c.last_name}`
    //         .toLowerCase()


    //         return (

    //             name.includes(search)
    //             ||
    //             c.email?.toLowerCase()
    //             .includes(search)

    //             ||
    //             c.phone_number?.includes(search)

    //         )

    //     })


    //     .map(c=>({

    //         id:c._id,
    //         first_name:c.first_name,
    //         last_name:c.last_name,
    //         email:c.email,
    //         phone_number:c.phone_number,
    //         points:c.points

    //     }))


    // },[
    //     customers,
    //     searchText
    // ])


    return (

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

    );

    // return (

    //     <Paper
    //         sx={{
    //             height:600
    //         }}
    //     >

    //         <DataGrid
    //             rows={rows}
    //             columns={columns}
    //             pageSizeOptions={[5,10,15]}
    //             initialState={{
    //                 pagination:{
    //                     paginationModel:{
    //                         page:0,
    //                         pageSize:15
    //                     }
    //                 }
    //             }}
    //         />


    //     </Paper>

    // )

}


export default CustomerTable
import React, { useMemo } from "react";

import { Paper } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

const CustomTable = ({
    rows,
    columns,
    searchText = "",
    searchFields = [],
    onRowClick,
    height = "90dvh"
}) => {

    const filteredRows = useMemo(()=>{

        if(!searchText){
            return rows;
        }

        const search =searchText.toLowerCase();

        return rows.filter((row)=>{

            return searchFields.some((field)=>{

                return String(row[field] ?? "")
                    .toLowerCase()
                    .includes(search);
            });
        });

    },[
        rows,
        searchText,
        searchFields
    ]);

    return (

        <Paper
            sx={{
                height,
                width:"100%"
            }}
        >

            <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSizeOptions={[
                    5,
                    10,
                    15,
                    25
                ]}
                initialState={{
                    pagination:{
                        paginationModel:{
                            page:0,
                            pageSize:20
                        }
                    }
                }}
                disableRowSelectionOnClick
                onRowClick={onRowClick}
                sx={onRowClick ? { "& .MuiDataGrid-row": { cursor: "pointer" } } : undefined}
            />

        </Paper>

    );

};


export default CustomTable;
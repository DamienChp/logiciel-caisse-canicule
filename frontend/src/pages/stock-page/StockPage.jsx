import React, {useEffect, useState} from "react"

import {
    Box,
    Button,
    Grid
} from "@mui/material"

import { useBrandStore } from "../../store/brand"

import BrandCard from "../../components/stock/BrandCard"
import AddBrand from "../../components/stock/AddBrand"
import ImportStock from "../../components/stock/import-stock/ImportStock"

const StockPage = ()=>{  
  
  const { brands, getAllBrands } = useBrandStore()

  const [open, setOpen] = useState(false)
  
  useEffect(()=>{
    brands,
    getAllBrands()

  },[brands, getAllBrands])

  return (

    <Box flex={8} p={3}>

      <Button
        variant="contained"
        sx={{ marginBottom: 5}}
        onClick={() => setOpen(true)}
      >
        Importer le stock
      </Button>

      <Grid container spacing={3}>
        {
          brands.map((brand)=>(

              <BrandCard 
                key={brand._id}
                brand={brand}
              />

          ))
        }
      </Grid>

      <ImportStock
        open={open} 
        onClose={()=>setOpen(false)} 
        onImportSuccess={getAllBrands}
      />
    </Box>
  )
}


export default StockPage
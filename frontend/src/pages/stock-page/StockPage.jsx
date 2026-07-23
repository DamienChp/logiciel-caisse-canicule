import React, {useEffect, useState} from "react"

import {
    Box,
    Button,
    Grid
} from "@mui/material"

import { useBrandStore } from "../../store/brand"

import BrandCard from "../../components/stock/BrandCard"
import AddBrand from "../../components/stock/AddBrand"


const StockPage = ()=>{  
  
  const {
      brands,
      getAllBrands
  } = useBrandStore()

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
        Ajouter une marque
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

      <AddBrand
        open={open} 
        onClose={()=>setOpen(false)} 
      />
    </Box>
  )
}


export default StockPage
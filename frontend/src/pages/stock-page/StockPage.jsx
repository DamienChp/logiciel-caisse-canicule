import React, {useEffect, useState} from "react"

import {
    Box,
    Button,
    Grid
} from "@mui/material"

import { useBrandStore } from "../../store/brand"

import BrandCard from "../../components/stock/BrandCard"
import ImportStock from "../../components/stock/import-stock/ImportStock"
import FindProduct from "../../components/stock/FindProduct"

const StockPage = ()=>{  
  
  const { brands, getAllBrands } = useBrandStore()

  const [openImport, setOpenImport] = useState(false)
  const [openFindProduct, setOpenFindProduct] = useState(false)
  
  useEffect(()=>{
    getAllBrands()

  },[getAllBrands])

  return (

    <Box flex={8} p={3}>

      <Button
        variant="contained"
        sx={{ marginBottom: 5}}
        onClick={() => setOpenImport(true)}
      >
        Importer le stock
      </Button>
      
      <Button
        variant="contained"
        sx={{ mb: 5, ml: 5}}
        onClick={() => setOpenFindProduct(true)}
      >
        Rechercher un produit
      </Button>

      <Grid container spacing={3}>
        {
          brands.map((brand)=>(

              <BrandCard 
                key={brand.id}
                brand={brand}
              />

          ))
        }
      </Grid>

      <ImportStock
        open={openImport} 
        onClose={()=>setOpenImport(false)} 
        onImportSuccess={getAllBrands}
      />

      <FindProduct
        open={openFindProduct} 
        onClose={()=>setOpenFindProduct(false)} 
      />
    </Box>
  )
}


export default StockPage
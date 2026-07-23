import { 
    Box, 
    List, 
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material'

import { 
    PointOfSale, 
    Inventory, 
    Group, 
    BarChart
} from '@mui/icons-material'

import { Link } from 'react-router-dom'

import React from 'react'

const Sidebar = () => {
  return (
    <Box
        bgcolor="#E7FBF7"
        flex={2}
        p={2}
        sx={{
            height: '100vh',
            display: {xs:'none' , sm:'block'}
        }}
    >
        <List>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon sx={{ color: "#02595A"}}>
                        <PointOfSale />
                    </ListItemIcon>
                    <ListItemText
                        primary="Vente"
                        primaryTypographyProps={{
                            color: "#02595A",
                        }}
                    />                
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/stock">
                    <ListItemIcon sx={{ color: "#02595A"}}>
                        <Inventory />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Stocke" 
                        primaryTypographyProps={{
                            color: "#02595A",
                        }}
                    />
                </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
                <ListItemButton component={Link} to="/customers">
                    <ListItemIcon sx={{ color: "#02595A"}}>
                        <Group />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Client" 
                        primaryTypographyProps={{
                            color: "#02595A",
                        }}
                    />
                </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon sx={{ color: "#02595A"}}>
                        <BarChart />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Tableau de bord"
                        primaryTypographyProps={{
                            color: "#02595A",
                        }}
                    />
                </ListItemButton>
          </ListItem>
        </List>
    </Box>
  )
}

export default Sidebar

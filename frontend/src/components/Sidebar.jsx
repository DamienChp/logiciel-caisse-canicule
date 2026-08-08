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

import { NavLink } from 'react-router-dom'

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
            
            {/* VENTE */}

            <ListItem disablePadding>
                <ListItemButton 
                    component={NavLink} 
                    to="/"
                    sx={{
                        '&.active': {
                            backgroundColor: '#F7ECCB',
                        },
                    }}
                >
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

            {/* STOCK */}

            <ListItem disablePadding>
                <ListItemButton 
                    component={NavLink} 
                    to="/stock"
                    sx={{
                        '&.active': {
                            backgroundColor: '#F7ECCB',
                        },
                    }}
                >                    
                    <ListItemIcon sx={{ color: "#02595A"}}>
                        <Inventory />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Stock" 
                        primaryTypographyProps={{
                            color: "#02595A",
                        }}
                    />
                </ListItemButton>
          </ListItem>

        {/* Client */}

          <ListItem disablePadding>
                <ListItemButton 
                    component={NavLink} 
                    to="/customers"
                    sx={{
                        '&.active': {
                            backgroundColor: '#F7ECCB',
                        },
                    }}
                >                    
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

        {/* Tableau de bord */}

          <ListItem disablePadding>
                <ListItemButton 
                    component={NavLink} 
                    to="/statistic"
                    sx={{
                        '&.active': {
                            backgroundColor: '#F7ECCB',
                        },
                    }}
                >                    
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

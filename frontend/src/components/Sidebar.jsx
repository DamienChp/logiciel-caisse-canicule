import { 
    Box, 
    List, 
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material'

import { alpha } from '@mui/material/styles'

import { 
    PointOfSale, 
    Inventory, 
    Group, 
    BarChart,
    LocalGroceryStore
} from '@mui/icons-material'

import { NavLink } from 'react-router-dom'

import React from 'react'


// ======================================================
// LIENS DE NAVIGATION
// ======================================================

const navItems = [
    { label: "Vente", to: "/", icon: <LocalGroceryStore /> },
    { label: "Caisse", to: "/cash-register", icon: <PointOfSale /> },
    { label: "Stock", to: "/stock", icon: <Inventory /> },
    { label: "Client", to: "/customers", icon: <Group /> },
    { label: "Statistiques", to: "/statistic", icon: <BarChart /> }
];


const Sidebar = () => {
    return (
        <Box
            bgcolor="background.paper"
            flex={2}
            p={2}
            sx={{
                height: '100vh',
                display: { xs: 'none', sm: 'block' },
                borderRight: '1px solid',
                borderColor: 'divider'
            }}
        >
            <List>

                {navItems.map((item) => (

                    <ListItem key={item.to} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={item.to}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                color: 'text.primary',

                                '&.active': {
                                    bgcolor: (theme) =>
                                        alpha(theme.palette.primary.main, 0.12),
                                    color: 'primary.main',

                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main'
                                    }
                                },

                                '&:hover': {
                                    bgcolor: (theme) =>
                                        alpha(theme.palette.primary.main, 0.08)
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>

                ))}

            </List>
        </Box>
    )
}

export default Sidebar
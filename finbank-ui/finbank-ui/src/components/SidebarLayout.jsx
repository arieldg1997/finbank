import React from 'react'
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  Typography,
  Divider
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const drawerWidth = 260

const SidebarLayout = () => {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1976d2',
          color: '#fff'
        }
      }}
    >
      <Toolbar sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant='h6'
          component='div'
          sx={{ fontFamily: 'monospace' }}
        >
          Finbank
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to='/classifiers'
              selected={location.pathname === '/classifiers'}
              sx={{
                '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ListItemText
                primary='Classifiers'
                sx={{ fontFamily: 'monospace' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to='/metadata'
              selected={location.pathname === '/metadata'}
              sx={{
                '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ListItemText
                primary='Metadata'
                sx={{ fontFamily: 'monospace' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Button variant='contained' color='error' fullWidth onClick={logout}>
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  )
}

export default SidebarLayout

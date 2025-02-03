// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import SidebarLayout from './components/SidebarLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Classifiers from './pages/Classifiers'
import Metadata from './pages/Metadata'
import NotFound from './pages/NotFound'
import { Box } from '@mui/material'

function App () {
  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path='/login' element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Box sx={{ display: 'flex' }}>
              <SidebarLayout />
              <Box sx={{ flexGrow: 1, p: 3 }}>
                <Home />
              </Box>
            </Box>
          </ProtectedRoute>
        }
      />
      <Route
        path='/classifiers'
        element={
          <ProtectedRoute>
            <Box sx={{ display: 'flex' }}>
              <SidebarLayout />
              <Box sx={{ flexGrow: 1, p: 3 }}>
                <Classifiers />
              </Box>
            </Box>
          </ProtectedRoute>
        }
      />
      <Route
        path='/metadata'
        element={
          <ProtectedRoute>
            <Box sx={{ display: 'flex' }}>
              <SidebarLayout />
              <Box sx={{ flexGrow: 1, p: 3 }}>
                <Metadata />
              </Box>
            </Box>
          </ProtectedRoute>
        }
      />

      {/* Ruta para páginas no encontradas */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

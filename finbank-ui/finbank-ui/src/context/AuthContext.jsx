'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import SidebarLayout from '../components/sidebar'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)

      const token = localStorage.getItem('token')
      const currentPath = window.location.pathname

      if (token) {
        setUser({ username: localStorage.getItem('username') })

        if (currentPath === '/classifier') {
          // navigate("/dashboard")('/home')
        } else if (currentPath !== '/metadata' && currentPath !== '/home') {
          // navigate("/dashboard")('/home')
        }
      } else {
        if (currentPath !== '/login') {
          // navigate("/dashboard")('/login')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Error en la autenticación')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username)
      setUser({ username })
      navigate("/dashboard")('/home')
    } catch (error) {
      console.error('Error de login:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
    navigate("/dashboard")('/login')
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 text-gray-700'>
        Verificando sesión...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? <SidebarLayout>{children}</SidebarLayout> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

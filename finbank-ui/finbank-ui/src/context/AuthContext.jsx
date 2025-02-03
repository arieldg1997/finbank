import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    if (token && username) {
      setUser({ username })
    }
    setLoading(false)
  }, [])

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
    } catch (error) {
      console.error('Error de login:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
    navigate('/login')
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        Cargando...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
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

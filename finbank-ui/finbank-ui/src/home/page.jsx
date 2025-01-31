'use client'

import { useAuth } from '../context/AuthContext'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import ClassifiersTable from '../components/classifiers'

export default function Home () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user === null) {
      navigate('/login')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
        <p>Verificando sesión...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen text-gray-200 flex flex-col items-center justify-start'>
      <div className='max-w-screen-lg w-full px-4 sm:px-6 lg:px-8 mt-8'>
        <h2 className='text-3xl font-bold mb-6 text-center text-black'>
          Clasificadores
        </h2>
        <ClassifiersTable />
      </div>
    </div>
  )
}

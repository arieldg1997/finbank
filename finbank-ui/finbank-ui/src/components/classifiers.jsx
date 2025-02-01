import { useState, useEffect } from 'react'

// Simulación de una llamada a la API
const fetchClassifiers = async () => {
  return [
    {
      id: 1,
      schema: 'public',
      table: 'users',
      company: 'TechCorp',
      createdAt: '2023-01-15',
      createdBy: 'admin'
    },
    {
      id: 2,
      schema: 'sales',
      table: 'orders',
      company: 'TechCorp',
      createdAt: '2023-02-20',
      createdBy: 'salesManager'
    },
    {
      id: 3,
      schema: 'hr',
      table: 'employees',
      company: 'TechCorp',
      createdAt: '2023-03-10',
      createdBy: 'hrManager'
    },
    {
      id: 4,
      schema: 'finance',
      table: 'transactions',
      company: 'TechCorp',
      createdAt: '2023-04-05',
      createdBy: 'financeManager'
    },
    {
      id: 5,
      schema: 'marketing',
      table: 'campaigns',
      company: 'TechCorp',
      createdAt: '2023-05-12',
      createdBy: 'marketingManager'
    }
  ]
}

export default function ClassifiersTable () {
  const [classifiers, setClassifiers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadClassifiers = async () => {
      try {
        const data = await fetchClassifiers()
        setClassifiers(data)
      } catch (error) {
        console.error('Error fetching classifiers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClassifiers()
  }, [])

  if (isLoading) {
    return (
      <div className='text-center text-white font-semibold'>
        Cargando clasificadores...
      </div>
    )
  }

  return (
    <div className='overflow-x-auto p-6'>
      <table className='min-w-full shadow-lg rounded-lg overflow-hidden'>
        <thead className='bg-gray-800 text-white'>
          <tr>
            <th className='px-6 py-4 text-left text-sm font-semibold uppercase'>
              Schema
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold uppercase'>
              Tabla
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold uppercase'>
              Empresa
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold uppercase'>
              Fecha de Creación
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold uppercase'>
              Usuario de Creación
            </th>
          </tr>
        </thead>
        <tbody className='bg-gray-900 text-gray-300 divide-y divide-gray-700'>
          {classifiers.map(classifier => (
            <tr
              key={classifier.id}
              className='hover:bg-gray-700 transition-all'
            >
              <td className='px-6 py-4 whitespace-nowrap'>
                {classifier.schema}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {classifier.table}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {classifier.company}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {classifier.createdAt}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {classifier.createdBy}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

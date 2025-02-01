import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaCog, FaSearch } from 'react-icons/fa'

export default function SidebarLayout ({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 p-6 transition-all sm:block`}
      >
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold'>Simple Auth App</h1>
        </div>

        <nav>
          <ul className='space-y-4'>
            <li>
              <Link
                to='/home'
                className={`block py-2 px-4 text-lg rounded-lg flex items-center gap-3 transition-all ${
                  location.pathname === '/home'
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <FaCog className='text-xl' /> Classifiers
              </Link>
            </li>
            <li>
              <Link
                to='/metadata'
                className={`block py-2 px-4 text-lg rounded-lg flex items-center gap-3 transition-all ${
                  location.pathname === '/metadata'
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <FaSearch className='text-xl' /> Metadata
              </Link>
            </li>
          </ul>
        </nav>

        {user && (
          <div className='mt-10'>
            <p className='mb-4 text-gray-400'>
              Bienvenido, <span className='font-semibold'>{user.username}</span>
            </p>
            <button
              onClick={handleLogout}
              className='w-full bg-red-500 py-2 rounded-lg hover:bg-red-700 transition-all'
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className='flex-1 p-8'>{children}</div>
    </div>
  )
}

import './App.css'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'Finbank',
  description: 'Finbank webapp'
}

export default function App ({ children }) {
  return (
    <html lang='es'>
      <body>
        dsdjsahdisahidhsaiuhd
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

export { App, metadata }

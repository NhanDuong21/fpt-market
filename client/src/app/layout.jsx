import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'FPT-Market',
  description: 'FPT-Market Phase 1 Scaffolding',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  )
}

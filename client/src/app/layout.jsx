import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'FPT-Market | Mua bán nội bộ sinh viên FPT',
  description: 'Nền tảng mua bán giáo trình, đồ dùng cũ và dịch vụ tiện ích dành riêng cho sinh viên FPT.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  )
}

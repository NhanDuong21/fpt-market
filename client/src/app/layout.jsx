import './globals.css'

export const metadata = {
  title: 'FPT-Market',
  description: 'FPT-Market Phase 1 Scaffolding',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

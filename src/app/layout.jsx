import './globals.css'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from './registry'
import Navigation from './components/Navigation'
import { AuthProvider } from './utils/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: {
    default: 'Spotify Admin',
    template: '%s | Spotify Admin'
  },
  description: 'Backoffice pour la gestion de contenu Spotify-like',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    title: 'Spotify Admin',
    statusBarStyle: 'default',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#121212',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} style={{ background: '#121212' }}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <Navigation />
            <main style={{
              paddingTop: '64px',
              minHeight: '100vh',
              background: '#121212'
            }}>
              {children}
            </main>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

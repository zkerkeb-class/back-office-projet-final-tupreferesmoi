import './globals.css'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from './registry'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify Admin',
  description: 'Backoffice pour la gestion de contenu Spotify-like',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className} style={{ background: '#121212' }}>
        <StyledComponentsRegistry>
          <Navigation />
          <main style={{
            paddingTop: '64px',
            minHeight: '100vh',
            background: '#121212'
          }}>
            {children}
          </main>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

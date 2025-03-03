'use client'

import Link from 'next/link'
import styled from 'styled-components'
import { useAuth } from '../utils/AuthContext'
import { usePathname } from 'next/navigation'

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #121212;
  border-bottom: 1px solid #282828;
  z-index: 50;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const NavInner = styled.div`
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  
  &:hover {
    color: #1DB954;
  }
`;

const LogoText = styled.span`
  font-weight: 700;
  color: white;
  font-size: 1.25rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLink = styled(Link)`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #b3b3b3;
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover {
    color: white;
  }
`;

const LogoutButton = styled.button`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #b3b3b3;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover {
    color: white;
  }
`;

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  if (pathname === '/login') return null;
  
  return (
    <Nav>
      <NavContent>
        <NavInner>
          <Logo href="/">
            <span style={{ fontSize: '1.5rem' }}>🎵</span>
            <LogoText>Spotify Admin</LogoText>
          </Logo>

          {user && (
            <NavLinks>
              <NavLink href="/artists">Artistes</NavLink>
              <NavLink href="/albums">Albums</NavLink>
              <NavLink href="/tracks">Sons</NavLink>
              <NavLink href="/playlists">Playlists</NavLink>
              <LogoutButton onClick={logout}>
                Déconnexion
              </LogoutButton>
            </NavLinks>
          )}
        </NavInner>
      </NavContent>
    </Nav>
  );
} 
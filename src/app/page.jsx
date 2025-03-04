"use client";

import Link from 'next/link'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useAuth } from './utils/AuthContext'
import { useRouter } from 'next/navigation'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #121212;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 500px;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;

  ${props => props.$primary ? `
    background: #1ed760;
    color: #000;
    &:hover {
      background: #1fdf64;
      transform: scale(1.02);
    }
  ` : `
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    &:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.02);
    }
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(Link)`
  display: block;
  background: #212121;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #282828;
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #282828;
  border-radius: 4px;
  font-size: 1.5rem;
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #b3b3b3;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CardStats = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1DB954;
  padding-top: 1rem;
  border-top: 1px solid #282828;
`;

const StatsSection = styled.div`
  margin-top: 3rem;
  background: #212121;
  border-radius: 8px;
  padding: 1.5rem;
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const StatsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatsCard = styled.div`
  background: #282828;
  border-radius: 4px;
  padding: 1.25rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #323232;
  }
`;

const StatsLabel = styled.p`
  font-size: 0.875rem;
  color: #b3b3b3;
  margin-bottom: 1rem;
`;

const StatsValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const StatsChange = styled.span`
  font-size: 0.75rem;
  color: #1DB954;
`;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [totalArtists, setTotalArtists] = useState(0);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [artistsRes, albumsRes, tracksRes, playlistsRes] = await Promise.all([
          fetch('/api/artists?limit=100'),
          fetch('/api/albums?limit=100'),
          fetch('/api/tracks?limit=100'),
          fetch('/api/playlists/public?limit=100')
        ]);

        if (!artistsRes.ok || !albumsRes.ok || !tracksRes.ok || !playlistsRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const [artistsData, albumsData, tracksData, playlistsData] = await Promise.all([
          artistsRes.json(),
          albumsRes.json(),
          tracksRes.json(),
          playlistsRes.json()
        ]);

        setArtists(artistsData.data || []);
        setAlbums(albumsData.data || []);
        setTracks(tracksData.data || []);
        setPlaylists(playlistsData.data || []);
        
        setTotalArtists(artistsData.pagination?.totalItems || 0);
        setTotalAlbums(albumsData.pagination?.totalItems || 0);
        setTotalTracks(tracksData.pagination?.totalItems || 0);
        setTotalPlaylists(playlistsData.pagination?.totalItems || 0);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Container>Chargement...</Container>;
  }

  if (!user) {
    return null;
  }

  const sections = [
    {
      title: 'Artistes',
      description: 'Gérer les artistes de la plateforme',
      icon: '🎤',
      link: '/artists',
      stats: loading ? 'Chargement...' : `${totalArtists} artistes`
    },
    {
      title: 'Albums',
      description: 'Gérer les albums et leurs contenus',
      icon: '💿',
      link: '/albums',
      stats: loading ? 'Chargement...' : `${totalAlbums} albums`
    },
    {
      title: 'Sons',
      description: 'Gérer la bibliothèque musicale',
      icon: '🎵',
      link: '/tracks',
      stats: loading ? 'Chargement...' : `${totalTracks} titres`
    },
    {
      title: 'Playlists',
      description: 'Gérer les playlists du système',
      icon: '📑',
      link: '/playlists',
      stats: loading ? 'Chargement...' : `${totalPlaylists} playlists publiques`
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Tableau de bord</Title>
      </Header>

      <Grid>
        {sections.map((section) => (
          <Card key={section.title} href={section.link}>
            <CardContent>
              <CardHeader>
                <IconContainer>{section.icon}</IconContainer>
                <CardInfo>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardInfo>
              </CardHeader>
              <CardStats>{section.stats}</CardStats>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <StatsSection>
        <StatsHeader>
          <StatsTitle>Statistiques rapides</StatsTitle>
        </StatsHeader>

        <StatsGrid>
          {[
            { 
              label: 'Total Artistes', 
              value: loading ? '...' : totalArtists, 
              change: `+${totalArtists} cette semaine` 
            },
            { 
              label: 'Total Albums', 
              value: loading ? '...' : totalAlbums, 
              change: `+${totalAlbums} cette semaine` 
            },
            { 
              label: 'Total Sons', 
              value: loading ? '...' : totalTracks, 
              change: `+${totalTracks} cette semaine` 
            },
            { 
              label: 'Total Playlists', 
              value: loading ? '...' : totalPlaylists,
              change: `+${totalPlaylists} cette semaine`
            }
          ].map((stat, index) => (
            <StatsCard key={index}>
              {error ? (
                <StatsLabel style={{ color: 'red' }}>Erreur de chargement</StatsLabel>
              ) : (
                <>
                  <StatsLabel>{stat.label}</StatsLabel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <StatsValue>{stat.value}</StatsValue>
                    <StatsChange>{stat.change}</StatsChange>
                  </div>
                </>
              )}
            </StatsCard>
          ))}
        </StatsGrid>
      </StatsSection>
    </Container>
  );
}

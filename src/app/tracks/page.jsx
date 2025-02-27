'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Header, Title, Button, ErrorMessage } from './styles/TrackStyles';
import TrackTable from './components/TrackTable';
import TrackModal from './components/TrackModal';
import * as api from './utils/api';
import Pagination from '../components/Pagination';

export default function TracksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tracks, setTracks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const currentPage = parseInt(searchParams.get('page') || '1');

  const updatePageInUrl = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/tracks?${params.toString()}`);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchTracks();
    }
  }, [user, loading, currentPage]);

  const fetchTracks = async () => {
    try {
      const response = await api.fetchWithAuth(`/api/tracks?page=${currentPage}&limit=${itemsPerPage}`);
      
      const formattedTracks = response.data.map(track => ({
        id: track.id,
        title: track.title || 'Piste Inconnue',
        album: track.album?.title || 'Album Inconnu',
        artist: track.artist || 'Artiste Inconnu',
        duration: track.duration || 0,
        audioUrl: track.audioUrl || null
      }));
      
      setTracks(formattedTracks);
      setTotalItems(response.pagination?.totalItems || 0);
      setTotalPages(response.pagination?.totalPages || 1);
      setError('');
    } catch (error) {
      setError(error.message);
      if (error.message === 'Non authentifié') router.push('/login');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  const handleEdit = (track) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette piste ?')) return;

    try {
      await api.fetchWithAuth(`/api/tracks/${id}`, { method: 'DELETE' });
      await fetchTracks();
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedTrack) {
        await api.fetchWithAuth(`/api/tracks/${selectedTrack.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await api.fetchWithAuth('/api/tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      handleModalClose();
      fetchTracks();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <Container>Chargement...</Container>;
  if (!user) return null;

  return (
    <Container>
      <Header>
        <div>
          <Title>Pistes ({totalItems})</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Ajouter une piste</Button>
      </Header>

      <TrackTable
        tracks={tracks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination 
        page={currentPage}
        totalPages={totalPages}
        onPageChange={updatePageInUrl}
      />

      <TrackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        track={selectedTrack}
      />
    </Container>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { Container, Header, Title, Button, ErrorMessage } from './styles/ArtistStyles';
import ArtistTable from './components/ArtistTable';
import Pagination from './components/Pagination';
import ArtistModal from './components/ArtistModal';
import * as api from './utils/api';

export default function ArtistsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    genres: '',
    popularity: 0,
    image: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchArtists();
  }, [user, loading, page]);

  const fetchArtists = async () => {
    try {
      const data = await api.fetchWithAuth(`/api/artists?page=${page}&limit=${itemsPerPage}`);
      const formattedArtists = data.data.map(api.formatArtistData);
      
      setArtists(formattedArtists);
      setTotalPages(Math.ceil(data.pagination?.totalItems / itemsPerPage) || 1);
      setError('');
    } catch (error) {
      setError(error.message);
      if (error.message === 'Non authentifié') router.push('/login');
    }
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setEditForm({
      id: artist.id,
      name: artist.name,
      genres: Array.isArray(artist.genres) ? artist.genres.join(', ') : '',
      popularity: artist.popularity || 0,
      image: artist.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet artiste ?')) return;

    try {
      await api.fetchWithAuth(`/api/artists/${id}`, { method: 'DELETE' });
      await fetchArtists();
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const urls = await api.uploadArtistImage(file, editForm.name);
      if (urls?.thumbnail) {
        setEditForm(prev => ({
          ...prev,
          image: urls.thumbnail
        }));
      }
      return urls;
    } catch (error) {
      setError("Erreur lors de l'upload de l'image: " + error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.id) return;

    try {
      const isImageChanged = editForm.image !== selectedArtist?.imageUrl;
      const genres = editForm.genres.split(',').map(g => g.trim()).filter(Boolean);
      
      const formattedData = {
        name: editForm.name,
        genres,
        popularity: parseInt(editForm.popularity),
        ...(isImageChanged && editForm.image && {
          image: {
            thumbnail: api.extractBaseUrl(editForm.image),
            medium: api.extractBaseUrl(editForm.image),
            large: api.extractBaseUrl(editForm.image)
          }
        })
      };

      const updatedArtist = await api.fetchWithAuth(`/api/artists/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });

      if (updatedArtist.success) {
        const updatedArtistData = api.formatArtistData({
          ...updatedArtist.data,
          imageUrl: isImageChanged 
            ? (updatedArtist.data?.image?.thumbnail || editForm.image) 
            : selectedArtist.imageUrl
        });

        setArtists(prevArtists => 
          prevArtists.map(artist => 
            artist.id === editForm.id ? updatedArtistData : artist
          )
        );

        setIsModalOpen(false);
        setError('');
      } else {
        throw new Error('La mise à jour n\'a pas retourné les données attendues');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <Container>Chargement...</Container>;
  if (!user) return null;

  return (
    <Container>
      <Header>
        <Title>Artistes</Title>
        <Button onClick={() => setIsModalOpen(true)}>
          <span>+</span>
          Nouvel artiste
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ArtistTable 
        artists={artists}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={editForm}
        onChange={setEditForm}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
      />
    </Container>
  );
} 
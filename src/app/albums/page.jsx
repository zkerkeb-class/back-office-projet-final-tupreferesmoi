'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { Container, Header, Title, Button, ErrorMessage } from './styles/AlbumStyles';
import AlbumTable from './components/AlbumTable';
import AlbumModal from './components/AlbumModal';
import * as api from './utils/api';

export default function AlbumsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    genres: '',
    releaseDate: '',
    type: '',
    coverImage: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchAlbums();
  }, [user, loading, page]);

  const fetchAlbums = async () => {
    try {
      const data = await api.fetchWithAuth(`/api/albums?page=${page}&limit=${itemsPerPage}`);
      
      // Créer un tableau de promesses pour les appels détaillés
      const detailPromises = data.data.map(album => 
        api.fetchWithAuth(`/api/albums/${album.id}`)
      );

      // Attendre toutes les réponses détaillées
      const detailedResults = await Promise.all(detailPromises);

      // Formater les albums avec les données détaillées
      const formattedAlbums = data.data.map((album, index) => {
        const detailedAlbum = detailedResults[index].data;
        return {
          id: album.id,
          title: album.title || 'Album Inconnu',
          genres: detailedAlbum.genres || [],
          releaseDate: detailedAlbum.releaseDate,
          type: detailedAlbum.type || 'album',
          trackCount: detailedAlbum.trackCount || 0,
          coverImage: {
            thumbnail: album.coverUrl || null,
            medium: album.coverUrl || null,
            large: album.coverUrl || null
          }
        };
      });
      
      setAlbums(formattedAlbums);
      setTotalPages(Math.ceil(data.pagination?.totalItems / itemsPerPage) || 1);
      setError('');
    } catch (error) {
      setError(error.message);
      if (error.message === 'Non authentifié') router.push('/login');
    }
  };

  const handleEdit = (album) => {
    setSelectedAlbum(album);
    setEditForm({
      id: album.id,
      title: album.title,
      genres: Array.isArray(album.genres) ? album.genres.join(', ') : '',
      releaseDate: album.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
      type: album.type || 'album',
      coverImage: album.coverImage?.thumbnail || album.coverUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) return;

    try {
      await api.fetchWithAuth(`/api/albums/${id}`, { method: 'DELETE' });
      await fetchAlbums();
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const urls = await api.uploadAlbumCover(file, editForm.title);
      if (urls?.thumbnail) {
        setEditForm(prev => ({
          ...prev,
          coverImage: urls.thumbnail
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

    try {
      const genres = editForm.genres.split(',').map(g => g.trim()).filter(Boolean);
      
      const formattedData = {
        title: editForm.title,
        genres,
        releaseDate: new Date(editForm.releaseDate).toISOString(),
        type: editForm.type
      };

      // Si l'image a été modifiée, ajoutez-la aux données
      if (editForm.coverImage && (!selectedAlbum || editForm.coverImage !== selectedAlbum.coverImage?.thumbnail)) {
        formattedData.coverImage = {
          thumbnail: editForm.coverImage,
          medium: editForm.coverImage,
          large: editForm.coverImage
        };
      }

      let response;
      if (editForm.id) {
        // Mise à jour
        response = await api.fetchWithAuth(`/api/albums/${editForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
      } else {
        // Création
        response = await api.fetchWithAuth('/api/albums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
      }

      if (response.success) {
        await fetchAlbums(); // Recharger tous les albums pour avoir les données à jour
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
        <Title>Albums</Title>
        <Button onClick={() => {
          setSelectedAlbum(null);
          setEditForm({
            id: '',
            title: '',
            genres: '',
            releaseDate: '',
            type: '',
            coverImage: ''
          });
          setIsModalOpen(true);
        }}>
          <span>+</span>
          Nouvel album
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AlbumTable 
        albums={albums}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlbumModal
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
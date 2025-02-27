'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Header, Title, Button, ErrorMessage } from './styles/AlbumStyles';
import AlbumTable from './components/AlbumTable';
import AlbumModal from './components/AlbumModal';
import * as api from './utils/api';
import Pagination from './components/Pagination';

export default function AlbumsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const itemsPerPage = 10;

  // Récupérer la page depuis l'URL ou utiliser 1 par défaut
  const currentPage = parseInt(searchParams.get('page') || '1');

  const updatePageInUrl = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/albums?${params.toString()}`);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchAlbums();
  }, [user, loading, currentPage]);

  const fetchAlbums = async () => {
    try {
      const data = await api.fetchWithAuth(`/api/albums?page=${currentPage}&limit=${itemsPerPage}`);
      
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
          artist: detailedAlbum.artistId?.name || 'Artiste inconnu',
          artistId: detailedAlbum.artistId?._id,
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
      setTotalAlbums(data.pagination?.totalItems || 0);
      setError('');
    } catch (error) {
      setError(error.message);
      if (error.message === 'Non authentifié') router.push('/login');
    }
  };

  const handleEdit = (album) => {
    setSelectedAlbum(album);
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
      const urls = await api.uploadAlbumCover(file, selectedAlbum.title);
      if (urls?.thumbnail) {
        setSelectedAlbum(prev => ({
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

  const handleSubmit = async (albumData) => {
    try {
      // Vérifier que tous les champs requis sont présents
      if (!albumData.title || !albumData.releaseDate || !albumData.type || !albumData.artistId) {
        throw new Error('Tous les champs requis doivent être remplis');
      }

      // Formater les données pour l'API
      const formattedData = {
        title: albumData.title.trim(),
        genres: Array.isArray(albumData.genres) ? albumData.genres : albumData.genres.split(',').map(g => g.trim()).filter(Boolean),
        releaseDate: new Date(albumData.releaseDate).toISOString(),
        type: albumData.type,
        artistId: albumData.artistId,
        coverImage: albumData.coverImage ? {
          thumbnail: albumData.coverImage,
          medium: albumData.coverImage,
          large: albumData.coverImage
        } : undefined
      };

      console.log('Données formatées envoyées au serveur:', formattedData);

      let response;
      if (selectedAlbum) {
        // Mise à jour
        response = await api.fetchWithAuth(`/api/albums/${selectedAlbum.id}`, {
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
        await fetchAlbums(); // Recharger tous les albums
        setIsModalOpen(false);
        setSelectedAlbum(null);
        setError('');
      } else {
        throw new Error(response.message || 'La mise à jour n\'a pas retourné les données attendues');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setError(error.message || 'Une erreur est survenue lors de la création/modification de l\'album');
    }
  };

  if (loading) return <Container>Chargement...</Container>;
  if (!user) return null;

  return (
    <Container>
      <Header>
        <Title>Albums ({totalAlbums})</Title>
        <Button onClick={() => {
          setSelectedAlbum(null);
          setIsModalOpen(true);
        }}>
          Nouvel album
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AlbumTable 
        albums={albums}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination 
        page={currentPage}
        totalPages={totalPages}
        onPageChange={updatePageInUrl}
      />

      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlbum(null);
        }}
        onSubmit={handleSubmit}
        album={selectedAlbum}
      />
    </Container>
  );
} 
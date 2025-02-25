'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { Container, Header, Title, Button, ErrorMessage } from './styles/TrackStyles';
import TrackTable from './components/TrackTable';
import TrackModal from './components/TrackModal';
import * as api from './utils/api';

export default function TracksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    albumId: '',
    featuring: '',
    duration: '',
    trackNumber: '',
    audioUrl: '',
    audioFile: null,
    albums: []
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchTracks();
      fetchAlbums();
      fetchArtists();
    }
  }, [user, loading, page]);

  const fetchTracks = async () => {
    try {
      const response = await api.fetchWithAuth(`/api/tracks?page=${page}&limit=${itemsPerPage}`);
      
      const formattedTracks = await Promise.all(
        response.data.map(async (track) => {
          const trackDetails = await api.fetchWithAuth(`/api/tracks/${track.id}`);
          const trackData = trackDetails.data;

          return {
            id: trackData.id,
            title: trackData.title || 'Piste Inconnue',
            album: trackData.albumId?.title || 'Album Inconnu',
            artist: trackData.artistId?.name || 'Artiste Inconnu',
            albumId: trackData.albumId?._id || '',
            artistId: trackData.artistId?._id || '',
            duration: trackData.duration || 0,
            trackNumber: trackData.trackNumber || 1,
            audioUrl: trackData.audioUrl || null,
            featuring: trackData.featuring || [],
            genres: trackData.genres || [],
            popularity: trackData.popularity || 0,
            explicit: trackData.explicit || false
          };
        })
      );
      
      setTracks(formattedTracks);
      setTotalPages(Math.ceil(response.pagination?.totalItems / itemsPerPage) || 1);
      setError('');
    } catch (error) {
      setError(error.message);
      if (error.message === 'Non authentifié') router.push('/login');
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await api.fetchWithAuth('/api/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des albums:', error);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await api.fetchWithAuth('/api/artists');
      setArtists(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des artistes:', error);
    }
  };

  const handleEdit = (track) => {
    setSelectedTrack(track);
    setEditForm({
      ...editForm,
      id: track.id,
      title: track.title,
      albumId: track.albumId,
      featuring: Array.isArray(track.featuring) ? track.featuring.join(', ') : '',
      duration: track.duration,
      trackNumber: track.trackNumber,
      audioUrl: track.audioUrl
    });
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

  const handleAudioUpload = async (file) => {
    try {
      const urls = await api.uploadTrackAudio(file, editForm.title);
      if (urls?.audio) {
        setEditForm(prev => ({
          ...prev,
          audioUrl: urls.audio
        }));
      }
      return urls;
    } catch (error) {
      setError("Erreur lors de l'upload du fichier audio: " + error.message);
      throw error;
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let audioUrl = formData.audioUrl;
      let duration = formData.duration;
      let artistId = formData.artistId;
      let albumId = formData.albumId;

      // Si un fichier audio a été sélectionné, l'uploader d'abord
      if (formData.audioFile) {
        const uploadResult = await api.uploadTrackAudio(formData.audioFile);
        audioUrl = uploadResult.urls.audio;
        duration = uploadResult.metadata.duration;
      }

      // Création d'un nouvel artiste si nécessaire
      if (formData.newArtist) {
        try {
          console.log('Tentative de création d\'artiste avec le nom:', formData.newArtist.name);
          
          const newArtist = await api.createArtist(formData.newArtist.name);
          
          console.log('Réponse création artiste:', newArtist);

          if (newArtist.data && newArtist.data._id) {
            artistId = newArtist.data._id;
            console.log('Nouvel artiste créé avec ID:', artistId);
          } else {
            throw new Error('ID de l\'artiste non trouvé dans la réponse');
          }
        } catch (artistError) {
          console.error('Erreur création artiste:', artistError);
          throw new Error(`Erreur lors de la création de l'artiste: ${artistError.message}`);
        }
      }

      // Création d'un nouvel album si nécessaire
      if (formData.newAlbum && artistId) {
        try {
          const albumData = {
            title: formData.newAlbum.title,
            artistId: artistId,
            type: 'album',
            releaseDate: new Date().toISOString(),
            genres: []
          };

          console.log('Tentative de création d\'album avec:', albumData);

          const newAlbum = await api.fetchWithAuth('/api/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(albumData)
          });

          console.log('Réponse création album:', newAlbum);

          if (newAlbum.data && newAlbum.data._id) {
            albumId = newAlbum.data._id;
            console.log('Nouvel album créé avec ID:', albumId);
          } else {
            throw new Error('ID de l\'album non trouvé dans la réponse');
          }
        } catch (albumError) {
          console.error('Erreur création album:', albumError);
          throw new Error(`Erreur lors de la création de l'album: ${albumError.message}`);
        }
      }
      
      const trackData = {
        title: formData.title,
        albumId: albumId,
        artistId: artistId,
        duration: duration,
        audioUrl: audioUrl,
        genres: formData.genres,
        featuring: formData.featuring,
        explicit: formData.explicit
      };

      console.log('Données de la piste à créer:', trackData);

      let response;
      if (formData.id) {
        response = await api.fetchWithAuth(`/api/tracks/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trackData)
        });
      } else {
        response = await api.fetchWithAuth('/api/tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trackData)
        });
      }

      if (response.success) {
        await fetchTracks();
        setIsModalOpen(false);
        setError('');
      } else {
        throw new Error('La mise à jour n\'a pas retourné les données attendues');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setError(error.message);
    }
  };

  if (loading) return <Container>Chargement...</Container>;
  if (!user) return null;

  return (
    <Container>
      <Header>
        <div>
          <Title>Sons</Title>
          <span style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>
            {tracks.length} sur {totalPages * itemsPerPage} pistes
          </span>
        </div>
        <Button onClick={() => {
          setSelectedTrack(null);
          setEditForm({
            ...editForm,
            id: '',
            title: '',
            albumId: '',
            featuring: '',
            duration: '',
            trackNumber: '',
            audioUrl: '',
            audioFile: null
          });
          setIsModalOpen(true);
        }}>
          Nouveau son
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TrackTable 
        tracks={tracks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '1rem',
        padding: '1rem',
        background: '#282828',
        borderRadius: '8px'
      }}>
        <span style={{ color: '#b3b3b3' }}>
          Page {page} sur {totalPages}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <Button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      </div>

      <TrackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={editForm}
        onChange={setEditForm}
        onSubmit={handleSubmit}
        onAudioUpload={handleAudioUpload}
        albums={albums}
        artists={artists}
      />
    </Container>
  );
} 
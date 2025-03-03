import { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import * as api from '../utils/api';
import { TrackManagerStyles } from './styles/TrackManagerStyles';

const {
  Container,
  TrackList,
  TrackListHeader,
  TrackCount,
  Track,
  TrackInfo,
  TrackTitle,
  TrackMeta,
  AudioPreview,
  ActionButton,
  Section
} = TrackManagerStyles;

/**
 * Composant de gestion des pistes pour l'édition d'un album existant
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.albumId - L'ID de l'album en cours d'édition
 * @param {string} props.artistId - L'ID de l'artiste de l'album
 * @param {Array} props.initialTracks - Les pistes initiales de l'album
 * @param {Function} props.onTracksChange - Callback appelé lors de la modification des pistes
 */
export default function EditTrackManager({ albumId, artistId, initialTracks = [], onTracksChange }) {
  // États locaux
  const [albumTracks, setAlbumTracks] = useState([]);
  const [artistTracks, setArtistTracks] = useState([]);
  const [pendingTrackUpdate, setPendingTrackUpdate] = useState(null);

  // Chargement des pistes de l'album
  const loadAlbumTracks = async () => {
    try {
      const response = await api.getAvailableTracksForAlbum(albumId);
      if (response.success) {
        // Filtrer les pistes qui sont déjà dans l'album
        const albumTracks = response.data.filter(track => track.isInAlbum);
        setAlbumTracks(albumTracks);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des pistes de l'album:", error);
    }
  };

  // Effet pour charger les pistes de l'album au montage
  useEffect(() => {
    if (albumId) {
      loadAlbumTracks();
    }
  }, [albumId]);

  // Effet pour charger les pistes de l'artiste
  useEffect(() => {
    if (artistId) {
      loadArtistTracks();
    } else {
      setArtistTracks([]);
    }
  }, [artistId]);

  // Effet pour gérer les mises à jour des pistes
  useEffect(() => {
    if (pendingTrackUpdate) {
      onTracksChange(pendingTrackUpdate);
      setPendingTrackUpdate(null);
    }
  }, [pendingTrackUpdate, onTracksChange]);

  // Chargement des pistes de l'artiste depuis l'API
  const loadArtistTracks = async () => {
    try {
      const response = await api.getArtistTracks(artistId);
      if (response.success) {
        setArtistTracks(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pistes:", error);
    }
  };

  // Calcul des pistes disponibles (non présentes dans l'album)
  const availableTracks = useMemo(() => {
    return artistTracks.filter(artistTrack => {
      const artistTrackId = artistTrack.id || artistTrack._id;
      return !albumTracks.some(albumTrack => {
        const albumTrackId = albumTrack.id || albumTrack._id;
        return albumTrackId === artistTrackId;
      });
    });
  }, [artistTracks, albumTracks]);

  // Gestion de l'ajout d'une piste
  const handleAddTrack = useCallback((track, e) => {
    e.preventDefault();
    const trackToAdd = track.id || track._id;
    
    setAlbumTracks(prev => {
      const isTrackAlreadyAdded = prev.some(t => (t.id || t._id) === trackToAdd);
      if (isTrackAlreadyAdded) return prev;
      
      const newTracks = [...prev, track];
      setPendingTrackUpdate(newTracks.map(t => t.id || t._id));
      return newTracks;
    });
  }, []);

  // Gestion de la suppression d'une piste
  const handleRemoveTrack = useCallback((track, e) => {
    e.preventDefault();
    const trackToRemove = track.id || track._id;
    
    setAlbumTracks(prev => {
      const newTracks = prev.filter(t => (t.id || t._id) !== trackToRemove);
      setPendingTrackUpdate(newTracks.map(t => t.id || t._id));
      return newTracks;
    });
  }, []);

  return (
    <Container>
      {/* Section des pistes de l'album */}
      <Section>
        <TrackListHeader>
          <h3>Pistes de l'album</h3>
          <TrackCount>{albumTracks.length} piste{albumTracks.length !== 1 ? 's' : ''}</TrackCount>
        </TrackListHeader>
        
        <TrackList>
          {albumTracks.map((track, index) => (
            <Track key={track.id || track._id || index}>
              <TrackInfo>
                <TrackTitle>{index + 1}. {track.title}</TrackTitle>
                <TrackMeta>
                  {track.artistId?.name}
                  {track.featuring?.length > 0 && ` feat. ${track.featuring.map(f => f.name).join(', ')}`}
                </TrackMeta>
              </TrackInfo>
              {track.audioUrl && <AudioPreview controls src={track.audioUrl} />}
              <ActionButton 
                data-isdelete 
                onClick={(e) => handleRemoveTrack(track, e)}
                title="Retirer de l'album"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ActionButton>
            </Track>
          ))}
          {albumTracks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#b3b3b3' }}>
              Aucune piste dans l'album
            </div>
          )}
        </TrackList>
      </Section>

      {/* Section des pistes disponibles */}
      <Section>
        <TrackListHeader>
          <h3>Pistes disponibles</h3>
          <TrackCount>{availableTracks.length} piste{availableTracks.length !== 1 ? 's' : ''}</TrackCount>
        </TrackListHeader>
        
        <TrackList>
          {availableTracks.map((track, index) => (
            <Track key={track.id || track._id || index}>
              <TrackInfo>
                <TrackTitle>{track.title}</TrackTitle>
                <TrackMeta>
                  {track.artistId?.name}
                  {track.featuring?.length > 0 && ` feat. ${track.featuring.map(f => f.name).join(', ')}`}
                </TrackMeta>
              </TrackInfo>
              {track.audioUrl && <AudioPreview controls src={track.audioUrl} />}
              <ActionButton 
                onClick={(e) => handleAddTrack(track, e)}
                title="Ajouter à l'album"
                type="button"
              >
                Ajouter
              </ActionButton>
            </Track>
          ))}
          {availableTracks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#b3b3b3' }}>
              Aucune piste disponible
            </div>
          )}
        </TrackList>
      </Section>
    </Container>
  );
} 
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
 * Composant de gestion des pistes pour la création d'un nouvel album
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.artistId - L'ID de l'artiste sélectionné
 * @param {Function} props.onTracksChange - Callback appelé lors de la modification des pistes
 */
export default function CreateTrackManager({ artistId, onTracksChange }) {
  // États locaux
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [availableArtistTracks, setAvailableArtistTracks] = useState([]);
  const [pendingTrackUpdate, setPendingTrackUpdate] = useState(null);

  // Effet pour charger les pistes de l'artiste
  useEffect(() => {
    if (artistId) {
      loadArtistTracks();
    } else {
      setAvailableArtistTracks([]);
    }
  }, [artistId]);

  // Effet pour gérer les mises à jour des pistes sélectionnées
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
        setAvailableArtistTracks(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pistes:", error);
    }
  };

  // Calcul des pistes disponibles (non sélectionnées)
  const availableTracks = useMemo(() => {
    return availableArtistTracks.filter(track => {
      const trackId = track.id || track._id;
      return !selectedTracks.some(selected => (selected.id || selected._id) === trackId);
    });
  }, [availableArtistTracks, selectedTracks]);

  // Gestion de l'ajout d'une piste
  const handleAddTrack = useCallback((track, e) => {
    e.preventDefault();
    setSelectedTracks(prev => {
      const newTracks = [...prev, track];
      setPendingTrackUpdate(newTracks.map(t => t.id || t._id));
      return newTracks;
    });
  }, []);

  // Gestion de la suppression d'une piste
  const handleRemoveTrack = useCallback((track, e) => {
    e.preventDefault();
    setSelectedTracks(prev => {
      const newTracks = prev.filter(t => (t.id || t._id) !== (track.id || track._id));
      setPendingTrackUpdate(newTracks.map(t => t.id || t._id));
      return newTracks;
    });
  }, []);

  return (
    <Container>
      {/* Section des pistes sélectionnées */}
      <Section>
        <TrackListHeader>
          <h3>Pistes sélectionnées</h3>
          <TrackCount>{selectedTracks.length} piste{selectedTracks.length !== 1 ? 's' : ''}</TrackCount>
        </TrackListHeader>
        
        <TrackList>
          {selectedTracks.map((track, index) => (
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
                title="Retirer de la sélection"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ActionButton>
            </Track>
          ))}
          {selectedTracks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#b3b3b3' }}>
              Aucune piste sélectionnée
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
                title="Ajouter à la sélection"
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
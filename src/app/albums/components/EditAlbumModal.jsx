import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/AlbumStyles';
import * as api from '../utils/api';
import EditTrackManager from './EditTrackManager';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #282828;
  padding: 2rem;
  border-radius: 8px;
  width: 95%;
  max-width: 1000px;
  height: 85vh;
  margin: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
  padding-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 1;

  &:hover {
    color: white;
  }
`;

export default function EditAlbumModal({ isOpen, onClose, onSubmit, album }) {
  const [formData, setFormData] = useState({
    title: '',
    genres: '',
    releaseDate: '',
    type: 'album',
    artistId: '',
    trackIds: []
  });

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        genres: Array.isArray(album.genres) ? album.genres.join(', ') : '',
        releaseDate: album.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
        type: album.type || 'album',
        artistId: album.artistId || '',
        trackIds: Array.isArray(album.tracks) ? album.tracks.map(track => track._id) : []
      });
    }
  }, [album]);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.releaseDate) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const submitData = {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTracksChange = (trackIds) => {
    setFormData(prev => ({ ...prev, trackIds }));
  };

  if (!isOpen || !album) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} title="Fermer">
          ×
        </CloseButton>
        <form onSubmit={handleSubmit}>
          <ContentLayout>
            <FormSection>
              <FormGroup>
                <Label>Titre *</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'album"
                />
              </FormGroup>

              <FormGroup>
                <Label>Artiste</Label>
                <Input
                  type="text"
                  value={album.artist || ''}
                  disabled
                />
              </FormGroup>

              <FormGroup>
                <Label>Genres (séparés par des virgules)</Label>
                <Input
                  type="text"
                  value={formData.genres}
                  onChange={e => setFormData(prev => ({ ...prev, genres: e.target.value }))}
                  placeholder="Pop, Rock, Jazz..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Date de sortie *</Label>
                <Input
                  type="date"
                  value={formData.releaseDate}
                  onChange={e => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="album">Album</option>
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                </Select>
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Button type="submit">Mettre à jour</Button>
            </FormSection>

            <div style={{ overflow: 'hidden' }}>
              <EditTrackManager
                albumId={album.id}
                artistId={album.artistId}
                initialTracks={Array.isArray(album.tracks) ? album.tracks : []}
                onTracksChange={handleTracksChange}
              />
            </div>
          </ContentLayout>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
} 
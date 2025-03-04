import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/PlaylistStyles';
import TrackSearch from './TrackSearch';

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
  max-width: 400px;
`;

const FormGroup = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 500px;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }

  &::placeholder {
    color: #909090;
  }
`;

const UpdateButton = styled(Button)`
  width: auto;
  padding: 0.75rem 1.5rem;
  border-radius: 500px;
  font-size: 0.875rem;
  background: #1DB954;
  
  &:hover {
    background: #1ed760;
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

export default function EditPlaylistModal({ isOpen, onClose, onSubmit, playlist }) {
  const [formData, setFormData] = useState({
    name: '',
    trackIds: []
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name || '',
        trackIds: Array.isArray(playlist.tracks) ? playlist.tracks.map(track => track._id) : []
      });
    }
  }, [playlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Le nom de la playlist est obligatoire');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTracksChange = (trackIds) => {
    setFormData(prev => ({ ...prev, trackIds }));
  };

  if (!isOpen || !playlist) return null;

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
                <Label>Nom de la playlist</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la playlist"
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <UpdateButton type="submit">Mettre à jour</UpdateButton>
            </FormSection>

            <div style={{ overflow: 'hidden', flex: 1 }}>
              <TrackSearch
                playlistId={playlist.id}
                initialTracks={Array.isArray(playlist.tracks) ? playlist.tracks : []}
                onTracksChange={handleTracksChange}
              />
            </div>
          </ContentLayout>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
} 
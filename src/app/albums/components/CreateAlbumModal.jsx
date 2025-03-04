import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/AlbumStyles';
import * as api from '../utils/api';
import CreateTrackManager from './CreateTrackManager';

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

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ArtistList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const ArtistItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  color: white;

  &:hover {
    background: #4E4E4E;
  }
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

export default function CreateAlbumModal({ isOpen, onClose, onSubmit }) {
  const initialFormState = {
    title: '',
    artistId: '',
    genres: '',
    releaseDate: '',
    type: 'album',
    trackIds: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistSearch, setArtistSearch] = useState('');
  const [artists, setArtists] = useState([]);
  const [showArtistList, setShowArtistList] = useState(false);
  const [error, setError] = useState('');
  
  const artistWrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setSelectedArtist(null);
      setArtistSearch('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (artistWrapperRef.current && !artistWrapperRef.current.contains(event.target)) {
        setShowArtistList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleArtistSearch = async (e) => {
    const value = e.target.value;
    setArtistSearch(value);
    setShowArtistList(true);

    if (value.length >= 2) {
      const response = await api.searchArtists(value);
      if (response.success) {
        setArtists(response.data);
      }
    } else {
      setArtists([]);
    }
  };

  const selectArtist = (artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.name);
    setFormData(prev => ({ ...prev, artistId: artist._id }));
    setShowArtistList(false);
  };

  const handleTracksChange = (trackIds) => {
    console.log('Nouveaux trackIds reçus dans CreateAlbumModal:', trackIds);
    setFormData(prev => {
      const newFormData = { ...prev, trackIds };
      console.log('Nouveau formData après mise à jour des trackIds:', newFormData);
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.artistId || !formData.releaseDate) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    console.log('FormData au moment de la soumission:', formData);
    console.log('TrackIds au moment de la soumission:', formData.trackIds);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

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
                <Label>Artiste *</Label>
                <SelectWrapper ref={artistWrapperRef}>
                  <Input
                    type="text"
                    value={artistSearch}
                    onChange={handleArtistSearch}
                    onFocus={() => setShowArtistList(true)}
                    placeholder="Rechercher un artiste..."
                  />
                  {showArtistList && artistSearch && (
                    <ArtistList>
                      {artists.map(artist => (
                        <ArtistItem
                          key={artist._id}
                          onClick={() => selectArtist(artist)}
                        >
                          {artist.name}
                        </ArtistItem>
                      ))}
                    </ArtistList>
                  )}
                </SelectWrapper>
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

              <Button type="submit">Créer</Button>
            </FormSection>

            <div style={{ overflow: 'hidden' }}>
              {selectedArtist && (
                <CreateTrackManager
                  artistId={selectedArtist._id}
                  onTracksChange={handleTracksChange}
                />
              )}
            </div>
          </ContentLayout>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
} 
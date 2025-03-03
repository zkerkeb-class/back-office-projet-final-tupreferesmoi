import { useState, useEffect, useRef } from 'react';
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

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
    height: 90vh;
    margin: 10px;
  }

  /* Style de la scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 4px;
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

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
  padding-top: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    padding-bottom: 1rem;
  }
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
  width: -webkit-fill-available;;
  padding: 0.75rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  height: 16px;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }

  &::placeholder {
    color: #b3b3b3;
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
  height: 42px;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ImagePreview = styled.div`
  margin-top: 0.75rem;
  width: 100%;
  max-width: 150px;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  background: #3E3E3E;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  flex-wrap: wrap;

  ${Input}[type="url"], ${Input}[type="file"] {
    flex: 1;
    min-width: 200px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    
    ${Input}[type="file"] {
      width: 100%;
    }
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  &.artist-select-wrapper {
    z-index: 1002;
  }
  &.tracks-select-wrapper {
    z-index: 1001;
  }
`;

const DropdownList = styled.ul`
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #4E4E4E;
  }

  &.new-item {
    border-top: 1px solid #404040;
    color: #1DB954;
  }

  &.selected {
    background: #1DB954;
    color: white;
    
    &:hover {
      background: #1ed760;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  }
`;

const SelectedTracksContainer = styled.div`
  margin-top: 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
`;

const TracksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TracksTableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  color: #b3b3b3;
  font-weight: normal;
  border-bottom: 1px solid #404040;
`;

const TracksTableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #404040;
  color: white;

  &:last-child {
    text-align: right;
  }
`;

const TracksTableRow = styled.tr`
  &:hover {
    background: #333333;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.2s;
  margin-left: auto;

  &:hover {
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid #404040;
  margin-top: auto;
  text-align: center;
`;

const TracksSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1.5rem;
  overflow: hidden;
  height: 100%;
`;

const TracksHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TracksTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const TracksCount = styled.span`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const TracksList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-right: -0.5rem;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #282828;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 4px;
  }
`;

const ArtistSelect = styled(SelectWrapper)`
  margin-bottom: 1rem;
`;

const ArtistDropdown = styled(DropdownList)`
  max-height: 300px;
`;

const ArtistItem = styled(DropdownItem)`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AlbumModal = ({ isOpen, onClose, onSubmit, album }) => {
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    releaseDate: '',
    type: 'album',
    genres: [],
    coverImage: null
  });
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [error, setError] = useState('');
  const [artists, setArtists] = useState([]);
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
  const [artistSearch, setArtistSearch] = useState('');
  const artistSelectRef = useRef(null);

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        artistId: album.artistId || '',
        releaseDate: album.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
        type: album.type || 'album',
        genres: album.genres || [],
        coverImage: album.coverImage?.medium || null
      });
      setArtistSearch(album.artist || '');
    } else {
      setFormData({
        title: '',
        artistId: '',
        releaseDate: '',
        type: 'album',
        genres: [],
        coverImage: null
      });
      setArtistSearch('');
    }
  }, [album]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (artistSelectRef.current && !artistSelectRef.current.contains(event.target)) {
        setShowArtistDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchArtists = async (query) => {
    if (!query.trim() || query.length < 2) {
      setArtists([]);
      return;
    }

    try {
      const response = await api.searchArtists(query);
      if (response.success) {
        setArtists(response.data);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des artistes:', error);
      setArtists([]);
    }
  };

  const handleArtistSearch = (e) => {
    const value = e.target.value;
    setArtistSearch(value);
    if (value.length >= 2) {
      setShowArtistDropdown(true);
      searchArtists(value);
    } else {
      setShowArtistDropdown(false);
      setArtists([]);
    }
  };

  const selectArtist = (artist) => {
    setFormData(prev => ({
      ...prev,
      artistId: artist._id
    }));
    setArtistSearch(artist.name);
    setShowArtistDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Vérifier que tous les champs requis sont remplis
      if (!formData.title || !formData.releaseDate || !formData.type) {
        throw new Error('Tous les champs requis doivent être remplis');
      }

      if (!album && !formData.artistId) {
        throw new Error('Veuillez sélectionner un artiste');
      }

      // Préparer les données à envoyer (sans l'image)
      const dataToSubmit = {
        title: formData.title,
        releaseDate: formData.releaseDate,
        type: formData.type,
        genres: formData.genres,
        artistId: formData.artistId || album?.artistId
      };

      // Soumettre les données de l'album
      await onSubmit(dataToSubmit);

      // Mettre à jour les pistes si c'est une édition et qu'il y a des changements
      if (album?.id && selectedTracks.length > 0) {
        await api.updateAlbumTracks(album.id, selectedTracks);
      }

      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTracksChange = (trackIds) => {
    setSelectedTracks(trackIds);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <form onSubmit={handleSubmit}>
          <ContentLayout>
            <FormSection>
              <FormGroup>
                <Label>Titre *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre de l'album"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Artiste *</Label>
                {album ? (
                  <Input
                    type="text"
                    value={album.artist || ''}
                    disabled
                    placeholder="Artiste"
                  />
                ) : (
                  <SelectWrapper ref={artistSelectRef} className="artist-select-wrapper">
                    <Input
                      type="text"
                      value={artistSearch}
                      onChange={handleArtistSearch}
                      onFocus={() => setShowArtistDropdown(true)}
                      placeholder="Rechercher un artiste..."
                      required
                    />
                    {showArtistDropdown && artists.length > 0 && (
                      <ArtistDropdown>
                        {artists.map((artist) => (
                          <ArtistItem
                            key={artist._id}
                            onClick={() => selectArtist(artist)}
                            className={formData.artistId === artist._id ? 'selected' : ''}
                          >
                            {artist.name}
                          </ArtistItem>
                        ))}
                      </ArtistDropdown>
                    )}
                  </SelectWrapper>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Date de sortie *</Label>
                <Input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Type *</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="album">Album</option>
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Genres (séparés par des virgules)</Label>
                <Input
                  type="text"
                  name="genres"
                  value={Array.isArray(formData.genres) ? formData.genres.join(', ') : formData.genres}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                  }))}
                  placeholder="Pop, Rock, Jazz..."
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Button type="submit">
                {album ? 'Mettre à jour' : 'Créer'}
              </Button>
            </FormSection>

            {(album || (!album && formData.artistId)) && (
              <TrackManager
                albumId={album?.id}
                artistId={formData.artistId}
                onTracksChange={handleTracksChange}
              />
            )}
          </ContentLayout>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AlbumModal; 
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/AlbumStyles';
import * as api from '../utils/api';

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

const AlbumModal = ({ isOpen, onClose, onSubmit, album }) => {
  const [formData, setFormData] = useState({
    title: '',
    genres: '',
    releaseDate: '',
    type: 'album',
    artistId: '',
    artistName: ''
  });
  const [error, setError] = useState('');
  const [artistSearch, setArtistSearch] = useState('');
  const [artists, setArtists] = useState([]);
  const [showArtistList, setShowArtistList] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [initialArtist, setInitialArtist] = useState(null);
  const [availableTracks, setAvailableTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [showTracksList, setShowTracksList] = useState(false);
  const [trackSearch, setTrackSearch] = useState('');
  
  const artistWrapperRef = useRef(null);
  const tracksWrapperRef = useRef(null);

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        genres: Array.isArray(album.genres) ? album.genres.join(', ') : '',
        releaseDate: album.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
        type: album.type || 'album',
        artistId: album.artistId || '',
        artistName: album.artist || ''
      });
      setSelectedArtist({
        id: album.artistId,
        name: album.artist
      });
      setInitialArtist({
        id: album.artistId,
        name: album.artist
      });
      setArtistSearch(album.artist || '');
      
      // Charger les pistes actuelles de l'album
      if (album.tracks && Array.isArray(album.tracks)) {
        const formattedTracks = album.tracks.map(track => ({
          id: track._id || track.id,
          title: track.title
        }));
        setSelectedTracks(formattedTracks);
      }
    } else {
      setFormData({
        title: '',
        genres: '',
        releaseDate: '',
        type: 'album',
        artistId: '',
        artistName: ''
      });
      setSelectedArtist(null);
      setInitialArtist(null);
      setArtistSearch('');
      setSelectedTracks([]);
    }
  }, [album]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (artistWrapperRef.current && !artistWrapperRef.current.contains(event.target)) {
        setShowArtistList(false);
      }
      if (tracksWrapperRef.current && !tracksWrapperRef.current.contains(event.target)) {
        setShowTracksList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowArtistList(false);
      setShowTracksList(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchArtistTracks = async () => {
      if (selectedArtist?.id) {
        try {
          const response = await api.fetchWithAuth(`/api/tracks?artistId=${selectedArtist.id}`);
          if (response.success) {
            setAvailableTracks(response.data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des pistes:', error);
        }
      } else {
        setAvailableTracks([]);
      }
    };

    fetchArtistTracks();
  }, [selectedArtist]);

  const searchArtists = async (query) => {
    if (!query.trim()) {
      setArtists([]);
      return;
    }

    try {
      const response = await api.fetchWithAuth(`/api/artists?name=${encodeURIComponent(query)}`);
      if (response.success) {
        setArtists(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des artistes:', error);
    }
  };

  const handleArtistSearch = (e) => {
    const value = e.target.value;
    setArtistSearch(value);
    setShowArtistList(true);
    searchArtists(value);
  };

  const selectArtist = (artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.name);
    setFormData(prev => ({
      ...prev,
      artistId: artist.id,
      artistName: artist.name
    }));
    setShowArtistList(false);
    setSelectedTracks([]); // Réinitialiser les pistes sélectionnées
  };

  const handleTrackSearch = (e) => {
    setTrackSearch(e.target.value);
    setShowTracksList(true);
  };

  const toggleTrack = (track) => {
    setSelectedTracks(prev => {
      const isSelected = prev.some(t => t.id === track.id);
      if (isSelected) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Le titre de l'album est requis");
      return;
    }

    if (!selectedArtist && !artistSearch.trim()) {
      setError("L'artiste est requis");
      return;
    }

    try {
      let artistId = selectedArtist?.id;

      // Créer un nouvel artiste seulement si :
      // - Nous ne sommes pas en mode édition OU l'artiste a été changé
      // - ET aucun artiste existant n'est sélectionné
      // - ET un nom d'artiste a été saisi
      if (!artistId && artistSearch.trim() && 
          (!album || (album && artistSearch !== initialArtist?.name))) {
        const newArtistResponse = await api.createArtist(artistSearch.trim());
        if (newArtistResponse.success) {
          artistId = newArtistResponse.data._id;
        } else {
          throw new Error("Erreur lors de la création de l'artiste");
        }
      }

      // Si nous sommes en mode édition et que l'artiste n'a pas changé, utiliser l'ID initial
      if (album && artistSearch === initialArtist?.name) {
        artistId = initialArtist.id;
      }

      const albumData = {
        title: formData.title.trim(),
        artistId: artistId,
        type: formData.type || 'album',
        releaseDate: formData.releaseDate || new Date().toISOString(),
        genres: formData.genres
          ? formData.genres.split(',').map(g => g.trim()).filter(Boolean)
          : [],
        coverImage: null,
        tracks: selectedTracks.map(track => track.id)
      };

      await onSubmit(albumData);
      setError('');
    } catch (error) {
      console.error('Erreur complète:', error);
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  const filteredTracks = availableTracks.filter(track => 
    track.title.toLowerCase().includes(trackSearch.toLowerCase())
  );

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
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'album"
                />
              </FormGroup>

              <FormGroup>
                <Label>Artiste *</Label>
                <SelectWrapper ref={artistWrapperRef} className="artist-select-wrapper">
                  <Input
                    type="text"
                    value={artistSearch}
                    onChange={handleArtistSearch}
                    onFocus={() => setShowArtistList(true)}
                    placeholder="Rechercher un artiste..."
                  />
                  {showArtistList && (artistSearch || artists.length > 0) && (
                    <DropdownList>
                      {artists.map(artist => (
                        <DropdownItem
                          key={artist.id}
                          onClick={() => selectArtist(artist)}
                        >
                          {artist.name}
                        </DropdownItem>
                      ))}
                      {artistSearch && !artists.find(a => a.name.toLowerCase() === artistSearch.toLowerCase()) && (
                        <DropdownItem
                          className="new-item"
                          onClick={() => {
                            setSelectedArtist(null);
                            setShowArtistList(false);
                          }}
                        >
                          + Créer "{artistSearch}"
                        </DropdownItem>
                      )}
                    </DropdownList>
                  )}
                </SelectWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="album">Album</option>
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                </Select>
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
                <Label>Genres (séparés par des virgules)</Label>
                <Input
                  type="text"
                  value={formData.genres}
                  onChange={e => setFormData(prev => ({ ...prev, genres: e.target.value }))}
                  placeholder="Rock, Pop, Jazz..."
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <ButtonContainer>
                <Button type="submit">
                  {album ? 'Modifier' : 'Créer'}
                </Button>
              </ButtonContainer>
            </FormSection>

            <TracksSection>
              <TracksHeader>
                <TracksTitle>Pistes</TracksTitle>
                <TracksCount>{selectedTracks.length} piste{selectedTracks.length !== 1 ? 's' : ''}</TracksCount>
              </TracksHeader>

              <SelectWrapper ref={tracksWrapperRef} className="tracks-select-wrapper">
                <Input
                  type="text"
                  value={trackSearch}
                  onChange={handleTrackSearch}
                  onFocus={() => setShowTracksList(true)}
                  placeholder={selectedArtist ? "Rechercher des pistes..." : "Sélectionnez d'abord un artiste"}
                  disabled={!selectedArtist}
                />
                {showTracksList && selectedArtist && (
                  <DropdownList>
                    {filteredTracks.map(track => (
                      <DropdownItem
                        key={track.id}
                        onClick={() => toggleTrack(track)}
                        className={selectedTracks.some(t => t.id === track.id) ? 'selected' : ''}
                      >
                        {track.title}
                        {selectedTracks.some(t => t.id === track.id) && (
                          <span style={{ marginLeft: 'auto' }}>✓</span>
                        )}
                      </DropdownItem>
                    ))}
                    {filteredTracks.length === 0 && (
                      <DropdownItem className="disabled">
                        Aucune piste trouvée
                      </DropdownItem>
                    )}
                  </DropdownList>
                )}
              </SelectWrapper>

              <TracksList>
                {selectedTracks.length > 0 ? (
                  <SelectedTracksContainer>
                    <TracksTable>
                      <thead>
                        <tr>
                          <TracksTableHeader style={{ width: '40px' }}>#</TracksTableHeader>
                          <TracksTableHeader>Titre</TracksTableHeader>
                          <TracksTableHeader style={{ width: '40px' }}></TracksTableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTracks.map((track, index) => (
                          <TracksTableRow key={track.id}>
                            <TracksTableCell>{index + 1}</TracksTableCell>
                            <TracksTableCell>{track.title}</TracksTableCell>
                            <TracksTableCell>
                              <DeleteButton type="button" onClick={() => toggleTrack(track)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </DeleteButton>
                            </TracksTableCell>
                          </TracksTableRow>
                        ))}
                      </tbody>
                    </TracksTable>
                  </SelectedTracksContainer>
                ) : (
                  <div style={{ color: '#b3b3b3', textAlign: 'center', padding: '2rem' }}>
                    Aucune piste sélectionnée
                  </div>
                )}
              </TracksList>
            </TracksSection>
          </ContentLayout>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AlbumModal; 